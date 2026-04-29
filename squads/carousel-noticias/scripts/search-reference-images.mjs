/**
 * Baixa imagens das entidades listadas em topics.json.
 * Tenta URLs diretas encontradas via OpenRouter; fallback é guiar o agente para Google Images.
 * Salva os arquivos em <output-dir>/images/ e gera index.json.
 *
 * Uso (na raiz do repo):
 *   node squads/carousel-noticias/scripts/search-reference-images.mjs <output-dir>
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

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
const SERPAPI_KEY = process.env.SERPAPI_API_KEY || env["SERPAPI_API_KEY"];

if (!SERPAPI_KEY) {
  console.error("❌ SERPAPI_API_KEY não encontrada no .env ou no ambiente.");
  process.exit(1);
}

const outputDirArg = process.argv[2];
if (!outputDirArg) {
  console.error("Uso: node search-reference-images.mjs <output-dir>");
  process.exit(1);
}

const outputDir = path.isAbsolute(outputDirArg)
  ? outputDirArg
  : path.resolve(REPO_ROOT, outputDirArg);

const topicsPath = path.join(outputDir, "topics.json");
if (!fs.existsSync(topicsPath)) {
  console.error(`❌ topics.json não encontrado: ${topicsPath}`);
  console.error("Execute extract-topics.mjs primeiro.");
  process.exit(1);
}

const topics = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
const imagesDir = path.join(outputDir, "images");
fs.mkdirSync(imagesDir, { recursive: true });

const VALID_SLIDES = [1, 3, 5, 7]; // slides ímpares que recebem imagem de referência

// Preferir o novo formato `entities` (com slide já mapeado pelo Caio).
// Fallback: reconstruir a partir das listas legadas, na ordem 1 → 3 → 5 → 7.
let entities = [];
if (Array.isArray(topics.entities) && topics.entities.length > 0) {
  entities = topics.entities
    .filter((e) => e && e.name && VALID_SLIDES.includes(e.slide))
    .map((e) => ({ name: e.name, type: e.type || "company", slide: e.slide, query: e.query || null }));
} else {
  const legacy = [
    ...(topics.companies || []).map((name) => ({ name, type: "company" })),
    ...(topics.brands || []).map((name) => ({ name, type: "brand" })),
    ...(topics.public_figures || []).map((name) => ({ name, type: "person" })),
    ...(topics.locations || []).map((name) => ({ name, type: "location" })),
  ];
  entities = legacy.slice(0, VALID_SLIDES.length).map((e, i) => ({ ...e, slide: VALID_SLIDES[i] }));
}

console.log(`\n🌐 Buscando ${entities.length} imagem(ns) de referência...`);
console.log(`📋 Engine: SerpAPI Google Images`);
if (entities.length > 0) {
  console.log(`📌 Mapeamento:`);
  entities.forEach((e) => console.log(`   slide-${String(e.slide).padStart(2, "0")} → ${e.name} (${e.type})`));
}

if (entities.length === 0) {
  console.log("⚠️  Nenhuma entidade encontrada em topics.json.");
  console.log("   Diana gerará todos os backgrounds via IA.");
  const indexPath = path.join(imagesDir, "index.json");
  fs.writeFileSync(
    indexPath,
    JSON.stringify(
      { generated_at: new Date().toISOString(), images: [], pending_manual_download: [] },
      null,
      2
    )
  );
  process.exit(0);
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extFromContentType(contentType, fallback = ".jpg") {
  if (!contentType) return fallback;
  const ct = contentType.split(";")[0].trim().toLowerCase();
  const map = {
    "image/webp": ".webp",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
  };
  return map[ct] || fallback;
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    for (const ext of [".webp", ".png", ".jpg", ".jpeg", ".svg", ".avif"]) {
      if (pathname.endsWith(ext)) return ext === ".jpeg" ? ".jpg" : ext;
    }
  } catch {}
  return null;
}

function googleImagesUrl(query) {
  return `https://images.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
}

function getQuery(entity) {
  const entityName = entity.name;
  const entityType = entity.type;
  // Custom query authored by Caio — most precise, use directly
  if (entity.query) return entity.query;
  // Match against generated search_queries list
  const match = (topics.search_queries || []).find((q) =>
    q.toLowerCase().includes(entityName.toLowerCase())
  );
  if (match) return match;
  if (entityType === "person") return `${entityName} portrait professional photo`;
  if (entityType === "location") return `${entityName} national flag symbol`;
  if (entityType === "brand") return `${entityName} official brand logo transparent`;
  return `${entityName} official logo transparent PNG`;
}

async function downloadImage(imageUrl, entityName) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InnovationLatam/1.0)",
        Accept: "image/webp,image/png,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;

    const ext = extFromUrl(imageUrl) || extFromContentType(contentType);
    const filename = `${sanitizeFilename(entityName)}${ext}`;
    const localPath = path.join(imagesDir, filename);

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 1024) return null; // menor que 1KB = provável erro

    fs.writeFileSync(localPath, Buffer.from(buffer));
    return {
      localPath,
      relativePath: path.relative(REPO_ROOT, localPath),
      filename,
      ext,
      sizeKB: Math.round(buffer.byteLength / 1024),
    };
  } catch {
    return null;
  }
}

async function findImageUrl(entity) {
  const query = getQuery(entity);
  const googleUrl = googleImagesUrl(query);

  try {
    const serpParams = {
      api_key: SERPAPI_KEY,
      engine: "google_images",
      q: query,
      google_domain: "google.com.br",
      gl: "us",
      hl: "pt-br",
      safe: "off",
      licenses: "fc",
      num: "10",
    };
    // logos e marcas não são fotos — remover filtro image_type para companies/brands
    if (entity.type === "person" || entity.type === "location") {
      serpParams.image_type = "photo";
    }
    const params = new URLSearchParams(serpParams);

    const response = await fetch(`https://serpapi.com/search?${params}`);
    if (!response.ok) return null;

    const data = await response.json();
    const results = data?.images_results || [];

    const isClean = (url) =>
      url &&
      !url.includes("watermark") &&
      !url.includes("getty") &&
      !url.includes("shutterstock") &&
      !url.includes("alamy") &&
      !url.includes("dreamstime") &&
      !url.includes("istockphoto");

    // Para logos/empresas: priorizar PNG (fundo transparente)
    // Para fotos/locais: priorizar JPG/WEBP de alta resolução
    const isPng = (url) => url.toLowerCase().endsWith(".png") || url.toLowerCase().endsWith(".webp");
    const isJpg = (url) => url.toLowerCase().endsWith(".jpg") || url.toLowerCase().endsWith(".jpeg");

    const cleanResults = results.filter((r) => isClean(r.original || ""));

    let chosen;
    if (entity.type === "company" || entity.type === "brand") {
      chosen =
        cleanResults.find((r) => isPng(r.original || "")) ||
        cleanResults.find((r) => isJpg(r.original || "")) ||
        cleanResults[0];
    } else {
      chosen =
        cleanResults.find((r) => isJpg(r.original || "") || isPng(r.original || "")) ||
        cleanResults[0];
    }

    if (!chosen) chosen = results.find((r) => r.original);

    if (!chosen) return null;

    return {
      entity: entity.name,
      image_url: chosen.original,
      google_images_url: googleUrl,
    };
  } catch {
    return null;
  }
}

const downloadedImages = [];
const failedEntities = [];

for (let i = 0; i < entities.length; i++) {
  const entity = entities[i];
  const slideNumber = entity.slide;
  const slideLabel = String(slideNumber).padStart(2, "0");
  console.log(`\n  🔎 [slide-${slideLabel}] [${entity.type}] "${entity.name}"`);

  const result = await findImageUrl(entity);
  const imageUrl = result?.image_url;
  const googleUrl = result?.google_images_url || googleImagesUrl(getQuery(entity));

  if (imageUrl) {
    console.log(`     Baixando: ${imageUrl}`);
    const downloaded = await downloadImage(imageUrl, `slide-${slideLabel}-ref`);
    if (downloaded) {
      console.log(`     ✅ ${downloaded.filename} (${downloaded.sizeKB}KB)`);
      downloadedImages.push({
        entity: entity.name,
        type: entity.type,
        slide: slideNumber,
        file: downloaded.relativePath,
        source_url: imageUrl,
        size_kb: downloaded.sizeKB,
      });
    } else {
      console.warn(`     ⚠️  Download falhou — use Google Images manualmente:`);
      console.warn(`     🔗 ${googleUrl}`);
      failedEntities.push({ entity: entity.name, type: entity.type, slide: slideNumber, google_images_url: googleUrl });
    }
  } else {
    console.warn(`     ⚠️  URL não encontrada via API — use Google Images:`);
    console.warn(`     🔗 ${googleUrl}`);
    failedEntities.push({ entity: entity.name, type: entity.type, slide: slideNumber, google_images_url: googleUrl });
  }

  if (i < entities.length - 1) {
    await new Promise((r) => setTimeout(r, 600));
  }
}

const indexData = {
  generated_at: new Date().toISOString(),
  images: downloadedImages,
  pending_manual_download: failedEntities,
};

const indexPath = path.join(imagesDir, "index.json");
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log(`\n✅ Imagens salvas em: ${imagesDir}`);
console.log(`\n📊 Resumo (${entities.length} entidade(s) declaradas pelo Caio):`);
console.log(`   🖼️  Baixadas automaticamente: ${downloadedImages.length}/${entities.length}`);
console.log(`   ⚠️  Requerem download manual:  ${failedEntities.length}`);

if (downloadedImages.length > 0) {
  console.log(`\n📁 Arquivos:`);
  downloadedImages.forEach((img) => {
    console.log(`   ✅ slide-${String(img.slide).padStart(2, "0")} | ${img.entity} → ${path.basename(img.file)} (${img.size_kb}KB)`);
  });
}

if (failedEntities.length > 0) {
  console.log(`\n🔗 Busca manual no Google Images necessária para:`);
  failedEntities.forEach((f) => {
    console.log(`   ⚠️  slide-${String(f.slide).padStart(2, "0")} | ${f.entity}: ${f.google_images_url}`);
  });
}
