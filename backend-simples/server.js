import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs, openSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In production (Docker), the backend-simples is in /app/backend-simples
// ROOT_DIR should be /app
const ROOT_DIR = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '..')
    : path.resolve(__dirname, '..');
// Actually, it's the same if the structure is preserved.

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Enable CORS for the frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Log every incoming request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.post('/api/generate', async (req, res) => {
    const { news, angle } = req.body;

    if (!news || !angle) {
        return res.status(400).json({ error: 'News and angle are required' });
    }

    try {
        const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const squadName = 'carousel-noticias';
        const runDir = path.join(ROOT_DIR, 'squads', squadName, 'output', runId);

        await fs.mkdir(runDir, { recursive: true });

        // Inject inputs
        await fs.writeFile(path.join(runDir, 'news-input.md'), `# News Input\n\n${news}`);
        await fs.writeFile(path.join(runDir, 'selected-angle.md'), `# Angle Selection\n\n**Selected Angle:** ${angle}`);

        // Redirect runner stdout/stderr to a log file so we can diagnose issues
        const logPath = path.join(runDir, 'runner.log');
        const logFd = openSync(logPath, 'w');

        console.log(`[generate] Spawning headless-runner for runId=${runId}`);
        console.log(`[generate] Runner log: ${logPath}`);
        console.log(`[generate] ROOT_DIR: ${ROOT_DIR}`);
        console.log(`[generate] Runner path: ${path.join(ROOT_DIR, 'src/headless-runner.js')}`);

        const runnerProcess = spawn('node', [
            path.join(ROOT_DIR, 'src/headless-runner.js'),
            '--squad', squadName,
            '--runId', runId,
            '--startStep', '4'
        ], {
            cwd: ROOT_DIR,
            detached: true,
            stdio: ['ignore', logFd, logFd],
            env: { ...process.env }
        });

        runnerProcess.on('error', (err) => {
            console.error(`[generate] Failed to spawn runner for runId=${runId}:`, err);
        });

        runnerProcess.unref();

        res.json({
            success: true,
            runId,
            message: 'Squad execution started',
            statusUrl: `/api/status/${squadName}/${runId}`
        });
    } catch (error) {
        console.error('Error starting squad:', error);
        res.status(500).json({ error: 'Failed to start squad execution' });
    }
});

app.get('/api/status/:squad/:runId', async (req, res) => {
    const { squad, runId } = req.params;
    const statePath = path.join(ROOT_DIR, 'squads', squad, 'output', runId, 'state.json');

    try {
        const state = await fs.readFile(statePath, 'utf-8');
        res.json(JSON.parse(state));
    } catch (error) {
        console.warn(`[status] state.json not found for runId=${runId}: ${error.message}`);
        res.status(404).json({ error: 'Run not found or state not yet available' });
    }
});

// Return last N lines of runner.log so the frontend can display errors
app.get('/api/logs/:squad/:runId', async (req, res) => {
    const { squad, runId } = req.params;
    const logPath = path.join(ROOT_DIR, 'squads', squad, 'output', runId, 'runner.log');

    try {
        const content = await fs.readFile(logPath, 'utf-8');
        const lines = content.split('\n');
        const tail = lines.slice(-100).join('\n'); // last 100 lines
        res.type('text/plain').send(tail);
    } catch (error) {
        res.status(404).send(`Log not found for runId=${runId}`);
    }
});

app.listen(port, () => {
    console.log(`Backend bridge listening at http://localhost:${port}`);
});
