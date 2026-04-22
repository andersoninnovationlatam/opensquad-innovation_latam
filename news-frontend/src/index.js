export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle API requests
        if (url.pathname === '/api/generate' && request.method === 'POST') {
            try {
                const body = await request.json();
                const { news, angle } = body;

                // Call the backend bridge
                const response = await fetch('http://localhost:3001/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ news, angle })
                });

                if (!response.ok) {
                    throw new Error('Failed to trigger squad');
                }

                const result = await response.json();

                return new Response(JSON.stringify(result), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message || 'Erro ao processar requisição' }), {
                    status: 500,
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
