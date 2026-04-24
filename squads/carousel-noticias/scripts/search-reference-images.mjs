/**
 * Busca referências visuais de marcas, empresas e figuras do topics.json.
 * Usa OPENROUTER_MODELS_SEARCH para pesquisar identidade visual na web.
 * Gera image-refs.json com descrições e URLs para uso nos prompts de paródia.
 *
 * Uso (na raiz do repo):
 *   node squads/carousel-noticias/scripts/search-reference-images.mjs <output-dir>
 *
 * Exemplo:
 *   node squads/carousel-noticias/scripts/search-reference-images.mjs squads/carousel-noticias/output
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

// Montar lista de entidades: companies + brands + public_figures
const entities = [
  ...(topics.companies || []).map((name) => ({ name, type: "company" })),
  ...(topics.brands || []).map((name) => ({ name, type: "brand" })),
  ...(topics.public_figures || []).map((name) => ({ name, type: "person" })),
];

console.log(`\n🌐 Buscando referências visuais na web...`);
console.log(`📋 Modelo: ${MODEL}`);
console.log(`🔢 Entidades a pesquisar: ${entities.length}`);

if (entities.length === 0) {
  console.log("⚠️  Nenhuma entidade com identidade visual encontrada em topics.json.");
  const outputData = {
    generated_at: new Date().toISOString(),
    themes: topics.themes || [],
    refs: [],
  };
  const outputPath = path.join(outputDir, "image-refs.json");
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`✅ image-refs.json salvo (vazio): ${outputPath}`);
  process.exit(0);
}

// Encontrar a query de busca para uma entidade (do topics.json ou fallback)
function getQuery(entityName, entityType) {
  const match = (topics.search_queries || []).find((q) =>
    q.toLowerCase().includes(entityName.toLowerCase())
  );
  if (match) return match;
  if (entityType === "person") return `${entityName} foto profissional cargo`;
  return `${entityName} logo oficial identidade visual`;
}

async function searchEntity(entity) {
  const query = getQuery(entity.name, entity.type);
  console.log(`\n  🔎 [${entity.type}] "${entity.name}"`);
  console.log(`     Query: ${query}`);

  const typeLabel =
    entity.type === "person"
      ? "pessoa pública, político ou figura notória"
      : entity.type === "brand"
      ? "marca ou produto"
      : "empresa ou instituição";

  const prompt = `Pesquise na internet a identidade visual de "${entity.name}" (${typeLabel}).

Retorne APENAS um objeto JSON válido, sem markdown, sem texto extra:
{
  "entity": "${entity.name}",
  "type": "${entity.type}",
  "query": "${query}",
  "visual_description": "descrição detalhada da identidade visual: cores exatas (hex se possível), formato do logo, estilo tipográfico, elementos gráficos característicos. Mínimo 2 frases.",
  "brand_colors": ["#hex1", "#hex2"],
  "logo_style": "descrição concisa em 1 frase do estilo do logo ou aparência da pessoa",
  "parody_notes": "elementos mais reconhecíveis e icônicos para criar uma paródia editorial — o que não pode faltar para o público reconhecer",
  "image_url": "URL direta de uma imagem do logo ou foto oficial se encontrada na busca, ou null"
}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://innovationlatam.com",
        "X-Title": "Innovation Latam Image Reference Search",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`  ⚠️  API error [${response.status}] para "${entity.name}":`, errText.slice(0, 200));
      return {
        entity: entity.name,
        type: entity.type,
        query,
        visual_description: "Não foi possível obter descrição via API.",
        brand_colors: [],
        logo_style: "",
        parody_notes: "",
        image_url: null,
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || "";

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Resposta não tem JSON — salvar o texto como descrição
      console.warn(`  ⚠️  JSON não estruturado para "${entity.name}" — salvando como descrição livre`);
      return {
        entity: entity.name,
        type: entity.type,
        query,
        visual_description: rawContent.slice(0, 600),
        brand_colors: [],
        logo_style: "",
        parody_notes: "",
        image_url: null,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const urlStatus = parsed.image_url ? "🖼️  URL encontrada" : "📝 apenas descrição";
    console.log(`     ${urlStatus}`);
    return parsed;
  } catch (e) {
    console.warn(`  ⚠️  Erro ao processar "${entity.name}": ${e.message}`);
    return {
      entity: entity.name,
      type: entity.type,
      query,
      visual_description: `Erro ao buscar: ${e.message}`,
      brand_colors: [],
      logo_style: "",
      parody_notes: "",
      image_url: null,
      error: e.message,
    };
  }
}

const refs = [];
for (const entity of entities) {
  const ref = await searchEntity(entity);
  if (ref) refs.push(ref);
  // Delay entre chamadas para evitar rate limiting
  if (entities.indexOf(entity) < entities.length - 1) {
    await new Promise((r) => setTimeout(r, 800));
  }
}

const outputData = {
  generated_at: new Date().toISOString(),
  themes: topics.themes || [],
  refs,
};

const outputPath = path.join(outputDir, "image-refs.json");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

// Relatório final
const withUrl = refs.filter((r) => r.image_url).length;
const descOnly = refs.filter((r) => !r.image_url).length;

console.log(`\n✅ image-refs.json salvo: ${outputPath}`);
console.log(`\n📊 Resumo:`);
console.log(`   Total de referências: ${refs.length}`);
console.log(`   🖼️  Com URL de imagem: ${withUrl}`);
console.log(`   📝 Apenas descrição:  ${descOnly}`);

if (refs.length > 0) {
  console.log(`\n🎨 Referências geradas:`);
  refs.forEach((r) => {
    const urlStatus = r.image_url ? "🖼️ " : "📝 ";
    const colors = r.brand_colors?.length ? ` [${r.brand_colors.slice(0, 2).join(", ")}]` : "";
    console.log(`   ${urlStatus} ${r.entity} (${r.type})${colors}`);
    if (r.parody_notes) {
      console.log(`      Paródia: ${r.parody_notes.slice(0, 80)}${r.parody_notes.length > 80 ? "..." : ""}`);
    }
  });
}
