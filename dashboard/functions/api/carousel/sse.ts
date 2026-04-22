interface Env {
  CAROUSEL_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  let lastStateHash = "";

  async function poll() {
    try {
      const raw = await env.CAROUSEL_KV.get("state");
      if (raw && raw !== lastStateHash) {
        lastStateHash = raw;
        const data = JSON.stringify({ type: "CAROUSEL_UPDATE", state: JSON.parse(raw) });
        await writer.write(encoder.encode(`data: ${data}\n\n`));
      }
      // Keep-alive comment
      await writer.write(encoder.encode(":\n\n"));
    } catch {
      // ignore errors, client will reconnect
    }
  }

  // Poll every 2 seconds — Workers have limited execution time, client reconnects automatically
  const interval = setInterval(poll, 2000);

  // Cloudflare Workers don't support persistent connections beyond ~30s
  setTimeout(() => {
    clearInterval(interval);
    writer.close().catch(() => {});
  }, 25000);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
