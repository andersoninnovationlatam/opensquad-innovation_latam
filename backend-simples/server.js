import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs, openSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
const port = process.env.PORT || 3001;

// ── Auth ─────────────────────────────────────────────────────────────

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
    console.warn('[auth] WARN: AUTH_SECRET not set — authentication will reject all requests.');
}

const VALID_ANGLES = new Set(['educacional', 'medo', 'entusiasmo', 'curiosidade', 'polemica', 'empatia']);

// Only alphanumeric, hyphens and underscores — prevents path traversal
const SAFE_ID_RE = /^[a-zA-Z0-9_-]+$/;

function loadUsers() {
    try {
        return JSON.parse(process.env.USERS_JSON || '[]');
    } catch {
        return [];
    }
}

function hashPassword(password) {
    return crypto.createHmac('sha256', AUTH_SECRET || '').update(password).digest('hex');
}

function generateToken(username) {
    const exp = Date.now() + 8 * 60 * 60 * 1000; // 8 horas
    const payload = `${username}|${exp}`;
    const sig = crypto.createHmac('sha256', AUTH_SECRET || '').update(payload).digest('hex');
    return Buffer.from(`${payload}|${sig}`).toString('base64url');
}

function verifyToken(token) {
    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf-8');
        const lastPipe = decoded.lastIndexOf('|');
        const secondLastPipe = decoded.lastIndexOf('|', lastPipe - 1);
        if (lastPipe === -1 || secondLastPipe === -1) return null;

        const payload = decoded.slice(0, lastPipe);
        const sig = decoded.slice(lastPipe + 1);
        const exp = parseInt(decoded.slice(secondLastPipe + 1, lastPipe), 10);

        if (Date.now() > exp) return null;

        const expectedSig = crypto.createHmac('sha256', AUTH_SECRET || '').update(payload).digest('hex');
        if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))) return null;

        return decoded.slice(0, secondLastPipe); // username
    } catch {
        return null;
    }
}

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const username = verifyToken(auth.slice(7));
    if (!username) return res.status(401).json({ error: 'Unauthorized' });
    req.user = username;
    next();
}

// ── Rate limit (in-memory, resets on restart — fine for single instance) ──

const rateLimitMap = new Map();

function rateLimit(windowMs, max) {
    return (req, res, next) => {
        const key = req.ip || req.socket.remoteAddress;
        const now = Date.now();
        let entry = rateLimitMap.get(key);
        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
        }
        entry.count++;
        rateLimitMap.set(key, entry);
        if (entry.count > max) return res.status(429).json({ error: 'Too many requests' });
        next();
    };
}

// ── Middleware ────────────────────────────────────────────────────────

app.use(bodyParser.json());

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = process.env.FRONTEND_URL;
    if (allowed) {
        if (origin === allowed) res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} user=${req.user || '-'}`);
    next();
});

// ── Public routes ─────────────────────────────────────────────────────

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/login', rateLimit(60_000, 10), (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const users = loadUsers();
    const user = users.find(u => u.username === username);
    if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    res.json({ token: generateToken(username) });
});

// ── Protected routes ──────────────────────────────────────────────────

app.post('/api/generate', requireAuth, rateLimit(60_000, 5), async (req, res) => {
    const { news, angle } = req.body;

    if (!news || !angle) return res.status(400).json({ error: 'News and angle are required' });
    if (!VALID_ANGLES.has(angle)) return res.status(400).json({ error: 'Invalid angle' });
    if (typeof news !== 'string' || news.length > 10_000) return res.status(400).json({ error: 'Invalid news content' });

    try {
        const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const squadName = 'carousel-noticias';
        const runDir = path.join(ROOT_DIR, 'squads', squadName, 'output', runId);

        await fs.mkdir(runDir, { recursive: true });
        await fs.writeFile(path.join(runDir, 'news-input.md'), `# News Input\n\n${news}`);
        await fs.writeFile(path.join(runDir, 'selected-angle.md'), `# Angle Selection\n\n**Selected Angle:** ${angle}`);

        const logPath = path.join(runDir, 'runner.log');
        const logFd = openSync(logPath, 'w');

        console.log(`[generate] user=${req.user} runId=${runId}`);

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

        res.json({ success: true, runId, statusUrl: `/api/status/${squadName}/${runId}` });
    } catch (error) {
        console.error('Error starting squad:', error);
        res.status(500).json({ error: 'Failed to start squad execution' });
    }
});

app.get('/api/status/:squad/:runId', requireAuth, async (req, res) => {
    const { squad, runId } = req.params;
    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const statePath = path.join(ROOT_DIR, 'squads', squad, 'output', runId, 'state.json');
    try {
        const state = await fs.readFile(statePath, 'utf-8');
        res.json(JSON.parse(state));
    } catch {
        res.status(404).json({ error: 'Run not found or state not yet available' });
    }
});

app.get('/api/logs/:squad/:runId', requireAuth, async (req, res) => {
    const { squad, runId } = req.params;
    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const logPath = path.join(ROOT_DIR, 'squads', squad, 'output', runId, 'runner.log');
    try {
        const content = await fs.readFile(logPath, 'utf-8');
        const tail = content.split('\n').slice(-100).join('\n');
        res.type('text/plain').send(tail);
    } catch {
        res.status(404).send(`Log not found for runId=${runId}`);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend bridge listening at http://0.0.0.0:${port}`);
});
