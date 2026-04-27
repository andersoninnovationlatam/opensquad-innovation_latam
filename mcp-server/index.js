import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'node:crypto';
import express from 'express';
import { tools } from './lib/tools.js';

if (!process.env.API_URL) {
    console.error('[mcp] FATAL: API_URL env var is required');
    process.exit(1);
}
if (!process.env.API_TOKEN) {
    console.error('[mcp] FATAL: API_TOKEN env var is required (must match one of backend API_TOKENS)');
    process.exit(1);
}

function buildServer() {
    const server = new McpServer({
        name: 'opensquad-carousel',
        version: '1.0.0'
    });
    for (const t of tools) {
        server.registerTool(t.name, t.config, t.handler);
    }
    return server;
}

const transport = (process.env.MCP_TRANSPORT || 'stdio').toLowerCase();

if (transport === 'stdio') {
    const server = buildServer();
    const stdio = new StdioServerTransport();
    await server.connect(stdio);
    console.error(`[mcp] stdio transport connected; tools: ${tools.map(t => t.name).join(', ')}`);
} else if (transport === 'http' || transport === 'streamable-http') {
    const port = parseInt(process.env.MCP_PORT || '3002', 10);
    const app = express();
    app.use(express.json({ limit: '200kb' }));

    // One transport+server per session
    const sessions = new Map(); // sessionId -> {server, transport}

    app.all('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'];

        let entry;
        if (sessionId && sessions.has(sessionId)) {
            entry = sessions.get(sessionId);
        } else if (!sessionId && req.method === 'POST') {
            const server = buildServer();
            const httpTransport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                onsessioninitialized: (id) => sessions.set(id, { server, transport: httpTransport })
            });
            httpTransport.onclose = () => {
                if (httpTransport.sessionId) sessions.delete(httpTransport.sessionId);
            };
            await server.connect(httpTransport);
            entry = { server, transport: httpTransport };
        } else {
            res.status(400).json({ error: 'Missing or unknown mcp-session-id' });
            return;
        }

        try {
            await entry.transport.handleRequest(req, res, req.body);
        } catch (err) {
            console.error('[mcp] handleRequest error:', err);
            if (!res.headersSent) res.status(500).json({ error: err.message });
        }
    });

    app.get('/health', (req, res) => res.json({ status: 'ok', sessions: sessions.size }));

    // ── REST adapter (Insomnia / curl friendly) ───────────────────────────────
    const { apiClient, ApiError } = await import('./lib/api-client.js');

    function restAuth(req, res, next) {
        const token = process.env.REST_TOKEN || process.env.API_TOKEN;
        if (!token) return next();
        const auth = req.headers['authorization'] || '';
        if (auth === `Bearer ${token}`) return next();
        res.status(401).json({ error: 'Unauthorized' });
    }

    function restErr(res, err) {
        const status = err instanceof ApiError ? (err.status || 502) : 500;
        res.status(status).json({ error: err.message });
    }

    app.use('/api', restAuth);

    app.get('/api/squads', async (_req, res) => {
        try { res.json(await apiClient.listSquads()); }
        catch (err) { restErr(res, err); }
    });

    app.get('/api/runs', async (req, res) => {
        try {
            const { squad, limit } = req.query;
            res.json(await apiClient.listRuns({ squad, limit: limit ? Number(limit) : undefined }));
        } catch (err) { restErr(res, err); }
    });

    app.post('/api/runs', async (req, res) => {
        try {
            const { news, angle, squad } = req.body || {};
            if (!news || !angle) return res.status(400).json({ error: '`news` and `angle` are required' });
            res.json(await apiClient.generate({ news, angle, squad }));
        } catch (err) { restErr(res, err); }
    });

    app.get('/api/runs/:squad/:runId/status', async (req, res) => {
        try {
            const { squad, runId } = req.params;
            res.json(await apiClient.getStatus({ squad, runId }));
        } catch (err) { restErr(res, err); }
    });

    app.get('/api/runs/:squad/:runId/output', async (req, res) => {
        try {
            const { squad, runId } = req.params;
            res.json(await apiClient.getOutput({ squad, runId }));
        } catch (err) { restErr(res, err); }
    });

    const TERMINAL_STATUSES_REST = new Set(['completed', 'done', 'failed', 'error']);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    app.post('/api/runs/:squad/:runId/wait', async (req, res) => {
        try {
            const { squad, runId } = req.params;
            const timeoutSeconds = Number(req.body?.timeoutSeconds ?? 600);
            const pollIntervalSeconds = Number(req.body?.pollIntervalSeconds ?? 5);
            const deadline = Date.now() + timeoutSeconds * 1000;
            const startedAt = Date.now();
            const transitions = [];
            let lastStep = null, lastStatus = null, lastState = null;

            while (Date.now() < deadline) {
                let state;
                try { state = await apiClient.getStatus({ squad, runId }); }
                catch (err) {
                    if (err instanceof ApiError && err.status === 404) {
                        await sleep(pollIntervalSeconds * 1000); continue;
                    }
                    throw err;
                }
                lastState = state;
                const status = state?.status || 'unknown';
                const stepLabel = state?.step?.label || state?.step?.current || null;
                if (status !== lastStatus || stepLabel !== lastStep) {
                    transitions.push({ at: new Date().toISOString(), elapsedSeconds: Math.round((Date.now() - startedAt) / 1000), status, step: state?.step || null });
                    lastStatus = status; lastStep = stepLabel;
                }
                if (TERMINAL_STATUSES_REST.has(status)) {
                    return res.json({ outcome: status, runId, squad, durationSeconds: Math.round((Date.now() - startedAt) / 1000), transitions, finalState: state });
                }
                await sleep(pollIntervalSeconds * 1000);
            }

            res.json({ outcome: 'timeout', runId, squad, durationSeconds: Math.round((Date.now() - startedAt) / 1000), transitions, finalState: lastState });
        } catch (err) { restErr(res, err); }
    });
    // ─────────────────────────────────────────────────────────────────────────

    app.listen(port, '0.0.0.0', () => {
        console.error(`[mcp] streamable HTTP listening on :${port}/mcp; tools: ${tools.map(t => t.name).join(', ')}`);
        console.error(`[rest] REST API available at :${port}/api — use Bearer token from REST_TOKEN or API_TOKEN`);
    });
} else {
    console.error(`[mcp] FATAL: unsupported MCP_TRANSPORT="${transport}" (use "stdio" or "http")`);
    process.exit(1);
}
