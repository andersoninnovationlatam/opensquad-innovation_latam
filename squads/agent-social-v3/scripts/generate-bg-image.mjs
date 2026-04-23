/**
 * Gera imagem de fundo para um slide via OpenRouter (Gemini image).
 * Uso (na raiz do repo):
 *   node squads/agent-social-v3/scripts/generate-bg-image.mjs <slide-number> <output-dir>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

// Load .env manually (mesmo padrão do v2)
const envPath = path.join(REPO_ROOT, ".env");
const envVars = fs
  .readFileSync(envPath, "utf-8")
  .split("\n")
  .filter((l) => l.includes("=") && !l.startsWith("#"))
  .reduce((acc, l) => {
    const [k, ...v] = l.split("=");
    acc[k.trim()] = v.join("=").trim();
    return acc;
  }, {});

const API_KEY = envVars["OPENROUTER_API_KEY"];
if (!API_KEY) throw new Error("OPENROUTER_API_KEY não encontrada no .env");

const MODEL = envVars["OPENROUTER_MODELS_IMAGE"] || "google/gemini-3.1-flash-image-preview";
if (!envVars["OPENROUTER_MODELS_IMAGE"]) console.warn("⚠️  OPENROUTER_MODELS_IMAGE não definida no .env, usando default");

const slideNum = process.argv[2] || "01";
const outputDirArg = process.argv[3];
if (!outputDirArg) {
  console.error("Usage: node generate-bg-image.mjs <slide-number> <output-dir>");
  process.exit(1);
}

const outputDir = path.isAbsolute(outputDirArg) ? outputDirArg : path.resolve(REPO_ROOT, outputDirArg);

// Prompts default (pode ser sobrescrito por bg-prompts.json na pasta do run)
const prompts = {
  "01": "Cinematic documentary photography, medium wide shot, eye level. Real cybersecurity analyst in a dim security operations center at night, focused expression, authentic skin texture, realistic monitors with abstract dashboards (no readable text). Purple and teal color grading. photorealistic, professional DSLR photography, 8k, film grain. --no cartoon, illustration, 3d render, painting, sketch, anime, stylized, cgi, text, watermark",
  "02": "Cinematic editorial photography, wide shot. Real team collaborating in a modern war room, laptops and reports, city lights bokeh, low-key lighting. Purple-teal grade. photorealistic, professional DSLR photography, 8k, film grain. --no cartoon, illustration, 3d render, painting, sketch, anime, stylized, cgi, text, watermark",
  "03": "Photorealistic close-up over-the-shoulder shot of hands typing on keyboard, laptop with abstract code blocks (no readable text), notebook, coffee cup, night office. Purple-teal grade. professional DSLR photography, 8k, film grain. --no cartoon, illustration, 3d render, painting, sketch, anime, stylized, cgi, text, watermark",
  "04": "Cinematic editorial photography, wide shot. Modern data center corridor with teal LED lights, leading lines, deep perspective, realistic textures. Purple-teal grade. photorealistic, professional DSLR photography, 8k, film grain. --no cartoon, illustration, 3d render, painting, sketch, anime, stylized, cgi, text, watermark",
  "05": "Photorealistic close-up portrait of thoughtful tech leader in dim office at night, Rembrandt lighting, authentic skin texture, shallow depth of field, purple-teal rim light. professional DSLR photography, 8k, film grain. --no cartoon, illustration, 3d render, painting, sketch, anime, stylized, cgi, plastic face, text, watermark",
  "06": "Photorealistic editorial photography, medium wide shot. Small team in modern meeting room pointing at whiteboard with abstract diagrams (no readable text), collaborative energy. Purple-teal grade. professional DSLR photography, 8k, film grain. --no cartoon, illustration, 3d render, painting, sketch, anime, stylized, cgi, text, watermark",
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

console.log(`🎬 Gerando imagem para slide-${slideNum} via OpenRouter...`);
console.log(`📋 Modelo: ${MODEL}`);

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
  console.error("❌ Erro na API:", response.status, err);
  process.exit(1);
}

const data = await response.json();

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
  process.exit(1);
}

const bgDir = path.join(outputDir, "backgrounds");
fs.mkdirSync(bgDir, { recursive: true });
for (const ext of ["jpg", "jpeg", "png", "webp"]) {
  const f = path.join(bgDir, `bg-${slideNum}.${ext}`);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

const outFile = path.join(bgDir, `bg-${slideNum}.${imageType}`);
fs.writeFileSync(outFile, imageData);
console.log(`✅ Imagem salva: ${outFile}`);
console.log(`📐 Tamanho: ${(imageData.length / 1024).toFixed(1)} KB`);
