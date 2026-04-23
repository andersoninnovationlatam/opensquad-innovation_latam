import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs } from 'node:fs';
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

        // Trigger squad execution (Headless Runner)
        // Note: In a real scenario, we would use a proper task queue.
        // For now, we'll spawn the process and return the runId.
        const runnerProcess = spawn('node', [
            path.join(ROOT_DIR, 'src/headless-runner.js'),
            '--squad', squadName,
            '--runId', runId,
            '--startStep', '4'
        ], {
            cwd: ROOT_DIR,
            detached: true,
            stdio: 'ignore'
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
        res.status(404).json({ error: 'Run not found or state not yet available' });
    }
});

app.listen(port, () => {
    console.log(`Backend bridge listening at http://localhost:${port}`);
});
