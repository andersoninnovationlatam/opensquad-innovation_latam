export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle API requests
        if (url.pathname === '/api/generate' && request.method === 'POST') {
            try {
                const body = await request.json();
                const { news, angle } = body;

                // Aqui você integraria com o OpenSquad ou outra IA
                // Por enquanto, retornamos um sucesso simulado

                return new Response(JSON.stringify({
                    success: true,
                    message: `Conteúdo gerado para o ângulo ${angle}`,
                    data: {
                        original_news: news,
                        angle: angle,
                        generated_post: `[SIMULAÇÃO] Post gerado com ângulo ${angle} para a notícia: ${news.substring(0, 50)}...`
                    }
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Erro ao processar requisição' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Fallback to assets (handled by Cloudflare if configured in wrangler.toml)
        // Se o wrangler.toml tiver [assets], ele tenta servir o arquivo antes de cair aqui.
        // Mas se cair aqui e não for API, podemos tentar servir o index.html por padrão.

        return env.ASSETS.fetch(request);
    },
};
