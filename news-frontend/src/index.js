export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers for all API responses
        const corsHeaders = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Debug endpoint to check configuration
        if (url.pathname === '/api/debug') {
            const apiUrl = env.API_URL || 'NOT_CONFIGURED';
            return new Response(JSON.stringify({
                apiUrl: apiUrl,
                hasApiUrl: !!env.API_URL,
                timestamp: new Date().toISOString()
            }), { headers: corsHeaders });
        }

        // Handle API requests
        if (url.pathname === '/api/generate' && request.method === 'POST') {
            const apiUrl = env.API_URL;

            // Check if API_URL is configured
            if (!apiUrl) {
                return new Response(JSON.stringify({
                    error: 'API_URL environment variable is not configured in Cloudflare Pages.',
                    hint: 'Go to Cloudflare Pages → Settings → Environment Variables and add API_URL with your backend URL.'
                }), {
                    status: 500,
                    headers: corsHeaders
                });
            }

            try {
                const body = await request.json();
                const { news, angle } = body;

                const targetUrl = `${apiUrl}/api/generate`;
                console.log(`[Worker] Calling backend: ${targetUrl}`);

                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ news, angle })
                });

                const responseText = await response.text();
                console.log(`[Worker] Backend response status: ${response.status}`);

                if (!response.ok) {
                    return new Response(JSON.stringify({
                        error: 'Backend returned an error',
                        backendStatus: response.status,
                        backendResponse: responseText,
                        targetUrl: targetUrl
                    }), {
                        status: 502,
                        headers: corsHeaders
                    });
                }

                // Parse and return the result
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch {
                    return new Response(JSON.stringify({
                        error: 'Backend returned invalid JSON',
                        backendResponse: responseText.substring(0, 500)
                    }), {
                        status: 502,
                        headers: corsHeaders
                    });
                }

                return new Response(JSON.stringify(result), {
                    headers: corsHeaders
                });
            } catch (error) {
                console.error(`[Worker] Error: ${error.message}`);
                return new Response(JSON.stringify({
                    error: 'Failed to connect to backend',
                    details: error.message,
                    hint: `Check if your backend at ${apiUrl} is running and accessible.`
                }), {
                    status: 502,
                    headers: corsHeaders
                });
            }
        }

        // Handle Status requests
        if (url.pathname.startsWith('/api/status/') && request.method === 'GET') {
            const apiUrl = env.API_URL;

            if (!apiUrl) {
                return new Response(JSON.stringify({
                    error: 'API_URL not configured'
                }), { status: 500, headers: corsHeaders });
            }

            try {
                const targetUrl = `${apiUrl}${url.pathname}`;
                console.log(`[Worker] Fetching status: ${targetUrl}`);

                const response = await fetch(targetUrl);
                if (!response.ok) {
                    const text = await response.text();
                    return new Response(JSON.stringify({
                        error: 'Backend status error',
                        backendStatus: response.status,
                        backendResponse: text
                    }), {
                        status: response.status,
                        headers: corsHeaders
                    });
                }
                const result = await response.json();
                return new Response(JSON.stringify(result), {
                    headers: corsHeaders
                });
            } catch (error) {
                return new Response(JSON.stringify({
                    error: 'Failed to fetch status',
                    details: error.message
                }), {
                    status: 502,
                    headers: corsHeaders
                });
            }
        }

        // Fallback to static assets
        return env.ASSETS.fetch(request);
    },
};

