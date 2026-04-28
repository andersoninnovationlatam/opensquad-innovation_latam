// ── Auth ──────────────────────────────────────────

const TOKEN_KEY = 'il_auth_token';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function saveToken(t) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function attemptLogin(username, password) {
    const res = await fetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('invalid');
    const { token } = await res.json();
    saveToken(token);
}

// ── Auth Overlay ──────────────────────────────────

(function initAuth() {
    const overlay   = document.getElementById('authOverlay');
    const appMain   = document.getElementById('appMain');
    const appFooter = document.getElementById('appFooter');
    const loginForm = document.getElementById('loginForm');
    const loginBtn  = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

    function showApp() {
        overlay.classList.add('hidden');
        appMain.style.display = '';
        appFooter.style.display = '';
    }

    if (getToken()) {
        showApp();
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        clearToken();
        location.reload();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.classList.add('hidden');
        loginBtn.disabled = true;
        loginBtn.querySelector('span').textContent = 'Entrando…';

        try {
            await attemptLogin(
                document.getElementById('usernameInput').value,
                document.getElementById('passwordInput').value
            );
            showApp();
        } catch {
            loginError.classList.remove('hidden');
            document.getElementById('passwordInput').value = '';
        } finally {
            loginBtn.disabled = false;
            loginBtn.querySelector('span').textContent = 'Entrar';
        }
    });
})();

// ── App ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const newsForm     = document.getElementById('newsForm');
    const submitBtn    = document.getElementById('submitBtn');
    const formView     = document.getElementById('formView');
    const progressView = document.getElementById('progressView');
    const progressResult = document.getElementById('progressResult');
    const summaryNews  = document.getElementById('summaryNews');
    const summaryAngle = document.getElementById('summaryAngle');

    const angleLabels = {
        educacional: '🎓 Educacional',
        medo:        '⚠️ Medo',
        entusiasmo:  '🚀 Entusiasmo',
        curiosidade: '🤔 Curiosidade',
        polemica:    '🔥 Polêmica',
        empatia:     '❤️ Empatia',
        // Aceitar também o valor uppercase normalizado pelo backend
        EDUCACIONAL: '🎓 Educacional',
        MEDO:        '⚠️ Medo',
        ENTUSIASMO:  '🚀 Entusiasmo',
        CURIOSIDADE: '🤔 Curiosidade',
        POLEMICA:    '🔥 Polêmica',
        EMPATIA:     '❤️ Empatia',
    };

    // ── View transitions ─────────────────────────────

    function showProgressView(news, angle) {
        const excerpt = news.length > 90 ? news.slice(0, 90) + '…' : news;
        summaryNews.textContent  = excerpt;
        summaryAngle.textContent = angleLabels[angle] || angle;

        formView.classList.add('is-hiding');
        setTimeout(() => {
            formView.classList.add('hidden');
            formView.classList.remove('is-hiding');
            progressView.classList.remove('hidden');
        }, 280);
    }

    function showFormView() {
        progressView.classList.add('hidden');
        formView.classList.remove('hidden');
        resetProgress();
        newsForm.reset();
    }

    // ── Progress helpers ─────────────────────────────

    // Mapeia step do pipeline (1–9) para step visual da UI (1–6)
    // Pipeline: 1=news-input | 2=copy (Caio) | 3=approve-content | 4=Bruno | 5=art-brief | 6=approve-art-brief | 7=render | 8=revisão | 9=final-approval
    // UI:       1=Análise    | 2=Copy        | 2                 | 3=Refs  | 4=Design    | 4                  | 5=Render | 6=Revisão | 6
    function pipelineToUiStep(pipelineStep) {
        if (pipelineStep <= 1) return 1;        // checkpoint-news-input
        if (pipelineStep <= 3) return 2;        // criar-copy + approve-content
        if (pipelineStep === 4) return 3;       // pesquisa-imagens (Bruno)
        if (pipelineStep <= 6) return 4;        // briefing-visual + approve-art-brief
        if (pipelineStep === 7) return 5;       // render
        return 6;                                // revisão + final-approval
    }

    const UI_TOTAL = 6;

    function resetProgress() {
        document.querySelectorAll('.step-item').forEach(el => {
            el.className = 'step-item pending';
        });
        progressResult.className = 'progress-result hidden';
        progressResult.innerHTML = '';
    }

    function setStepState(stepNumber, state) {
        const el = progressView.querySelector(`[data-step="${stepNumber}"]`);
        if (el) el.className = `step-item ${state}`;
    }

    function activateStep(current, total) {
        const uiCurrent = pipelineToUiStep(current);
        for (let i = 1; i < uiCurrent; i++) setStepState(i, 'done');
        setStepState(uiCurrent, 'active');
        for (let i = uiCurrent + 1; i <= UI_TOTAL; i++) setStepState(i, 'pending');
    }

    function markAllDone(total) {
        for (let i = 1; i <= UI_TOTAL; i++) setStepState(i, 'done');
    }

    function markStepError(stepNumber, total) {
        const uiStep = pipelineToUiStep(stepNumber);
        setStepState(uiStep, 'error');
        for (let i = uiStep + 1; i <= UI_TOTAL; i++) setStepState(i, 'pending');
    }

    function showResultInPanel(type, message, driveUrl = null) {
        progressResult.className = `progress-result ${type}`;

        const driveBtn = driveUrl
            ? `<a href="${driveUrl}" target="_blank" rel="noopener noreferrer" class="btn-drive">Abrir pasta no Drive</a>`
            : '';

        progressResult.innerHTML = `
            <div class="progress-result-row">
                <span class="progress-result-text">${message}</span>
                ${driveBtn}
            </div>
            <button class="btn-restart" id="restartBtn">Gerar Novo Carrossel</button>
        `;
        progressResult.classList.remove('hidden');

        document.getElementById('restartBtn').addEventListener('click', showFormView);
    }

    // ── Form submit ──────────────────────────────────

    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const news  = document.getElementById('newsInput').value;
        const angle = document.getElementById('angleSelect').value;

        submitBtn.disabled = true;
        resetProgress();
        showProgressView(news, angle);

        try {
            const response = await fetch('/api/v1/generate', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ news, angle })
            });

            if (response.status === 401) {
                clearToken();
                location.reload();
                return;
            }

            if (!response.ok) {
                let errorDetail = `Status ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.error || errorData.hint || errorDetail;
                    if (errorData.details) errorDetail += ` — ${errorData.details}`;
                } catch { /* response wasn't JSON */ }
                throw new Error(errorDetail);
            }

            const result = await response.json();

            if (result.success && result.runId) {
                pollStatus(result.runId);
            } else {
                showResultInPanel('success', 'Conteúdo enviado com sucesso!');
            }

            newsForm.reset();
        } catch (error) {
            showResultInPanel('error', `Erro: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
        }
    });

    // ── Polling ──────────────────────────────────────

    async function fetchRunnerLog(runId) {
        try {
            const res = await fetch(`/api/logs/carousel-noticias/${runId}`, { headers: authHeaders() });
            if (!res.ok) return null;
            return await res.text();
        } catch {
            return null;
        }
    }

    async function pollStatus(runId) {
        let lastStep = 0;
        let notFoundCount = 0;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/status/carousel-noticias/${runId}`, { headers: authHeaders() });
                if (response.status === 401) { clearToken(); location.reload(); return; }
                const state = await response.json();

                if (!response.ok || state.error || state.status === undefined) {
                    notFoundCount++;
                    return;
                }

                notFoundCount = 0;

                const current = state.step?.current ?? 1;
                const total   = state.step?.total ?? 6;
                const label   = state.step?.label ?? 'Iniciando...';

                if (current !== lastStep) {
                    lastStep = current;
                }

                if (state.status === 'completed') {
                    clearInterval(pollInterval);
                    markAllDone(total);

                    // aguarda o tick do step 6 animar antes de mostrar o painel
                    setTimeout(() => {
                        progressResult.className = 'progress-result loading';
                        progressResult.innerHTML = `
                            <svg class="result-spinner" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-dasharray="28 56"/>
                            </svg>
                            <span style="font-size:0.875rem;font-weight:500;">Finalizando...</span>
                        `;
                        progressResult.classList.remove('hidden');

                        fetch(`/api/v1/drive/carousel-noticias/${runId}`, { headers: authHeaders() })
                            .then(r => r.json())
                            .then(data => {
                                const driveUrl = data?.data?.folderUrl ?? null;
                                showResultInPanel(
                                    'success',
                                    '✨ Imagens geradas e enviadas para o Google Drive!',
                                    driveUrl
                                );
                            })
                            .catch(() => {
                                showResultInPanel('success', '✨ Imagens geradas e enviadas para o Google Drive!');
                            });
                    }, 500);

                } else if (state.status === 'failed') {
                    clearInterval(pollInterval);
                    markStepError(current, total);
                    showResultInPanel('error', `❌ Erro: ${label || 'falha na geração das imagens'}`);

                } else {
                    activateStep(current, total);
                }
            } catch {
                // silently ignore poll errors
            }
        }, 3000);
    }
});
