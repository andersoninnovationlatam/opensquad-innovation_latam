import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import yaml from 'js-yaml';
import mime from 'mime-types';
import { promises as fs, openSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SQUADS_DIR = path.resolve(ROOT_DIR, 'squads');
const REAL_SQUADS_DIR = (() => {
    try { return realpathSync(SQUADS_DIR); } catch { return SQUADS_DIR; }
})();

const VERSION = '1.0.0';
const VALID_ANGLES = new Set(['educacional', 'medo', 'entusiasmo', 'curiosidade', 'polemica', 'empatia']);
const SAFE_ID_RE = /^[a-zA-Z0-9_-]+$/;
const FILE_EXT_WHITELIST = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.json', '.log', '.txt', '.md', '.html']);

const RUN_TIMEOUT_MS = parseInt(process.env.RUN_TIMEOUT_MS || '600000', 10);
const MAX_CONCURRENT_RUNS = parseInt(process.env.MAX_CONCURRENT_RUNS || '2', 10);

const app = express();
const port = process.env.PORT || 3001;

// ── Auth: HMAC tokens (existing) + static API_TOKENS (new) ────────────

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
    console.warn('[auth] WARN: AUTH_SECRET not set — login flow disabled.');
}

function loadApiTokens() {
    const raw = process.env.API_TOKENS || '';
    return new Set(raw.split(',').map(t => t.trim()).filter(Boolean));
}
const API_TOKENS_SET = loadApiTokens();
if (API_TOKENS_SET.size === 0) {
    console.warn('[auth] WARN: API_TOKENS not set — only HMAC login tokens accepted.');
} else {
    console.log(`[auth] ${API_TOKENS_SET.size} static API token(s) loaded.`);
}

function loadUsers() {
    try { return JSON.parse(process.env.USERS_JSON || '[]'); } catch { return []; }
}

function hashPassword(password) {
    return crypto.createHmac('sha256', AUTH_SECRET || '').update(password).digest('hex');
}

function generateToken(username) {
    const exp = Date.now() + 8 * 60 * 60 * 1000;
    const payload = `${username}|${exp}`;
    const sig = crypto.createHmac('sha256', AUTH_SECRET || '').update(payload).digest('hex');
    return Buffer.from(`${payload}|${sig}`).toString('base64url');
}

function verifyHmacToken(token) {
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
        const sigBuf = Buffer.from(sig, 'hex');
        const expBuf = Buffer.from(expectedSig, 'hex');
        if (sigBuf.length !== expBuf.length) return null;
        if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

        return decoded.slice(0, secondLastPipe);
    } catch {
        return null;
    }
}

function verifyStaticToken(token) {
    if (API_TOKENS_SET.size === 0) return false;
    const tokenBuf = Buffer.from(token);
    for (const valid of API_TOKENS_SET) {
        const validBuf = Buffer.from(valid);
        if (tokenBuf.length !== validBuf.length) continue;
        if (crypto.timingSafeEqual(tokenBuf, validBuf)) return true;
    }
    return false;
}

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.slice(7);

    const username = verifyHmacToken(token);
    if (username) {
        req.user = username;
        req.authMethod = 'hmac';
        return next();
    }

    if (verifyStaticToken(token)) {
        req.user = 'api-token';
        req.authMethod = 'static';
        return next();
    }

    return res.status(401).json({ error: 'Unauthorized' });
}

// ── Process registry ──────────────────────────────────────────────────

/**
 * Map<runId, {
 *   state: 'reserving' | 'running',
 *   squad: string,
 *   startedAt: number,
 *   process?: ChildProcess,
 *   pid?: number,
 *   timeoutHandle?: NodeJS.Timeout
 * }>
 */
const activeProcesses = new Map();

function generateRunId() {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 23)
        + '-' + crypto.randomBytes(3).toString('hex');
}

function reserveSlotOrReject(res, squad) {
    if (activeProcesses.size >= MAX_CONCURRENT_RUNS) {
        const active = Array.from(activeProcesses.entries()).map(([runId, info]) => ({
            runId, squad: info.squad, startedAt: info.startedAt
        }));
        res.status(429).json({ error: 'Servidor ocupado. Tente novamente em alguns instantes.', active });
        return null;
    }
    const runId = generateRunId();
    activeProcesses.set(runId, { state: 'reserving', squad, startedAt: Date.now() });
    return runId;
}

async function writeStateFile(runDir, patch) {
    const statePath = path.join(runDir, 'state.json');
    let current = {};
    try {
        current = JSON.parse(await fs.readFile(statePath, 'utf-8'));
    } catch {}
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    await fs.writeFile(statePath, JSON.stringify(next, null, 2));
    return next;
}

function killGroup(runId, reason) {
    const info = activeProcesses.get(runId);
    if (!info || !info.pid) return;
    const pid = info.pid;
    try {
        process.kill(-pid, 'SIGTERM');
    } catch (err) {
        if (err.code !== 'ESRCH') console.error(`[kill] SIGTERM -${pid} failed:`, err.message);
    }
    setTimeout(() => {
        try { process.kill(-pid, 'SIGKILL'); }
        catch (err) { if (err.code !== 'ESRCH') console.error(`[kill] SIGKILL -${pid} failed:`, err.message); }
    }, 5000);

    const runDir = path.join(SQUADS_DIR, info.squad, 'output', runId);
    writeStateFile(runDir, { status: 'failed', error: reason }).catch(err => {
        console.error(`[kill] Failed to write state for ${runId}:`, err.message);
    });
}

function spawnRunner(runId, squadName, runDir, logFd) {
    const runnerProcess = spawn('node', [
        path.join(ROOT_DIR, 'src/headless-runner.js'),
        '--squad', squadName,
        '--runId', runId,
        '--startStep', '2'
    ], {
        cwd: ROOT_DIR,
        detached: true,
        stdio: ['ignore', logFd, logFd],
        env: { ...process.env }
    });

    const info = activeProcesses.get(runId) || { squad: squadName, startedAt: Date.now() };
    info.state = 'running';
    info.process = runnerProcess;
    info.pid = runnerProcess.pid;
    info.timeoutHandle = setTimeout(() => {
        console.warn(`[timeout] runId=${runId} exceeded ${RUN_TIMEOUT_MS}ms — killing group`);
        killGroup(runId, 'timeout');
    }, RUN_TIMEOUT_MS);
    activeProcesses.set(runId, info);

    writeStateFile(runDir, { squad: squadName, status: 'running', pid: runnerProcess.pid, startedAt: new Date(info.startedAt).toISOString() })
        .catch(err => console.error(`[spawn] Failed to persist pid for ${runId}:`, err.message));

    runnerProcess.on('error', (err) => {
        console.error(`[runner] spawn error for runId=${runId}:`, err.message);
        const i = activeProcesses.get(runId);
        if (i?.timeoutHandle) clearTimeout(i.timeoutHandle);
        activeProcesses.delete(runId);
    });

    runnerProcess.on('exit', (code, signal) => {
        const i = activeProcesses.get(runId);
        if (i?.timeoutHandle) clearTimeout(i.timeoutHandle);
        activeProcesses.delete(runId);
        console.log(`[runner] exit runId=${runId} code=${code} signal=${signal} active=${activeProcesses.size}/${MAX_CONCURRENT_RUNS}`);
    });

    runnerProcess.unref();
    return runnerProcess;
}

async function recoverOrphansOnBoot() {
    let squadDirs;
    try { squadDirs = await fs.readdir(SQUADS_DIR, { withFileTypes: true }); }
    catch { return; }

    let recovered = 0;
    for (const squad of squadDirs) {
        if (!squad.isDirectory()) continue;
        const outputDir = path.join(SQUADS_DIR, squad.name, 'output');
        let runDirs;
        try { runDirs = await fs.readdir(outputDir, { withFileTypes: true }); }
        catch { continue; }

        for (const run of runDirs) {
            if (!run.isDirectory()) continue;
            const statePath = path.join(outputDir, run.name, 'state.json');
            let state;
            try { state = JSON.parse(await fs.readFile(statePath, 'utf-8')); }
            catch { continue; }
            if (state.status !== 'running') continue;

            let alive = false;
            if (state.pid) {
                try { process.kill(state.pid, 0); alive = true; }
                catch { alive = false; }
            }

            const updatedAt = state.updatedAt ? Date.parse(state.updatedAt) : 0;
            const stale = Date.now() - updatedAt > RUN_TIMEOUT_MS;

            if (!alive || stale) {
                try {
                    await writeStateFile(path.join(outputDir, run.name), {
                        status: 'failed',
                        error: 'orphaned (backend restart or process gone)'
                    });
                    recovered++;
                } catch (err) {
                    console.error(`[recover] Failed to update ${run.name}:`, err.message);
                }
            }
        }
    }
    if (recovered > 0) console.log(`[recover] Marked ${recovered} orphaned run(s) as failed.`);
}

// ── Path safety ───────────────────────────────────────────────────────

async function safeFilePath(squad, runId, ...rest) {
    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        throw new Error('INVALID_ID');
    }
    const joined = path.join(SQUADS_DIR, squad, 'output', runId, ...rest);
    if (joined.includes('\0')) throw new Error('NULL_BYTE');

    let resolved;
    try { resolved = await fs.realpath(joined); }
    catch { throw new Error('NOT_FOUND'); }

    if (resolved !== REAL_SQUADS_DIR && !resolved.startsWith(REAL_SQUADS_DIR + path.sep)) {
        throw new Error('OUTSIDE_BASE');
    }

    const basename = path.basename(resolved);
    if (basename.startsWith('.')) throw new Error('DOTFILE');

    const ext = path.extname(resolved).toLowerCase();
    if (rest.length > 0 && !FILE_EXT_WHITELIST.has(ext)) {
        throw new Error('EXT_NOT_ALLOWED');
    }

    return resolved;
}

// ── Response helpers (v1 only) ────────────────────────────────────────

function ok(res, data) {
    return res.json({ success: true, data });
}

function fail(res, code, message, status = 400) {
    return res.status(status).json({ success: false, error: { code, message } });
}

// ── Middleware ────────────────────────────────────────────────────────

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

function parseAllowedOrigins() {
    const explicit = process.env.ALLOWED_ORIGINS;
    if (explicit) return explicit.split(',').map(s => s.trim()).filter(Boolean);
    if (process.env.FRONTEND_URL) return [process.env.FRONTEND_URL];
    return true; // fallback: reflect any origin (dev)
}

app.use(cors({
    origin: parseAllowedOrigins(),
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 600
}));

app.use(express.json({ limit: '200kb' }));

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && !req.path.startsWith('/api/v1/')) {
        res.set('Deprecation', 'true');
        res.set('Sunset', 'Wed, 31 Dec 2026 23:59:59 GMT');
        res.set('Link', `</api/v1${req.path.slice(4)}>; rel="successor-version"`);
    }
    next();
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} user=${req.user || '-'}`);
    next();
});

// ── Rate limiters ─────────────────────────────────────────────────────

const loginLimiter = rateLimit({
    windowMs: 60_000, max: 10,
    standardHeaders: 'draft-7', legacyHeaders: false,
    message: { error: 'Too many requests' }
});

const generateLimiter = rateLimit({
    windowMs: 60_000, max: 5,
    standardHeaders: 'draft-7', legacyHeaders: false,
    message: { error: 'Too many requests' }
});

// ── Public routes ─────────────────────────────────────────────────────

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Swagger UI ────────────────────────────────────────────────────────

app.get('/api-docs/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Opensquad API Docs',
    swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true
    }
}));

app.get('/api/v1/health', (req, res) => {
    ok(res, {
        status: 'ok',
        uptime: process.uptime(),
        version: VERSION,
        activeRuns: activeProcesses.size,
        maxConcurrentRuns: MAX_CONCURRENT_RUNS
    });
});

// ── Login (dual-mounted) ──────────────────────────────────────────────

function loginHandler(req, res) {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const users = loadUsers();
    const user = users.find(u => u.username === username);
    if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    ok(res, { token: generateToken(username) });
}

app.post(['/api/login', '/api/v1/login'], loginLimiter, loginHandler);

// ── Generate (dual-mounted) ───────────────────────────────────────────

async function generateHandler(req, res) {
    const { news, angle } = req.body;

    if (!news || !angle) return res.status(400).json({ error: 'News and angle are required' });
    if (!VALID_ANGLES.has(angle)) return res.status(400).json({ error: 'Invalid angle' });
    if (typeof news !== 'string' || news.length > 10_000) return res.status(400).json({ error: 'Invalid news content' });

    const squadName = 'carousel-noticias';
    const runId = reserveSlotOrReject(res, squadName);
    if (!runId) return;

    let runDir;
    try {
        runDir = path.join(SQUADS_DIR, squadName, 'output', runId);
        await fs.mkdir(runDir, { recursive: true });

        const angleUpper = angle.toUpperCase();
        const newsInputContent = `---\nangulo: ${angleUpper}\n---\n\n# Notícia\n\n${news}\n`;
        await fs.writeFile(path.join(runDir, 'news-input.md'), newsInputContent);

        const logPath = path.join(runDir, 'runner.log');
        const logFd = openSync(logPath, 'w');

        console.log(`[generate] user=${req.user} runId=${runId} angulo=${angleUpper} active=${activeProcesses.size}/${MAX_CONCURRENT_RUNS}`);

        spawnRunner(runId, squadName, runDir, logFd);

        ok(res, { runId, statusUrl: `/api/v1/status/${squadName}/${runId}` });
    } catch (error) {
        console.error('[generate] error:', error);
        activeProcesses.delete(runId);
        res.status(500).json({ error: 'Failed to start squad execution' });
    }
}

app.post(['/api/generate', '/api/v1/generate'], requireAuth, generateLimiter, generateHandler);

// ── Status (dual-mounted) ─────────────────────────────────────────────

async function statusHandler(req, res) {
    const { squad, runId } = req.params;
    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }
    const statePath = path.join(SQUADS_DIR, squad, 'output', runId, 'state.json');
    try {
        const state = JSON.parse(await fs.readFile(statePath, 'utf-8'));
        state.isActive = activeProcesses.has(runId);
        res.json(state);
    } catch {
        res.status(404).json({ error: 'Run not found or state not yet available' });
    }
}

app.get(['/api/status/:squad/:runId', '/api/v1/status/:squad/:runId'], requireAuth, statusHandler);

// ── Logs (dual-mounted) ───────────────────────────────────────────────

async function logsHandler(req, res) {
    const { squad, runId } = req.params;
    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }
    const logPath = path.join(SQUADS_DIR, squad, 'output', runId, 'runner.log');
    try {
        const content = await fs.readFile(logPath, 'utf-8');
        const tail = content.split('\n').slice(-100).join('\n');
        res.type('text/plain').send(tail);
    } catch {
        res.status(404).send(`Log not found for runId=${runId}`);
    }
}

app.get(['/api/logs/:squad/:runId', '/api/v1/logs/:squad/:runId'], requireAuth, logsHandler);

// ── v1-only: list squads ──────────────────────────────────────────────

app.get('/api/v1/squads', requireAuth, async (req, res) => {
    try {
        const entries = await fs.readdir(SQUADS_DIR, { withFileTypes: true });
        const squads = [];
        for (const e of entries) {
            if (!e.isDirectory()) continue;
            if (!SAFE_ID_RE.test(e.name)) continue;
            const yamlPath = path.join(SQUADS_DIR, e.name, 'squad.yaml');
            try {
                const raw = await fs.readFile(yamlPath, 'utf-8');
                const parsed = yaml.load(raw) || {};
                squads.push({
                    code: parsed.code || e.name,
                    name: parsed.name || e.name,
                    description: parsed.description || '',
                    version: parsed.version || null,
                    language: parsed.language || null
                });
            } catch {}
        }
        ok(res, { squads, default: 'carousel-noticias' });
    } catch (err) {
        console.error('[squads] error:', err);
        fail(res, 'INTERNAL_ERROR', 'Failed to list squads', 500);
    }
});

// ── v1-only: list runs ────────────────────────────────────────────────

app.get('/api/v1/runs', requireAuth, async (req, res) => {
    const squadFilter = req.query.squad;
    const limit = Math.min(parseInt(req.query.limit || '50', 10) || 50, 200);

    if (squadFilter && !SAFE_ID_RE.test(squadFilter)) {
        return fail(res, 'INVALID_PARAM', 'Invalid squad filter');
    }

    try {
        const allRuns = [];
        const squadEntries = await fs.readdir(SQUADS_DIR, { withFileTypes: true });

        for (const sq of squadEntries) {
            if (!sq.isDirectory() || !SAFE_ID_RE.test(sq.name)) continue;
            if (squadFilter && sq.name !== squadFilter) continue;
            const outputDir = path.join(SQUADS_DIR, sq.name, 'output');
            let runEntries;
            try { runEntries = await fs.readdir(outputDir, { withFileTypes: true }); }
            catch { continue; }

            for (const run of runEntries) {
                if (!run.isDirectory() || !SAFE_ID_RE.test(run.name)) continue;
                const runDir = path.join(outputDir, run.name);
                const statePath = path.join(runDir, 'state.json');
                let state = null;
                let mtime = 0;
                try {
                    state = JSON.parse(await fs.readFile(statePath, 'utf-8'));
                    const st = await fs.stat(runDir);
                    mtime = st.mtimeMs;
                } catch { continue; }

                allRuns.push({
                    runId: run.name,
                    squad: sq.name,
                    status: state.status || 'unknown',
                    step: state.step || null,
                    updatedAt: state.updatedAt || null,
                    isActive: activeProcesses.has(run.name),
                    _mtime: mtime
                });
            }
        }

        allRuns.sort((a, b) => b._mtime - a._mtime);
        const limited = allRuns.slice(0, limit).map(r => { delete r._mtime; return r; });
        ok(res, { runs: limited, total: allRuns.length });
    } catch (err) {
        console.error('[runs] error:', err);
        fail(res, 'INTERNAL_ERROR', 'Failed to list runs', 500);
    }
});

// ── v1-only: list output (image URLs) ─────────────────────────────────

app.get('/api/v1/output/:squad/:runId', requireAuth, async (req, res) => {
    const { squad, runId } = req.params;
    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        return fail(res, 'INVALID_PARAM', 'Invalid squad or runId');
    }

    const slidesDir = path.join(SQUADS_DIR, squad, 'output', runId, 'slides', 'v1');
    let entries;
    try { entries = await fs.readdir(slidesDir); }
    catch { return fail(res, 'NOT_FOUND', 'Output not found for this run', 404); }

    const pngs = entries
        .filter(f => f.toLowerCase().endsWith('.png'))
        .sort();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const images = pngs.map(filename => ({
        filename,
        url: `${baseUrl}/api/v1/files/${squad}/${runId}/slides/v1/${encodeURIComponent(filename)}`
    }));

    ok(res, { images, count: images.length });
});

// ── v1-only: delete run ───────────────────────────────────────────────

app.delete('/api/v1/runs/:squad/:runId', requireAuth, async (req, res) => {
    const { squad, runId } = req.params;
    const deleteFiles = req.query.deleteFiles === 'true';

    if (!SAFE_ID_RE.test(squad) || !SAFE_ID_RE.test(runId)) {
        return fail(res, 'INVALID_PARAM', 'Invalid squad or runId');
    }

    let killed = false;
    if (activeProcesses.has(runId)) {
        killGroup(runId, 'killed by API');
        killed = true;
    }

    let removed = false;
    if (deleteFiles) {
        const runDir = path.join(SQUADS_DIR, squad, 'output', runId);
        const realRunDir = (() => {
            try { return realpathSync(runDir); } catch { return null; }
        })();
        if (realRunDir && (realRunDir === REAL_SQUADS_DIR || realRunDir.startsWith(REAL_SQUADS_DIR + path.sep))) {
            try {
                await fs.rm(runDir, { recursive: true, force: true });
                removed = true;
            } catch (err) {
                console.error('[delete] rm failed:', err.message);
            }
        }
    }

    ok(res, { runId, killed, filesRemoved: removed });
});

// ── v1-only: serve files ──────────────────────────────────────────────

app.get('/api/v1/files/:squad/:runId/*', requireAuth, async (req, res) => {
    const { squad, runId } = req.params;
    const rest = req.params[0] || '';

    let resolved;
    try {
        const segments = rest.split('/').filter(Boolean);
        resolved = await safeFilePath(squad, runId, ...segments);
    } catch (err) {
        const code = err.message;
        if (code === 'NOT_FOUND') return fail(res, 'NOT_FOUND', 'File not found', 404);
        if (code === 'EXT_NOT_ALLOWED') return fail(res, 'EXT_NOT_ALLOWED', 'Extension not allowed', 400);
        return fail(res, 'INVALID_PATH', `Invalid path (${code})`);
    }

    let st;
    try { st = statSync(resolved); }
    catch { return fail(res, 'NOT_FOUND', 'File not found', 404); }
    if (!st.isFile()) return fail(res, 'NOT_FILE', 'Not a regular file', 400);

    const contentType = mime.lookup(resolved) || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'private, max-age=3600');
    res.sendFile(resolved, { dotfiles: 'deny' }, (err) => {
        if (err && !res.headersSent) {
            console.error('[files] sendFile error:', err.message);
            res.status(500).end();
        }
    });
});

// ── 404 ───────────────────────────────────────────────────────────────

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// ── Boot ──────────────────────────────────────────────────────────────

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend bridge listening at http://0.0.0.0:${port}`);
    console.log(`SQUADS_DIR=${REAL_SQUADS_DIR}  MAX_CONCURRENT_RUNS=${MAX_CONCURRENT_RUNS}  RUN_TIMEOUT_MS=${RUN_TIMEOUT_MS}`);
    recoverOrphansOnBoot().catch(err => console.error('[recover] error:', err));
});

// ── Graceful shutdown ─────────────────────────────────────────────────

function shutdown(signal) {
    console.log(`[shutdown] received ${signal} — backend exiting (active runs continue detached).`);
    process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
