export async function onRequestGet(context) {
    const { request, env } = context;
    const corsHeaders = { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' };

    let apiUrl = env.API_URL;
    if (!apiUrl) return new Response('API_URL not configured', { status: 500, headers: corsHeaders });
    if (!apiUrl.startsWith('http')) apiUrl = `https://${apiUrl}`;

    try {
        const url = new URL(request.url);
        const upstreamPath = url.pathname.startsWith('/api/v1/')
            ? url.pathname
            : url.pathname.replace(/^\/api\//, '/api/v1/');
        const response = await fetch(`${apiUrl}${upstreamPath}`, {
            headers: { 'Authorization': request.headers.get('Authorization') || '' },
        });
        const text = await response.text();
        return new Response(text, { status: response.status, headers: corsHeaders });
    } catch (error) {
        return new Response(`Failed to fetch logs: ${error.message}`, { status: 502, headers: corsHeaders });
    }
}
