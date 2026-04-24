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
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 INICIANDO PROCESSO DE GERAÇÃO');
            console.log('📰 Notícia:', news);
            console.log('🎯 Ângulo:', angle);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ news, angle })
            });

            if (!response.ok) {
                let errorDetail = `Status ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error('Detalhes do erro:', errorData);
                    errorDetail = errorData.error || errorData.hint || errorDetail;
                    if (errorData.details) errorDetail += ` — ${errorData.details}`;
                } catch { /* response wasn't JSON */ }
                throw new Error(errorDetail);
            }

            const result = await response.json();
            console.log('Resultado:', result);

            if (result.success && result.runId) {
                pollStatus(result.runId);
            } else {
                showResultInPanel('success', 'Conteúdo enviado com sucesso!');
            }

            newsForm.reset();
        } catch (error) {
            console.error('Erro:', error);
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
        let lastLogLength = 0;
        let notFoundCount = 0;

        console.log(`[poll] Starting status polling for runId=${runId}`);

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/status/carousel-noticias/${runId}`);
                const state = await response.json();

                if (!response.ok || state.error || state.status === undefined) {
                    notFoundCount++;
                    console.warn(`[poll] state.json not ready (${notFoundCount}x) — HTTP ${response.status} body:`, state);

                    if (notFoundCount % 5 === 0) {
                        const log = await fetchRunnerLog(runId);
                        if (log) {
                            console.group(`%c[runner.log] runId=${runId}`, 'color: orange; font-weight: bold');
                            log.split('\n').slice(-30).forEach(l => l && console.log(l));
                            console.groupEnd();
                        } else {
                            console.error('[poll] runner.log not found — process likely failed to spawn entirely');
                        }
                    }
                    return;
                }

                notFoundCount = 0;
                console.log(`[poll] state: status=${state.status} step=${JSON.stringify(state.step)}`);

                const current = state.step?.current ?? 1;
                const total   = state.step?.total ?? 6;
                const label   = state.step?.label ?? 'Iniciando...';

                if (current !== lastStep) {
                    lastStep = current;
                    console.log(`━━ [Step ${current}/${total}] ${label}`);
                }

                if (state.status === 'completed') {
                    clearInterval(pollInterval);
                    markAllDone(total);

                    const log = await fetchRunnerLog(runId);
                    if (log) {
                        console.group('[runner.log] Final log');
                        log.split('\n').forEach(l => l && console.log(l));
                        console.groupEnd();
                    }
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                    showResultInPanel(
                        'success',
                        '✨ Imagens geradas e enviadas para o Google Drive!',
                        'https://drive.google.com/drive/folders/1ILMTPcEDbgBaNp8Pn0zCghumX9y-ORMd?usp=sharing'
                    );

                } else if (state.status === 'failed') {
                    clearInterval(pollInterval);
                    markStepError(current, total);

                    const log = await fetchRunnerLog(runId);
                    if (log) {
                        console.group('[runner.log] Error log');
                        log.split('\n').forEach(l => l && console.log(l));
                        console.groupEnd();
                    }
                    console.error('❌ ERRO NA EXECUÇÃO DO SQUAD');

                    showResultInPanel('error', `❌ Erro: ${label || 'falha na geração das imagens'}`);

                } else {
                    activateStep(current, total);

                    if (lastStep > 0) {
                        const log = await fetchRunnerLog(runId);
                        if (log) {
                            const lines = log.split('\n');
                            if (lines.length > lastLogLength) {
                                lines.slice(lastLogLength).forEach(l => l && console.log(`[runner] ${l}`));
                                lastLogLength = lines.length;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('[poll] Erro ao buscar status:', error);
            }
        }, 3000);
    }
});
