export async function onRequestGet(context) {
    const { env } = context;

    const apiUrl = env.API_URL || 'NOT_CONFIGURED';

    return new Response(JSON.stringify({
        apiUrl: apiUrl,
        hasApiUrl: !!env.API_URL,
        timestamp: new Date().toISOString()
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
