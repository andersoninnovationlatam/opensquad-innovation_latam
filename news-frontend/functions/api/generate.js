export async function onRequestPost(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    let apiUrl = env.API_URL;
    if (!apiUrl) return new Response(JSON.stringify({ error: 'API_URL not configured' }), { status: 500, headers: corsHeaders });
    if (!apiUrl.startsWith('http')) apiUrl = `https://${apiUrl}`;

    try {
        const body = await request.json();
        const response = await fetch(`${apiUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        return new Response(JSON.stringify(result), { headers: corsHeaders });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to connect to backend', details: error.message }), { status: 502, headers: corsHeaders });
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
