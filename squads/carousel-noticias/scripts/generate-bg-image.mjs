/**
 * Gera imagem de fundo para um slide via OpenRouter.
 * Modelo configurável via OPENROUTER_MODELS_IMAGE no .env.
 *
 * Uso (na raiz do repo):
 *   node squads/carousel-noticias/scripts/generate-bg-image.mjs <slide-number> <output-dir>
 *
 * Exemplo:
 *   node squads/carousel-noticias/scripts/generate-bg-image.mjs 01 squads/carousel-noticias/output/2026-04-14-094324
 *
 * Prompts customizados: coloque bg-prompts.json na pasta pai do output-dir com formato:
 *   { "01": "seu prompt aqui", "03": "...", ... }
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

// ── Carregar .env ──────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env");
  if (!fs.existsSync(envPath)) return {};
  return fs
    .readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#") && l.trim())
    .reduce((acc, l) => {
      const [k, ...v] = l.split("=");
      acc[k.trim()] = v.join("=").trim().replace(/^['"]|['"]$/g, "");
      return acc;
    }, {});
}

const env = loadEnv();

const API_KEY = process.env.OPENROUTER_API_KEY || env["OPENROUTER_API_KEY"];
if (!API_KEY) {
  console.error("❌ OPENROUTER_API_KEY não encontrada no .env ou no ambiente.");
  process.exit(1);
}

// Modelo: lê do .env. Fallback para gemini-3.1-flash-image-preview
const DEFAULT_MODEL = "google/gemini-3.1-flash-image-preview";
const MODEL =
  process.env.OPENROUTER_MODELS_IMAGE ||
  env["OPENROUTER_MODELS_IMAGE"] ||
  DEFAULT_MODEL;

if (!(process.env.OPENROUTER_MODELS_IMAGE || env["OPENROUTER_MODELS_IMAGE"])) {
  console.warn(`⚠️  OPENROUTER_MODELS_IMAGE não definida no .env — usando default: ${DEFAULT_MODEL}`);
}

// ── Args ───────────────────────────────────────────────────────────────────────
const slideNum = (process.argv[2] || "01").padStart(2, "0");
const outputDirArg = process.argv[3];
if (!outputDirArg) {
  console.error("Uso: node generate-bg-image.mjs <slide-number> <output-dir>");
  process.exit(1);
}
const outputDir = path.isAbsolute(outputDirArg)
  ? outputDirArg
  : path.resolve(REPO_ROOT, outputDirArg);

// ── Prompts padrão (carousel-noticias) ────────────────────────────────────────
// Prompts genéricos de alta qualidade para slides inspiracionais.
// Sobrescreva com bg-prompts.json na pasta pai do output-dir.
const DEFAULT_PROMPTS = {
  "01": "A breathtaking aerial view of a glowing city at dawn, light rays emerging from the horizon cutting through urban skyline, network nodes and data streams subtly overlaid, sense of historical transformation and possibility, cinematic and hopeful atmosphere, deep blue and gold tones. Ultra realistic, professional photography, high resolution, 4:5 aspect ratio, clean composition. --no text, watermark, cartoon, illustration",
  "03": "Abstract visualization of global technological adoption waves, concentric circles of light expanding from a central point across a world map, interconnected nodes glowing in sequence, sense of unstoppable momentum and speed, deep space blue background with bright cyan and white light pulses. Ultra realistic, high resolution, 4:5 aspect ratio, clean composition. --no text, watermark",
  "05": "A modern open-plan office with professionals of diverse backgrounds working at laptops and tablets, natural light flooding through floor-to-ceiling windows, screens displaying data dashboards, collaborative energy, warm and inviting atmosphere. Ultra realistic, professional photography, high resolution, 4:5 aspect ratio. --no text, watermark",
  "07": "Aerial view of a vibrant modern city at night with glowing infrastructure, roads and buildings forming a network pattern, warm amber and blue lights, one illuminated tower standing taller as a metaphor for leadership and vision. Ultra realistic, professional photography, high resolution, 4:5 aspect ratio. --no text, watermark",
};

// Tentar carregar bg-prompts.json customizado (na pasta pai do outputDir)
const overridePath = path.join(path.dirname(outputDir), "bg-prompts.json");
let prompts = { ...DEFAULT_PROMPTS };
if (fs.existsSync(overridePath)) {
  try {
    const custom = JSON.parse(fs.readFileSync(overridePath, "utf8"));
    prompts = { ...prompts, ...custom };
    console.log(`📎 Prompts override carregados: ${overridePath}`);
  } catch (e) {
    console.warn("⚠️  bg-prompts.json inválido, usando padrão:", e.message);
  }
}

const prompt = prompts[slideNum];
if (!prompt) {
  console.error(
    `❌ Slide ${slideNum} não tem prompt definido. Disponíveis: ${Object.keys(prompts).join(", ")}`
  );
  process.exit(1);
}

// ── Gerar imagem ───────────────────────────────────────────────────────────────
console.log(`\n🎬 Gerando imagem de fundo — slide-${slideNum}`);
console.log(`📋 Modelo: ${MODEL}`);
console.log(`📝 Prompt: ${prompt.slice(0, 100)}...`);

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
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
  console.error(`❌ Erro na API [${response.status}]:`, err.slice(0, 300));
  process.exit(1);
}

const data = await response.json();

let imageData = null;
let imageType = "png";

// Tentar extrair imagem — diferentes modelos retornam em locais diferentes
const images = data?.choices?.[0]?.message?.images;
const contentRaw = data?.choices?.[0]?.message?.content;

if (images && images.length > 0) {
  const url = images[0]?.image_url?.url || "";
  if (url.startsWith("data:image")) {
    const match = url.match(/^data:image\/(\w+);base64,(.+)$/s);
    if (match) {
      imageType = match[1] === "jpeg" ? "jpg" : match[1];
      imageData = Buffer.from(match[2], "base64");
    }
  } else if (url.startsWith("http")) {
    console.log("📥 Baixando de URL:", url.slice(0, 80));
    const imgRes = await fetch(url);
    imageData = Buffer.from(await imgRes.arrayBuffer());
    const ct = imgRes.headers.get("content-type") || "";
    imageType = ct.includes("jpeg") ? "jpg" : "png";
  }
} else if (contentRaw && typeof contentRaw === "string" && contentRaw.startsWith("data:image")) {
  const match = contentRaw.match(/^data:image\/(\w+);base64,(.+)$/s);
  if (match) {
    imageType = match[1] === "jpeg" ? "jpg" : match[1];
    imageData = Buffer.from(match[2], "base64");
  }
}

if (!imageData) {
  console.error("❌ Não foi possível extrair imagem da resposta da API.");
  console.error("Resposta:", JSON.stringify(data).slice(0, 500));
  process.exit(1);
}

// ── Salvar ─────────────────────────────────────────────────────────────────────
const bgDir = path.join(outputDir, "images", "v1");
fs.mkdirSync(bgDir, { recursive: true });

// Remover versões anteriores do mesmo slide
for (const ext of ["jpg", "jpeg", "png", "webp"]) {
  const f = path.join(bgDir, `slide-${slideNum}-bg.${ext}`);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

const outFile = path.join(bgDir, `slide-${slideNum}-bg.${imageType}`);
fs.writeFileSync(outFile, imageData);

console.log(`✅ Imagem salva: ${outFile}`);
console.log(`📐 Tamanho: ${(imageData.length / 1024).toFixed(1)} KB`);
