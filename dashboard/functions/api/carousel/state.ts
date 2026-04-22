interface Env {
  CAROUSEL_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const raw = await env.CAROUSEL_KV.get("state");
  if (!raw) {
    return Response.json({ error: "no state" }, { status: 404 });
  }
  try {
    const state = JSON.parse(raw);
    return Response.json(state);
  } catch {
    return Response.json({ error: "invalid state" }, { status: 500 });
  }
};
