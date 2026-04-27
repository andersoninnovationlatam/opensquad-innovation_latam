import { z } from 'zod';
import { apiClient, ApiError } from './api-client.js';

const TERMINAL_STATUSES = new Set(['completed', 'done', 'failed', 'error']);
const VALID_ANGLES = ['educacional', 'medo', 'entusiasmo', 'curiosidade', 'polemica', 'empatia'];
const DEFAULT_SQUAD = 'carousel-noticias';

function textResult(value) {
    return {
        content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }]
    };
}

function errorResult(err) {
    const msg = err instanceof ApiError
        ? `API ${err.status}: ${err.message}`
        : `Error: ${err?.message || String(err)}`;
    return { content: [{ type: 'text', text: msg }], isError: true };
}

function wrap(handler) {
    return async (args) => {
        try { return await handler(args); }
        catch (err) { return errorResult(err); }
    };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const tools = [
    {
        name: 'list_squads',
        config: {
            title: 'List squads',
            description: 'Lista todos os squads (templates de geração) disponíveis no sistema. Use isso primeiro para descobrir o `squad` correto a passar em outras tools.',
            inputSchema: {}
        },
        handler: wrap(async () => {
            const data = await apiClient.listSquads();
            return textResult(data);
        })
    },

    {
        name: 'list_runs',
        config: {
            title: 'List recent runs',
            description: 'Lista execuções recentes (mais novas primeiro). Útil para retomar/inspecionar runs em andamento ou já concluídas.',
            inputSchema: {
                squad: z.string().optional().describe('Filtra por squad (ex.: carousel-noticias). Omite para listar de todos os squads.'),
                limit: z.number().int().min(1).max(200).optional().describe('Quantos runs retornar (padrão 50, máximo 200).')
            }
        },
        handler: wrap(async ({ squad, limit }) => {
            const data = await apiClient.listRuns({ squad, limit });
            return textResult(data);
        })
    },

    {
        name: 'generate_carousel',
        config: {
            title: 'Generate Instagram carousel',
            description: 'Inicia a geração de um carrossel do Instagram para a notícia fornecida. Retorna `runId`. A geração é assíncrona — use `wait_for_completion` para aguardar o término e depois `get_output` para obter as URLs das imagens.',
            inputSchema: {
                news: z.string().min(1).max(10_000).describe('Texto bruto da notícia (até 10.000 caracteres).'),
                angle: z.enum(VALID_ANGLES).describe('Ângulo editorial: educacional | medo | entusiasmo | curiosidade | polemica | empatia.'),
                squad: z.string().optional().describe(`Código do squad (padrão: ${DEFAULT_SQUAD}). Use list_squads para descobrir alternativas.`)
            }
        },
        handler: wrap(async ({ news, angle, squad }) => {
            const data = await apiClient.generate({ news, angle, squad });
            return textResult({
                ...data,
                hint: 'Próximo passo: wait_for_completion({ squad, runId }) para aguardar o término, depois get_output({ squad, runId }) para baixar as imagens.'
            });
        })
    },

    {
        name: 'get_status',
        config: {
            title: 'Get run status',
            description: 'Retorna o estado atual de uma execução (status, step atual, isActive). Para aguardar o término, prefira `wait_for_completion`.',
            inputSchema: {
                squad: z.string().describe('Código do squad (ex.: carousel-noticias).'),
                runId: z.string().describe('Identificador da execução retornado por generate_carousel.')
            }
        },
        handler: wrap(async ({ squad, runId }) => {
            const data = await apiClient.getStatus({ squad, runId });
            return textResult(data);
        })
    },

    {
        name: 'wait_for_completion',
        config: {
            title: 'Wait for run completion',
            description: 'Aguarda (via polling client-side) até a execução terminar (completed/failed) ou até o timeout. Retorna o último estado conhecido + log de transições de step.',
            inputSchema: {
                squad: z.string().describe('Código do squad (ex.: carousel-noticias).'),
                runId: z.string().describe('Identificador da execução.'),
                timeoutSeconds: z.number().int().min(10).max(600).optional().describe('Tempo máximo de espera em segundos (padrão 600 = 10 min).'),
                pollIntervalSeconds: z.number().int().min(2).max(30).optional().describe('Intervalo entre verificações em segundos (padrão 5).')
            }
        },
        handler: wrap(async ({ squad, runId, timeoutSeconds = 600, pollIntervalSeconds = 5 }) => {
            const startedAt = Date.now();
            const deadline = startedAt + timeoutSeconds * 1000;
            const transitions = [];
            let lastStep = null;
            let lastStatus = null;
            let lastState = null;

            while (Date.now() < deadline) {
                let state;
                try {
                    state = await apiClient.getStatus({ squad, runId });
                } catch (err) {
                    if (err instanceof ApiError && err.status === 404) {
                        await sleep(pollIntervalSeconds * 1000);
                        continue;
                    }
                    throw err;
                }
                lastState = state;

                const status = state?.status || 'unknown';
                const stepLabel = state?.step?.label || state?.step?.current || null;
                if (status !== lastStatus || stepLabel !== lastStep) {
                    transitions.push({
                        at: new Date().toISOString(),
                        elapsedSeconds: Math.round((Date.now() - startedAt) / 1000),
                        status,
                        step: state?.step || null
                    });
                    lastStatus = status;
                    lastStep = stepLabel;
                }

                if (TERMINAL_STATUSES.has(status)) {
                    return textResult({ outcome: status, runId, squad, durationSeconds: Math.round((Date.now() - startedAt) / 1000), transitions, finalState: state });
                }

                await sleep(pollIntervalSeconds * 1000);
            }

            return textResult({
                outcome: 'timeout',
                runId,
                squad,
                durationSeconds: Math.round((Date.now() - startedAt) / 1000),
                transitions,
                finalState: lastState,
                hint: 'A execução continua rodando no servidor. Chame get_status novamente mais tarde, ou aumente timeoutSeconds.'
            });
        })
    },

    {
        name: 'get_output',
        config: {
            title: 'Get run output (image URLs)',
            description: 'Retorna a lista de imagens (slides) geradas com URLs absolutas. Cada URL exige o mesmo Bearer token para download.',
            inputSchema: {
                squad: z.string().describe('Código do squad.'),
                runId: z.string().describe('Identificador da execução.')
            }
        },
        handler: wrap(async ({ squad, runId }) => {
            const data = await apiClient.getOutput({ squad, runId });
            return textResult(data);
        })
    }
];
