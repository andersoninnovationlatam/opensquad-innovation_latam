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
            // Simulate API call
            console.log('Enviando dados:', { news, angle });
            
            // Here you would normally fetch your backend
            // await fetch('/api/generate', { method: 'POST', body: JSON.stringify({ news, angle }) });
            
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success state
            showStatus('Conteúdo enviado com sucesso! A IA está trabalhando no seu post.', 'success');
            newsForm.reset();
        } catch (error) {
            showStatus('Ocorreu um erro ao processar sua solicitação. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.classList.remove('hidden');

        // Hide after 5 seconds
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }
});
