import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';

// Load environment variables from root .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT_DIR, '.env') });

const app = express();
const port = process.env.PORT || 3001;
const API_KEY = process.env.OPENSQUAD_API_KEY || 'opensquad-default-key';

app.use(bodyParser.json());

// Enable CORS for the frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-API-Key');
    next();
});

// Security Middleware
const authenticate = (req, res, next) => {
    const providedKey = req.headers['x-api-key'];
    if (!providedKey || providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }
    next();
};

app.post('/api/generate', authenticate, async (req, res) => {
    const { news, angle, callbackUrl } = req.body;

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

        console.log(`[${runId}] Starting squad ${squadName}...`);

        // Trigger squad execution (Headless Runner)
        const runnerProcess = spawn('node', [
            path.join(ROOT_DIR, 'src/headless-runner.js'),
            '--squad', squadName,
            '--runId', runId,
            '--startStep', '4'
        ], {
            cwd: ROOT_DIR,
            stdio: 'inherit' // Changed to inherit to see logs in the server console
        });

        // Handle completion and callback
        runnerProcess.on('close', async (code) => {
            console.log(`[${runId}] Squad finished with code ${code}`);

            if (callbackUrl) {
                console.log(`[${runId}] Sending callback to ${callbackUrl}...`);
                try {
                    const response = await fetch(callbackUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-OpenSquad-Signature': process.env.LARAVEL_WEBHOOK_SECRET || 'no-secret'
                        },
                        body: JSON.stringify({
                            runId,
                            squad: squadName,
                            status: code === 0 ? 'success' : 'failed',
                            code,
                            driveUrl: `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_FOLDER_ID || ''}`
                        })
                    });
                    console.log(`[${runId}] Callback response status: ${response.status}`);
                } catch (error) {
                    console.error(`[${runId}] Failed to send callback:`, error.message);
                }
            }
        });

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

app.get('/api/status/:squad/:runId', authenticate, async (req, res) => {
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
    console.log(`Security: X-API-Key authentication enabled.`);
});

