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

  // Padrão: Nome (tipo: TIPO) — slide alvo: N
  // Aceita travessão "—" ou "-" como separador
  const re = /^(.+?)\s*\(\s*tipo\s*:\s*([a-zA-Záéíóúâêôãõç]+)\s*\)\s*[—\-–]\s*slide\s*alvo\s*:\s*(\d+)\s*$/i;
  const m = cleaned.match(re);
  if (!m) return { invalid: cleaned };

  const rawName = m[1].trim();
  const rawType = normalizeAccents(m[2]);
  const slideNumber = parseInt(m[3], 10);

  const mappedType = TYPE_MAP[rawType];
  if (!mappedType) return { invalid: cleaned, reason: `tipo "${rawType}" inválido (use empresa|marca|pessoa|pais)` };
  if (!VALID_SLIDES.has(slideNumber)) {
    return { invalid: cleaned, reason: `slide ${slideNumber} inválido (use 1, 3, 5 ou 7)` };
  }

  return {
    entity: { name: rawName, type: mappedType, slide: slideNumber },
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
    // "(nenhuma)" só significa "sem entidades" se for a ÚNICA linha do bloco.
    // Se já temos entidades coletadas, é apenas um placeholder de slot vazio — ignorar.
    if (entities.length === 0) {
      isNone = true;
      break;
    }
    continue;
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

// Extrair palavras-chave do contexto da notícia para enriquecer as queries
const newsInputPath = path.join(outputDir, "news-input.md");
let newsContext = "";
if (fs.existsSync(newsInputPath)) {
  const newsText = fs.readFileSync(newsInputPath, "utf-8");
  // Remover frontmatter e pegar o primeiro parágrafo substantivo
  const withoutFrontmatter = newsText.replace(/^---[\s\S]*?---\s*/m, "").trim();
  // Pular linhas de heading (# ## ###) e pegar o primeiro parágrafo de texto real
  const paragraphs = withoutFrontmatter.split(/\n\n+/).map((p) => p.trim());
  const firstPara = paragraphs.find((p) => p.length > 50 && !p.startsWith("#")) || "";
  // Extrair até 6 palavras-chave relevantes (substantivos longos, evitar artigos/preposições)
  const stopWords = new Set([
    "de","do","da","dos","das","em","no","na","nos","nas","para","com","por","uma","um",
    "que","se","e","o","a","os","as","ao","aos","é","foi","são","ser","está","tem",
    "the","of","in","for","and","to","a","an","is","was","are","be","has","have",
  ]);
  const keywords = firstPara
    .replace(/[^\wÀ-ú\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !stopWords.has(w.toLowerCase()))
    .slice(0, 6)
    .join(" ");
  newsContext = keywords;
}

// Gera múltiplas queries por entidade (da mais específica para a mais genérica)
// Cada entidade recebe um array de queries; o script de busca tenta na ordem
const search_queries_v2 = uniqueEntities.map((e) => {
  const ctx = newsContext;
  if (e.type === "person") {
    return [
      `"${e.name}" foto`,
      `"${e.name}"`,
      `${e.name} foto portrait`,
      `${e.name}`,
    ];
  }
  if (e.type === "location") {
    return [
      `${e.name} bandeira oficial`,
      `${e.name} flag`,
      `${e.name} país`,
      `${e.name}`,
    ];
  }
  if (e.type === "brand") {
    return [
      `${e.name} logo PNG`,
      `${e.name} logo`,
      `${e.name} marca`,
      `${e.name}`,
    ];
  }
  // company — instituto, governo, corporação, etc.
  const shortName = e.name.split(/\s+/).slice(0, 3).join(" ");
  const queries = [
    `"${e.name}" logo`,
    `${e.name} logo PNG`,
    `${shortName} logo`,
  ];
  if (ctx) queries.push(`${shortName} ${ctx}`.trim());
  queries.push(shortName);
  return queries;
});

// search_queries legado (primeira query de cada entidade, para compatibilidade)
const search_queries = search_queries_v2.map((qs) => qs[0]);

const topics = {
  source: "carousel-copy.md::ENTIDADES",
  generated_at: new Date().toISOString(),
  entities: uniqueEntities,
  companies,
  brands,
  public_figures,
  locations,
  search_queries,
  search_queries_v2: Object.fromEntries(uniqueEntities.map((e, i) => [e.name, search_queries_v2[i]])),
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
console.log(`\n   Queries geradas (multi-fallback):`);
uniqueEntities.forEach((e, i) => {
  console.log(`     ${e.name}:`);
  search_queries_v2[i].forEach((q) => console.log(`       → ${q}`));
});
