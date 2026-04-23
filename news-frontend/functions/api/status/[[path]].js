export async function onRequestGet(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    let apiUrl = env.API_URL;

    if (!apiUrl) {
        return new Response(JSON.stringify({
            error: 'API_URL not configured'
        }), { status: 500, headers: corsHeaders });
    }

    // Ensure apiUrl has a protocol
    if (!apiUrl.startsWith('http')) {
        apiUrl = `https://${apiUrl}`;
    }

    try {
        const url = new URL(request.url);
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
