const REQUEST_TIMEOUT_MS = 30_000;

export class ApiError extends Error {
    constructor(status, body, path) {
        const message = typeof body === 'string'
            ? body
            : (body?.error?.message || body?.error || body?.message || JSON.stringify(body));
        super(`API ${status} on ${path}: ${message}`);
        this.status = status;
        this.body = body;
        this.path = path;
    }
}

function getApiUrl() {
    const url = process.env.API_URL;
    if (!url) throw new Error('API_URL env var is required');
    return url.replace(/\/$/, '');
}

function getApiToken() {
    const token = process.env.API_TOKEN;
    if (!token) throw new Error('API_TOKEN env var is required (must match one of backend API_TOKENS)');
    return token;
}

async function apiFetch(path, init = {}) {
    const url = getApiUrl() + path;
    const headers = {
        Authorization: `Bearer ${getApiToken()}`,
        Accept: 'application/json',
        ...(init.headers || {})
    };
    if (init.body && typeof init.body === 'string' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    let response;
    try {
        response = await fetch(url, {
            ...init,
            headers,
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });
    } catch (err) {
        if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
            throw new ApiError(0, `Request timed out after ${REQUEST_TIMEOUT_MS}ms`, path);
        }
        throw new ApiError(0, err.message || 'Network error', path);
    }

    const text = await response.text();
    let body;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    if (!response.ok) {
        throw new ApiError(response.status, body, path);
    }
    return body;
}

function unwrap(body) {
    return body && typeof body === 'object' && body.success === true && 'data' in body
        ? body.data
        : body;
}

export const apiClient = {
    async generate({ news, angle, squad }) {
        const body = unwrap(await apiFetch('/api/v1/generate', {
            method: 'POST',
            body: JSON.stringify({ news, angle, squad })
        }));
        return body;
    },

    async getStatus({ squad, runId }) {
        return unwrap(await apiFetch(`/api/v1/status/${encodeURIComponent(squad)}/${encodeURIComponent(runId)}`));
    },

    async getOutput({ squad, runId }) {
        return unwrap(await apiFetch(`/api/v1/output/${encodeURIComponent(squad)}/${encodeURIComponent(runId)}`));
    },

    async listSquads() {
        return unwrap(await apiFetch('/api/v1/squads'));
    },

    async listRuns({ squad, limit } = {}) {
        const qs = new URLSearchParams();
        if (squad) qs.set('squad', squad);
        if (limit) qs.set('limit', String(limit));
        const path = '/api/v1/runs' + (qs.toString() ? `?${qs}` : '');
        return unwrap(await apiFetch(path));
    }
};
