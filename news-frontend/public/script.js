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
        for (let i = 1; i < current; i++) setStepState(i, 'done');
        setStepState(current, 'active');
        for (let i = current + 1; i <= total; i++) setStepState(i, 'pending');
    }

    function markAllDone(total) {
        for (let i = 1; i <= total; i++) setStepState(i, 'done');
    }

    function markStepError(stepNumber, total) {
        setStepState(stepNumber, 'error');
        for (let i = stepNumber + 1; i <= total; i++) setStepState(i, 'pending');
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
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ news, angle })
            });

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
            const res = await fetch(`/api/logs/carousel-noticias/${runId}`);
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
                const response = await fetch(`/api/status/carousel-noticias/${runId}`);
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

                    progressResult.className = 'progress-result loading';
                    progressResult.innerHTML = `
                        <svg class="result-spinner" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-dasharray="28 56"/>
                        </svg>
                        <span style="font-size:0.875rem;font-weight:500;">Finalizando...</span>
                    `;
                    progressResult.classList.remove('hidden');

                    setTimeout(() => {
                        showResultInPanel(
                            'success',
                            '✨ Imagens geradas e enviadas para o Google Drive!',
                            'https://drive.google.com/drive/folders/1ILMTPcEDbgBaNp8Pn0zCghumX9y-ORMd?usp=sharing'
                        );
                    }, 600);

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
