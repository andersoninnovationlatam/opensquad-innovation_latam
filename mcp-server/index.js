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

    app.listen(port, '0.0.0.0', () => {
        console.error(`[mcp] streamable HTTP listening on :${port}/mcp; tools: ${tools.map(t => t.name).join(', ')}`);
    });
} else {
    console.error(`[mcp] FATAL: unsupported MCP_TRANSPORT="${transport}" (use "stdio" or "http")`);
    process.exit(1);
}
