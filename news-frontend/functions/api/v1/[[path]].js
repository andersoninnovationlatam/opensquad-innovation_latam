const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequest(context) {
    const { request, env, params } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    let apiUrl = env.API_URL;
    if (!apiUrl) {
        return new Response(JSON.stringify({ error: 'API_URL not configured' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    if (!apiUrl.startsWith('http')) apiUrl = `https://${apiUrl}`;

    const path = params.path ? (Array.isArray(params.path) ? params.path.join('/') : params.path) : '';
    const url = new URL(request.url);
    const target = `${apiUrl}/api/v1/${path}${url.search}`;

    const headers = new Headers();
    const auth = request.headers.get('Authorization');
    const ct = request.headers.get('Content-Type');
    if (auth) headers.set('Authorization', auth);
    if (ct) headers.set('Content-Type', ct);

    const body = ['GET', 'HEAD', 'DELETE'].includes(request.method) ? undefined : await request.arrayBuffer();

    try {
        const response = await fetch(target, {
            method: request.method,
            headers,
            body,
        });

        const respHeaders = new Headers(corsHeaders);
        const respCt = response.headers.get('Content-Type');
        if (respCt) respHeaders.set('Content-Type', respCt);

        return new Response(response.body, {
            status: response.status,
            headers: respHeaders,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to connect to backend', details: error.message }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}
