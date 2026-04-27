const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestPost(context) {
    const { request, env } = context;

    let apiUrl = env.API_URL;
    if (!apiUrl) return new Response(JSON.stringify({ error: 'API_URL not configured' }), { status: 500, headers: corsHeaders });
    if (!apiUrl.startsWith('http')) apiUrl = `https://${apiUrl}`;

    try {
        const body = await request.json();
        const response = await fetch(`${apiUrl}/api/v1/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': request.headers.get('Authorization') || '',
            },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        return new Response(JSON.stringify(result), { status: response.status, headers: corsHeaders });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to connect to backend', details: error.message }), { status: 502, headers: corsHeaders });
    }
}

export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders });
}
