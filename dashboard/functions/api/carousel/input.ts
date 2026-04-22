interface Env {
  CAROUSEL_KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Record<string, string>;
    const { newsText, angle, contentModel, imageModel } = body;

    if (!newsText || !angle) {
      return Response.json({ error: "newsText and angle required" }, { status: 400 });
    }

    await Promise.all([
      env.CAROUSEL_KV.put("news-input", newsText),
      env.CAROUSEL_KV.put("selected-angle", angle),
      env.CAROUSEL_KV.put("content-model", contentModel ?? "openai/gpt-4.5"),
      env.CAROUSEL_KV.put("image-model", imageModel ?? "google/gemini-2.5-flash-image"),
      env.CAROUSEL_KV.put("phase", "awaiting-trigger"),
    ]);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "internal error" }, { status: 500 });
  }
};
