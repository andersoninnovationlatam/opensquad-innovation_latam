interface Env {
  CAROUSEL_KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const step = params.step as string;
  const validSteps = ["approve-content", "approve-art-brief", "final-approval"];

  if (!validSteps.includes(step)) {
    return Response.json({ error: "unknown step" }, { status: 400 });
  }

  try {
    const body = await request.json() as Record<string, string>;
    const responseContent = body.editedContent ?? body.response ?? "ok";

    await env.CAROUSEL_KV.put(`checkpoint:${step}`, responseContent);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "internal error" }, { status: 500 });
  }
};
