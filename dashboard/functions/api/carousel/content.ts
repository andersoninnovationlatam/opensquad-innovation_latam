interface Env {
  CAROUSEL_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  if (type !== "copy" && type !== "artbrief") {
    return Response.json({ error: "type must be copy or artbrief" }, { status: 400 });
  }

  const content = await env.CAROUSEL_KV.get(type);
  if (!content) {
    return Response.json({ error: "content not found" }, { status: 404 });
  }

  return Response.json({ content });
};
