/**
 * Extrai entidades visuais do bloco `=== ENTIDADES ===` do carousel-copy.md.
 *
 * Formato esperado em carousel-copy.md (gerado pelo Caio):
 *
 *   === ENTIDADES ===
 *   - Nubank (tipo: empresa) — slide alvo: 1
 *   - Banco Central (tipo: empresa) — slide alvo: 3
 *   - Roberto Campos Neto (tipo: pessoa) — slide alvo: 5
 *   - Brasil (tipo: pais) — slide alvo: 7
 *
 * Tipos aceitos: empresa, marca, pessoa, pais (mapeados para company/brand/person/location).
 * Caso o bloco contenha apenas `- (nenhuma)`, gera topics.json com entities: [].
 *
 * Uso (na raiz do repo):
 *   node squads/carousel-noticias/scripts/extract-topics.mjs <output-dir>
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const TYPE_MAP = {
  empresa: "company",
  marca: "brand",
  pessoa: "person",
  pais: "location",
};

const VALID_SLIDES = new Set([1, 3, 5, 7]);

const outputDirArg = process.argv[2];
if (!outputDirArg) {
  console.error("Uso: node extract-topics.mjs <output-dir>");
  process.exit(1);
}

const outputDir = path.isAbsolute(outputDirArg)
  ? outputDirArg
  : path.resolve(REPO_ROOT, outputDirArg);

const copyPath = path.join(outputDir, "carousel-copy.md");
if (!fs.existsSync(copyPath)) {
  console.error(`❌ Arquivo não encontrado: ${copyPath}`);
  console.error("Certifique-se que o copy foi gerado pelo Caio antes de executar este script.");
  process.exit(1);
}

const carouselCopy = fs.readFileSync(copyPath, "utf-8");

console.log(`\n🔍 Lendo bloco "=== ENTIDADES ===" de ${copyPath}\n`);

function extractEntidadesBlock(text) {
  const match = text.match(/===\s*ENTIDADES\s*===\s*([\s\S]*?)(?=\n===|$)/i);
  return match ? match[1].trim() : null;
}

function normalizeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function parseLine(line) {
  // Remove leading bullet/dash
  const cleaned = line.replace(/^\s*[-*•]\s*/, "").trim();
  if (!cleaned) return null;

  // Detecta marcador "(nenhuma)"
  if (/^\(?\s*nenhuma\s*\)?$/i.test(cleaned)) return { none: true };

  // Padrão: Nome (tipo: TIPO) — slide alvo: N [— query: "texto preciso"]
  // O campo query é opcional e permite ao Caio especificar uma busca exata
  const re = /^(.+?)\s*\(\s*tipo\s*:\s*([a-zA-Záéíóúâêôãõç]+)\s*\)\s*[—\-–]\s*slide\s*alvo\s*:\s*(\d+)(?:\s*[—\-–]\s*query\s*:\s*"([^"]+)")?\s*$/i;
  const m = cleaned.match(re);
  if (!m) return { invalid: cleaned };

  const rawName = m[1].trim();
  const rawType = normalizeAccents(m[2]);
  const slideNumber = parseInt(m[3], 10);
  const customQuery = m[4] ? m[4].trim() : null;

  const mappedType = TYPE_MAP[rawType];
  if (!mappedType) return { invalid: cleaned, reason: `tipo "${rawType}" inválido (use empresa|marca|pessoa|pais)` };
  if (!VALID_SLIDES.has(slideNumber)) {
    return { invalid: cleaned, reason: `slide ${slideNumber} inválido (use 1, 3, 5 ou 7)` };
  }

  return {
    entity: { name: rawName, type: mappedType, slide: slideNumber, query: customQuery },
  };
}

const block = extractEntidadesBlock(carouselCopy);
if (block === null) {
  console.error("❌ Bloco '=== ENTIDADES ===' não encontrado em carousel-copy.md.");
  console.error("O Caio precisa preencher este bloco antes do Bruno executar a busca.");
  process.exit(1);
}

const lines = block
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const entities = [];
const invalids = [];
let isNone = false;

for (const line of lines) {
  const parsed = parseLine(line);
  if (!parsed) continue;
  if (parsed.none) {
    isNone = true;
    break;
  }
  if (parsed.invalid) {
    invalids.push({ line: parsed.invalid, reason: parsed.reason || "formato não reconhecido" });
    continue;
  }
  entities.push(parsed.entity);
}

if (invalids.length > 0) {
  console.warn(`⚠️  ${invalids.length} linha(s) ignorada(s) por formato inválido:`);
  invalids.forEach((it) => console.warn(`   - "${it.line}" (${it.reason})`));
}

// Garantir unicidade por slide (manter a primeira ocorrência)
const seenSlides = new Set();
const uniqueEntities = [];
for (const ent of entities) {
  if (seenSlides.has(ent.slide)) {
    console.warn(`⚠️  Slide ${ent.slide} duplicado — mantendo apenas a primeira entidade.`);
    continue;
  }
  seenSlides.add(ent.slide);
  uniqueEntities.push(ent);
}

uniqueEntities.sort((a, b) => a.slide - b.slide);

// Compor estrutura legada (mantém compatibilidade com search-reference-images.mjs)
const companies = uniqueEntities.filter((e) => e.type === "company").map((e) => e.name);
const brands = uniqueEntities.filter((e) => e.type === "brand").map((e) => e.name);
const public_figures = uniqueEntities.filter((e) => e.type === "person").map((e) => e.name);
const locations = uniqueEntities.filter((e) => e.type === "location").map((e) => e.name);

const search_queries = uniqueEntities.map((e) => {
  // Custom query from Caio takes priority — most precise
  if (e.query) return e.query;
  if (e.type === "person") return `${e.name} portrait professional photo`;
  if (e.type === "location") return `${e.name} national flag symbol`;
  if (e.type === "brand") return `${e.name} official brand logo transparent`;
  return `${e.name} official logo transparent PNG`;
});

const topics = {
  source: "carousel-copy.md::ENTIDADES",
  generated_at: new Date().toISOString(),
  entities: uniqueEntities,
  companies,
  brands,
  public_figures,
  locations,
  search_queries,
  themes: [],
};

fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "topics.json");
fs.writeFileSync(outputPath, JSON.stringify(topics, null, 2));

console.log(`✅ topics.json salvo: ${outputPath}\n`);

if (isNone || uniqueEntities.length === 0) {
  console.log("ℹ️  Nenhuma entidade declarada pelo Caio.");
  console.log("   O Bruno encerrará sem downloads e a Diana gerará todos os backgrounds via IA.");
  process.exit(0);
}

console.log(`   Entidades mapeadas (${uniqueEntities.length}):`);
uniqueEntities.forEach((e) => {
  console.log(`     slide-${String(e.slide).padStart(2, "0")} → ${e.name} (${e.type})`);
});
console.log(`\n   Queries geradas:`);
search_queries.forEach((q) => console.log(`     → ${q}`));
