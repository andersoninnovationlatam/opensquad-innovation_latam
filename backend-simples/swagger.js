export const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Opensquad Backend API',
        description: `
API REST do backend Opensquad para geração e gerenciamento de carrosséis de conteúdo via squads de IA.

## Autenticação

A API suporta dois métodos de autenticação via **Bearer Token**:

- **HMAC Token (Login):** Obtido via \`POST /api/v1/login\`. Expira em 8 horas.
- **Static API Token:** Token estático configurado via variável de ambiente \`API_TOKENS\`. Não expira.

Envie o token no header: \`Authorization: Bearer <token>\`
        `.trim(),
        version: '1.0.0',
        contact: {
            name: 'Innovation Latam',
            email: 'anderson.pinto@innovationlatam.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Desenvolvimento local'
        }
    ],
    tags: [
        { name: 'Health', description: 'Status e saúde da API' },
        { name: 'Auth', description: 'Autenticação e tokens' },
        { name: 'Squads', description: 'Squads de IA disponíveis' },
        { name: 'Runs', description: 'Execuções de geração de conteúdo' },
        { name: 'Output', description: 'Resultados e arquivos gerados' }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token HMAC obtido via /api/v1/login ou token estático configurado via API_TOKENS'
            }
        },
        schemas: {
            SuccessWrapper: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true }
                },
                required: ['success']
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string', example: 'INVALID_PARAM' },
                            message: { type: 'string', example: 'Invalid squad name' }
                        },
                        required: ['code', 'message']
                    }
                },
                required: ['success', 'error']
            },
            HealthBasic: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'number', example: 3600.5, description: 'Segundos de uptime do processo' }
                }
            },
            HealthFull: {
                allOf: [
                    { $ref: '#/components/schemas/SuccessWrapper' },
                    {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'ok' },
                                    uptime: { type: 'number', example: 3600.5 },
                                    version: { type: 'string', example: '1.0.0' },
                                    activeRuns: { type: 'integer', example: 1 },
                                    maxConcurrentRuns: { type: 'integer', example: 2 }
                                }
                            }
                        }
                    }
                ]
            },
            AngleEnum: {
                type: 'string',
                enum: ['educacional', 'medo', 'entusiasmo', 'curiosidade', 'polemica', 'empatia'],
                description: 'Ângulo editorial do carrossel',
                example: 'educacional'
            },
            RunStatus: {
                type: 'string',
                enum: ['running', 'completed', 'failed', 'orphaned'],
                example: 'running'
            },
            StepInfo: {
                type: 'object',
                properties: {
                    current: { type: 'integer', example: 3 },
                    total: { type: 'integer', example: 8 },
                    label: { type: 'string', example: 'Gerando slides' }
                }
            },
            RunStatusFull: {
                type: 'object',
                properties: {
                    squad: { type: 'string', example: 'carousel-noticias' },
                    status: { $ref: '#/components/schemas/RunStatus' },
                    step: { $ref: '#/components/schemas/StepInfo' },
                    pid: { type: 'integer', example: 12345, nullable: true },
                    startedAt: { type: 'string', format: 'date-time', example: '2026-04-27T10:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2026-04-27T10:02:00.000Z' },
                    isActive: { type: 'boolean', example: true }
                }
            },
            ImageOutput: {
                type: 'object',
                properties: {
                    filename: { type: 'string', example: 'slide-01.png' },
                    url: { type: 'string', example: '/api/v1/files/carousel-noticias/run-abc123/slide-01.png' }
                }
            },
            Squad: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'carousel-noticias' },
                    description: { type: 'string', example: 'Gera carrosséis de notícias' }
                }
            },
            Run: {
                type: 'object',
                properties: {
                    runId: { type: 'string', example: 'run-abc123' },
                    squad: { type: 'string', example: 'carousel-noticias' },
                    status: { $ref: '#/components/schemas/RunStatus' },
                    startedAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    },
    security: [],
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check básico',
                description: 'Endpoint público de verificação de saúde. Útil para load balancers.',
                operationId: 'getHealthBasic',
                responses: {
                    '200': {
                        description: 'Servidor saudável',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HealthBasic' }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check completo da API',
                description: 'Retorna status detalhado da API incluindo versão, uptime e runs ativas. Endpoint público.',
                operationId: 'getHealthV1',
                responses: {
                    '200': {
                        description: 'API saudável com métricas',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HealthFull' }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/login': {
            post: {
                tags: ['Auth'],
                summary: 'Autenticar usuário',
                description: `
Autentica um usuário com username e password. Retorna um Bearer Token HMAC válido por **8 horas**.

Rate limit: **10 requisições/minuto** por IP.
                `.trim(),
                operationId: 'login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'password'],
                                properties: {
                                    username: { type: 'string', example: 'admin' },
                                    password: { type: 'string', format: 'password', example: 'senha123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Login bem-sucedido',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        token: {
                                                            type: 'string',
                                                            description: 'Bearer token HMAC (expira em 8h)',
                                                            example: 'dXNlcm5hbWV8MTc0NTc1MDAwMDAwMHxhYmNkZWYxMjM0NTY='
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Credenciais inválidas ou campos ausentes',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    },
                    '429': {
                        description: 'Rate limit excedido',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { error: { type: 'string', example: 'Too many requests' } }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/squads': {
            get: {
                tags: ['Squads'],
                summary: 'Listar squads disponíveis',
                description: 'Retorna todos os squads configurados e qual é o squad padrão.',
                operationId: 'listSquads',
                security: [{ BearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de squads',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        squads: {
                                                            type: 'array',
                                                            items: { $ref: '#/components/schemas/Squad' }
                                                        },
                                                        default: { type: 'string', example: 'carousel-noticias' }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Não autorizado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { error: { type: 'string', example: 'Unauthorized' } }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/generate': {
            post: {
                tags: ['Runs'],
                summary: 'Iniciar geração de carrossel',
                description: `
Inicia a geração de um carrossel de conteúdo em background a partir de uma notícia.

Rate limit: **5 requisições/minuto** por IP.

Limite de **${2} execuções simultâneas** — retorna 429 se o limite for atingido.

O \`runId\` retornado é usado para acompanhar o status via \`GET /api/v1/status/{squad}/{runId}\`.
                `.trim(),
                operationId: 'generateCarousel',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['news', 'angle'],
                                properties: {
                                    news: {
                                        type: 'string',
                                        maxLength: 10000,
                                        description: 'Texto da notícia a ser transformado em carrossel',
                                        example: 'Banco Central sobe juros para 14% ao ano em decisão unânime do Copom...'
                                    },
                                    angle: { $ref: '#/components/schemas/AngleEnum' },
                                    squad: {
                                        type: 'string',
                                        description: 'Nome do squad (padrão: carousel-noticias)',
                                        example: 'carousel-noticias'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Geração iniciada com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        runId: { type: 'string', example: 'run-abc123def456' },
                                                        statusUrl: {
                                                            type: 'string',
                                                            example: '/api/v1/status/carousel-noticias/run-abc123def456'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Parâmetros inválidos (angle não reconhecido, news muito longa, etc.)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    },
                    '401': {
                        description: 'Não autorizado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { error: { type: 'string', example: 'Unauthorized' } }
                                }
                            }
                        }
                    },
                    '429': {
                        description: 'Limite de execuções simultâneas atingido ou rate limit excedido',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/ErrorResponse' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        activeRuns: {
                                                            type: 'array',
                                                            items: { type: 'string' },
                                                            description: 'RunIds atualmente em execução'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/status/{squad}/{runId}': {
            get: {
                tags: ['Runs'],
                summary: 'Status de uma execução',
                description: 'Retorna o estado atual de um run, incluindo etapa corrente, PID e timestamps.',
                operationId: 'getRunStatus',
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'squad',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'carousel-noticias'
                    },
                    {
                        name: 'runId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'run-abc123def456'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Status do run',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: { data: { $ref: '#/components/schemas/RunStatusFull' } }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '400': { description: 'squad ou runId inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    '401': { description: 'Não autorizado', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } },
                    '404': { description: 'Run não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/v1/logs/{squad}/{runId}': {
            get: {
                tags: ['Runs'],
                summary: 'Logs de uma execução',
                description: 'Retorna as últimas 100 linhas do log de execução em texto plano.',
                operationId: 'getRunLogs',
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'squad',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'carousel-noticias'
                    },
                    {
                        name: 'runId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'run-abc123def456'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Linhas de log',
                        content: {
                            'text/plain': {
                                schema: { type: 'string', example: '[10:00:01] Step 1/8: Analisando notícia...\n[10:00:05] Step 2/8: Gerando outline...' }
                            }
                        }
                    },
                    '400': { description: 'Parâmetros inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    '401': { description: 'Não autorizado', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } },
                    '404': { description: 'Run ou log não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/v1/runs': {
            get: {
                tags: ['Runs'],
                summary: 'Listar execuções recentes',
                description: 'Lista os runs mais recentes. Pode filtrar por squad. Padrão: 50 runs, máximo: 200.',
                operationId: 'listRuns',
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'squad',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                        description: 'Filtrar por nome do squad',
                        example: 'carousel-noticias'
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', default: 50, minimum: 1, maximum: 200 },
                        description: 'Número máximo de runs a retornar'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Lista de runs',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        runs: { type: 'array', items: { $ref: '#/components/schemas/Run' } },
                                                        total: { type: 'integer', example: 12 }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '401': { description: 'Não autorizado', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
                }
            }
        },
        '/api/v1/runs/{squad}/{runId}': {
            delete: {
                tags: ['Runs'],
                summary: 'Cancelar run ou deletar arquivos',
                description: `
Cancela uma execução ativa (matando o processo) e/ou remove os arquivos gerados.

- Se o run estiver ativo, o processo é encerrado (\`SIGKILL\` no grupo).
- Use \`?deleteFiles=true\` para remover também os arquivos de output do disco.
                `.trim(),
                operationId: 'deleteRun',
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'squad',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'carousel-noticias'
                    },
                    {
                        name: 'runId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'run-abc123def456'
                    },
                    {
                        name: 'deleteFiles',
                        in: 'query',
                        required: false,
                        schema: { type: 'boolean', default: false },
                        description: 'Se true, remove os arquivos de output do disco'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Run cancelado/deletado com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        runId: { type: 'string', example: 'run-abc123def456' },
                                                        killed: { type: 'boolean', example: true, description: 'True se o processo foi encerrado' },
                                                        filesRemoved: { type: 'boolean', example: false, description: 'True se os arquivos foram removidos' }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '400': { description: 'Parâmetros inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    '401': { description: 'Não autorizado', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } },
                    '404': { description: 'Run não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/v1/output/{squad}/{runId}': {
            get: {
                tags: ['Output'],
                summary: 'Listar imagens geradas',
                description: 'Retorna a lista de imagens PNG geradas para um run, com URLs para download.',
                operationId: 'getRunOutput',
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'squad',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'carousel-noticias'
                    },
                    {
                        name: 'runId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'run-abc123def456'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Lista de imagens geradas',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/SuccessWrapper' },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        images: { type: 'array', items: { $ref: '#/components/schemas/ImageOutput' } },
                                                        count: { type: 'integer', example: 8 }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '400': { description: 'Parâmetros inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    '401': { description: 'Não autorizado', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } },
                    '404': { description: 'Run não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/api/v1/files/{squad}/{runId}/{filename}': {
            get: {
                tags: ['Output'],
                summary: 'Download de arquivo gerado',
                description: `
Serve um arquivo gerado por um run diretamente como binário.

Extensões permitidas: \`.png\`, \`.jpg\`, \`.jpeg\`, \`.webp\`, \`.gif\`, \`.json\`, \`.log\`, \`.txt\`, \`.md\`, \`.html\`

O Content-Type é detectado automaticamente a partir da extensão.
                `.trim(),
                operationId: 'getRunFile',
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'squad',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'carousel-noticias'
                    },
                    {
                        name: 'runId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
                        example: 'run-abc123def456'
                    },
                    {
                        name: 'filename',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Nome do arquivo (pode incluir subpastas)',
                        example: 'slide-01.png'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Arquivo binário',
                        content: {
                            'image/png': { schema: { type: 'string', format: 'binary' } },
                            'image/jpeg': { schema: { type: 'string', format: 'binary' } },
                            'application/json': { schema: { type: 'object' } },
                            'text/plain': { schema: { type: 'string' } }
                        }
                    },
                    '400': { description: 'Extensão não permitida ou path inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    '401': { description: 'Não autorizado', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } },
                    '404': { description: 'Arquivo não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        }
    }
};
