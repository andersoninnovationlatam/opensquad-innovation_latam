document.addEventListener('DOMContentLoaded', () => {
    const newsForm = document.getElementById('newsForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const news = document.getElementById('newsInput').value;
        const angle = document.getElementById('angleSelect').value;

        // Visual feedback for loading
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processando...</span><div class="btn-glow"></div>';

        try {
            // Real API call to the Worker
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 INICIANDO PROCESSO DE GERAÇÃO');
            console.log('📰 Notícia:', news);
            console.log('🎯 Ângulo:', angle);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
                showStatus('Iniciando geração do conteúdo... Acompanhe o progresso.', 'info');
                pollStatus(result.runId);
            } else {
                showStatus('Conteúdo enviado com sucesso!', 'success');
            }

            newsForm.reset();
        } catch (error) {
            console.error('Erro:', error);
            showStatus(`Erro: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

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

                // Cloudflare Workers always return 200 even when proxying errors,
                // so we must also check for an `error` field in the JSON body.
                const state = await response.json();

                if (!response.ok || state.error || state.status === undefined) {
                    notFoundCount++;
                    console.warn(`[poll] state.json not ready (${notFoundCount}x) — HTTP ${response.status} body:`, state);

                    // Every 5 polls (~15s) fetch the runner log to expose crash details
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

                if (state.step && state.step.current !== lastStep) {
                    lastStep = state.step.current;
                    console.log(`━━ [Step ${state.step.current}/${state.step.total}] ${state.step.label}`);
                }

                if (state.status === 'completed') {
                    clearInterval(pollInterval);
                    const log = await fetchRunnerLog(runId);
                    if (log) {
                        console.group('[runner.log] Final log');
                        log.split('\n').forEach(l => l && console.log(l));
                        console.groupEnd();
                    }
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO');
                    console.log('📂 Arquivos disponíveis no Google Drive');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    showStatus('✨ Imagens geradas e enviadas para o Google Drive com sucesso!', 'success', true, 'https://drive.google.com/drive/folders/1ILMTPcEDbgBaNp8Pn0zCghumX9y-ORMd?usp=sharing');
                } else if (state.status === 'failed') {
                    clearInterval(pollInterval);
                    const log = await fetchRunnerLog(runId);
                    if (log) {
                        console.group('[runner.log] Error log');
                        log.split('\n').forEach(l => l && console.log(l));
                        console.groupEnd();
                    }
                    console.error('❌ ERRO NA EXECUÇÃO DO SQUAD');
                    console.error('Detalhes:', state.step?.label);
                    showStatus(`❌ Erro: ${state.step?.label || 'falha na geração das imagens'}`, 'error');
                } else {
                    const stepLabel = state.step ? state.step.label : 'Iniciando...';
                    const stepCurrent = state.step ? state.step.current : '?';
                    const stepTotal = state.step ? state.step.total : '?';
                    showStatus(`Processando: ${stepLabel} (${stepCurrent}/${stepTotal})`, 'info');

                    // Fetch incremental log every ~30s (every 10 polls)
                    if (lastStep > 0 && lastStep % 1 === 0) {
                        const log = await fetchRunnerLog(runId);
                        if (log) {
                            const lines = log.split('\n');
                            if (lines.length > lastLogLength) {
                                const newLines = lines.slice(lastLogLength);
                                newLines.forEach(l => l && console.log(`[runner] ${l}`));
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

    function showStatus(message, type, persistent = false, driveUrl = null) {
        statusMessage.className = `status-message ${type}`;
        statusMessage.classList.remove('hidden');

        if (driveUrl) {
            statusMessage.innerHTML = `
                <span>${message}</span>
                <a href="${driveUrl}" target="_blank" rel="noopener noreferrer" class="btn-drive">
                    Abrir pasta no Drive
                </a>
            `;
        } else {
            statusMessage.textContent = message;
        }

        if (!persistent) {
            if (window.statusTimeout) clearTimeout(window.statusTimeout);
            window.statusTimeout = setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }
    }

});
