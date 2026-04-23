/**
 * Gera imagem de fundo para um slide via OpenRouter (google/gemini-flash-image-generation).
 * Uso (na raiz do repo):
 *   node squads/agent-social-media-v2/scripts/generate-bg-image.mjs <slide-number> <output-dir>
 *
 * Exemplo:
 *   node squads/agent-social-media-v2/scripts/generate-bg-image.mjs 01 squads/agent-social-media-v2/output/2026-04-03-130000/slides
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

// Load .env manually
const envPath = path.join(REPO_ROOT, ".env");
const envVars = fs.readFileSync(envPath, "utf-8")
  .split("\n")
  .filter(l => l.includes("=") && !l.startsWith("#"))
  .reduce((acc, l) => {
    const [k, ...v] = l.split("=");
    acc[k.trim()] = v.join("=").trim();
    return acc;
  }, {});

const API_KEY = envVars["OPENROUTER_API_KEY"];
if (!API_KEY) throw new Error("OPENROUTER_API_KEY não encontrada no .env");

const MODEL = "google/gemini-3.1-flash-image-preview";

const slideNum = process.argv[2] || "01";
const outputDirArg = process.argv[3];
if (!outputDirArg) {
  console.error("Usage: node generate-bg-image.mjs <slide-number> <output-dir>");
  process.exit(1);
}

const outputDir = path.isAbsolute(outputDirArg)
  ? outputDirArg
  : path.resolve(REPO_ROOT, outputDirArg);

// ── Prompts por slide (tema: governança de IA / pesquisa acadêmica — Berkeley RDI) ──
const prompts = {
  "01": `Cinematic documentary photography, Medium Wide Shot, Eye Level, Sony A7 III 50mm f/1.8. A real diverse professional in a modern office at dusk, worried but focused expression, hands near laptop keyboard, multiple monitors showing abstract charts (no readable text). Warm practical lamp, cool screen glow on face. Photorealistic human presence, authentic skin texture, natural light mix. Deep purple and teal ambient. No logos, no brands, no text in image. real person, photorealistic, documentary style, candid, 8K, film grain. --no surreal, fantasy, CGI, abstract-only, floating brains, data waves without humans`,

  "02": `Cinematic editorial photography, Wide Shot, Eye Level, Canon R5 35mm f/2.8. University AI research lab: two real researchers (diverse) at workstations with monitors showing neural network visualizations (no readable text), whiteboards blurred in background, soft overhead LEDs, Berkeley-style brick and glass. Photorealistic, natural skin, documentary feel. Teal and purple color grade. No logos, no text in image. --no cartoon, illustration, 3d render`,

  "03": `Cinematic editorial photography, Medium Shot, Eye Level. Corporate innovation meeting room: real executives around a table with laptops closed, one person gesturing mid-explanation, large window with city dusk bokeh. Theme: governance and structure. Natural office lighting, photorealistic, diverse team. Deep purple shadows, teal accents. No logos, no text in image. --no cartoon, illustration`,

  "04": `Cinematic editorial photography, Medium Wide Shot. Security operations center aesthetic but corporate: real analyst at desk with multiple screens showing abstract dashboards (no text), red alert glow subtle, serious mood. Photorealistic, documentary. Purple-teal cinematic grade. No logos, no readable text. --no cartoon`,

  "05": `Cinematic editorial photography, Medium Shot. Thoughtful executive silhouette near floor-to-ceiling window at blue hour, city lights bokeh, hands clasped behind back — contemplative governance mood. Rim light, photorealistic silhouette with natural edge. Purple and gold ambient. No logos, no text. --no cartoon`,

  "06": `Cinematic editorial photography, Close-Medium Shot. Professional hands holding smartphone in office, screen glow on fingers only (screen content abstract blur). Teal and purple ambient. Save/share metaphor without icons with text. Photorealistic, shallow DOF. No logos, no text in image. --no cartoon`,
};

const overridePath = path.join(path.dirname(outputDir), "bg-prompts.json");
let mergedPrompts = { ...prompts };
if (fs.existsSync(overridePath)) {
  try {
    const o = JSON.parse(fs.readFileSync(overridePath, "utf8"));
    mergedPrompts = { ...mergedPrompts, ...o };
    console.log(`📎 Prompts override: ${overridePath}`);
  } catch (e) {
    console.warn("⚠️ bg-prompts.json inválido, usando defaults:", e.message);
  }
}

const prompt = mergedPrompts[slideNum];
if (!prompt) {
  console.error(`Slide ${slideNum} não tem prompt definido. Disponíveis: ${Object.keys(mergedPrompts).join(", ")}`);
  process.exit(1);
}

// ── Chamada API ────────────────────────────────────────────────────────────
console.log(`🎬 Gerando imagem para slide-${slideNum} via OpenRouter...`);
console.log(`📋 Modelo: ${MODEL}`);

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://innovationlatam.com",
    "X-Title": "Innovation Latam Carousel Generator",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Generate a photorealistic image for an Instagram carousel slide (portrait format, 4:5 ratio). ${prompt}`,
      },
    ],
    modalities: ["image"],
    response_modalities: ["image"],
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error("❌ Erro na API:", response.status, err);
  process.exit(1);
}

const data = await response.json();

// ── Extrair imagem da resposta ─────────────────────────────────────────────
// OpenRouter retorna a imagem em message.images[0].image_url.url (data:image/... base64)
let imageData = null;
let imageType = "png";

const images = data?.choices?.[0]?.message?.images;
if (images && images.length > 0) {
  const url = images[0]?.image_url?.url;
  if (url?.startsWith("data:image")) {
    const match = url.match(/^data:image\/(\w+);base64,(.+)$/s);
    if (match) {
      imageType = match[1] === "jpeg" ? "jpg" : match[1];
      imageData = Buffer.from(match[2], "base64");
    }
  } else if (url?.startsWith("http")) {
    console.log("📥 Baixando imagem de URL:", url.slice(0, 100));
    const imgRes = await fetch(url);
    imageData = Buffer.from(await imgRes.arrayBuffer());
    const ct = imgRes.headers.get("content-type") || "";
    imageType = ct.includes("jpeg") ? "jpg" : "png";
  }
}

if (!imageData) {
  console.error("❌ Não foi possível extrair imagem da resposta.");
  const safe = JSON.stringify(data, (k, v) =>
    typeof v === "string" && v.length > 200 ? `[len=${v.length}]` : v, 2);
  console.error(safe);
  process.exit(1);
}

// ── Salvar imagem ──────────────────────────────────────────────────────────
const bgDir = path.join(outputDir, "backgrounds");
fs.mkdirSync(bgDir, { recursive: true });
// Evitar que inject-bg-and-render.mjs escolha extensão antiga (ordem jpg antes de png)
for (const ext of ["jpg", "jpeg", "png", "webp"]) {
  const f = path.join(bgDir, `bg-${slideNum}.${ext}`);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}
const outFile = path.join(bgDir, `bg-${slideNum}.${imageType}`);
fs.writeFileSync(outFile, imageData);
console.log(`✅ Imagem salva: ${outFile}`);
console.log(`📐 Tamanho: ${(imageData.length / 1024).toFixed(1)} KB`);
