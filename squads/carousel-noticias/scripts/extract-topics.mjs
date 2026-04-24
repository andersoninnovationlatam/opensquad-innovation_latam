/**
 * Extrai temas, marcas, empresas e figuras públicas do copy do carrossel.
 * Usa OPENROUTER_MODELS_SEARCH (ex: openai/gpt-4o-search-preview) para análise.
 *
 * Uso (na raiz do repo):
 *   node squads/carousel-noticias/scripts/extract-topics.mjs <output-dir>
 *
 * Exemplo:
 *   node squads/carousel-noticias/scripts/extract-topics.mjs squads/carousel-noticias/output
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
const API_KEY = process.env.OPENROUTER_API_KEY || env["OPENROUTER_API_KEY"];
const MODEL =
  process.env.OPENROUTER_MODELS_SEARCH ||
  env["OPENROUTER_MODELS_SEARCH"] ||
  "openai/gpt-4o-search-preview";

if (!API_KEY) {
  console.error("❌ OPENROUTER_API_KEY não encontrada no .env ou no ambiente.");
  process.exit(1);
}

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
console.log(`\n🔍 Extraindo entidades visuais do copy...`);
console.log(`📋 Modelo: ${MODEL}`);
console.log(`📄 Fonte: ${copyPath}\n`);

const userPrompt = `Analise este copy de carrossel para Instagram e extraia todas as entidades que possuem identidade visual reconhecível (marcas, empresas, instituições, figuras públicas, produtos com logo).

COPY DO CARROSSEL:
---
${carouselCopy}
---

Retorne APENAS um objeto JSON válido, sem markdown, sem explicações, com exatamente esta estrutura:
{
  "themes": ["tema1", "tema2"],
  "companies": ["Empresa1", "Empresa2"],
  "brands": ["Marca1", "Marca2"],
  "public_figures": ["Nome Completo1", "Nome Completo2"],
  "search_queries": [
    "Empresa1 logo oficial identidade visual",
    "Marca1 brand identity colors",
    "Nome Completo1 foto profissional cargo"
  ]
}

Regras de extração:
- themes: temas principais da notícia com representação iconográfica (ex: "taxa de juros", "inteligência artificial", "energia solar")
- companies: empresas, bancos, startups, órgãos governamentais mencionados explicitamente (ex: "Banco Central", "Nubank", "Apple")
- brands: produtos, serviços ou submarcas com logo próprio (ex: "Pix", "ChatGPT", "iPhone")
- public_figures: pessoas mencionadas pelo nome com cargo público ou notoriedade
- search_queries: uma query em português OU inglês por entidade visual (priorizar empresas e marcas), otimizada para encontrar logo ou imagem oficial
- Se uma lista estiver vazia, retornar []
- Não duplicar entidades entre companies e brands`;

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://innovationlatam.com",
    "X-Title": "Innovation Latam Topic Extractor",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.1,
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error(`❌ Erro na API [${response.status}]:`, err.slice(0, 400));
  process.exit(1);
}

const data = await response.json();
const rawContent = data?.choices?.[0]?.message?.content || "";

let topics;
try {
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON não encontrado na resposta");
  topics = JSON.parse(jsonMatch[0]);
} catch (e) {
  console.error("❌ Erro ao parsear JSON da resposta:", e.message);
  console.error("Resposta bruta recebida:", rawContent.slice(0, 600));
  process.exit(1);
}

// Garantir todas as chaves esperadas
const normalized = {
  themes: topics.themes || [],
  companies: topics.companies || [],
  brands: topics.brands || [],
  public_figures: topics.public_figures || [],
  search_queries: topics.search_queries || [],
};

fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "topics.json");
fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));

console.log(`✅ topics.json salvo: ${outputPath}`);
console.log(`\n   📌 Temas: ${normalized.themes.length} — ${normalized.themes.join(", ") || "nenhum"}`);
console.log(`   🏢 Empresas: ${normalized.companies.length} — ${normalized.companies.join(", ") || "nenhuma"}`);
console.log(`   🏷️  Marcas: ${normalized.brands.length} — ${normalized.brands.join(", ") || "nenhuma"}`);
console.log(`   👤 Figuras públicas: ${normalized.public_figures.length} — ${normalized.public_figures.join(", ") || "nenhuma"}`);
console.log(`   🔎 Queries de busca: ${normalized.search_queries.length}`);
normalized.search_queries.forEach((q) => console.log(`      → ${q}`));
