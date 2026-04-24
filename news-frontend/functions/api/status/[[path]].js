const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestGet(context) {
    const { request, env } = context;

    let apiUrl = env.API_URL;
    if (!apiUrl) return new Response(JSON.stringify({ error: 'API_URL not configured' }), { status: 500, headers: corsHeaders });
    if (!apiUrl.startsWith('http')) apiUrl = `https://${apiUrl}`;

    try {
        const url = new URL(request.url);
        const response = await fetch(`${apiUrl}${url.pathname}`, {
            headers: { 'Authorization': request.headers.get('Authorization') || '' },
        });
        const result = await response.json();
        return new Response(JSON.stringify(result), { status: response.status, headers: corsHeaders });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch status', details: error.message }), { status: 502, headers: corsHeaders });
    }
}
