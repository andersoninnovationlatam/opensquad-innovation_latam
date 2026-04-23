export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    let apiUrl = env.API_URL;

    if (!apiUrl) {
        return new Response(JSON.stringify({
            error: 'API_URL environment variable is not configured in Cloudflare Pages.',
            hint: 'Go to Cloudflare Pages → Settings → Environment Variables and add API_URL with your backend URL.'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }

    // Ensure apiUrl has a protocol
    if (!apiUrl.startsWith('http')) {
        apiUrl = `https://${apiUrl}`;
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

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
