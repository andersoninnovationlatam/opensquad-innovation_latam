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

    async function pollStatus(runId) {
        let lastStep = 0;
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/status/carousel-noticias/${runId}`);
                if (!response.ok) return;

                const state = await response.json();

                if (state.step.current !== lastStep) {
                    lastStep = state.step.current;
                    console.log(`[Step ${state.step.current}/${state.step.total}] ${state.step.label}`);
                }

                if (state.status === 'completed') {
                    clearInterval(pollInterval);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO');
                    console.log('📂 Arquivos disponíveis no Google Drive');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    showStatus('✨ Imagens geradas e enviadas para o Google Drive com sucesso!', 'success', true);
                } else if (state.status === 'failed') {
                    clearInterval(pollInterval);
                    console.log('❌ ERRO NA EXECUÇÃO DO SQUAD');
                    showStatus('❌ Ocorreu um erro na geração das imagens.', 'error');
                } else {
                    showStatus(`Processando: ${state.step.label || 'Iniciando...'} (${state.step.current}/${state.step.total})`, 'info');
                }
            } catch (error) {
                console.error('Erro ao buscar status:', error);
            }
        }, 3000);
    }

    function showStatus(message, type, persistent = false) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.classList.remove('hidden');

        if (!persistent) {
            if (window.statusTimeout) clearTimeout(window.statusTimeout);
            window.statusTimeout = setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }
    }

});
