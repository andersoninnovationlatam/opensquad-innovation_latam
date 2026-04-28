export async function onRequestGet(context) {
    const { env } = context;
    return new Response(JSON.stringify({
        apiUrl: env.API_URL || 'NOT_CONFIGURED',
        hasApiUrl: !!env.API_URL,
        timestamp: new Date().toISOString()
    }), { headers: { 'Content-Type': 'application/json' } });
}
