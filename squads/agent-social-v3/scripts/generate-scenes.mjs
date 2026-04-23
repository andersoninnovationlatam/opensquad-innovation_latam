/**
 * Gera slide-scenes.md (direção de arte) via OpenRouter — Daniel Diretor.
 * Usa OPENROUTER_MODELS_CONTENT do .env.
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/generate-scenes.mjs <run-id>
 *
 * Input:  output/{run_id}/v1/carousel-draft.md
 * Output: output/{run_id}/v1/slide-scenes.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const SQUAD_ROOT = path.resolve(__dirname, "..");

// ── Env ──────────────────────────────────────────────────────────────────────
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

const MODEL = envVars["OPENROUTER_MODELS_CONTENT"] || "openai/gpt-4o-mini";
if (!envVars["OPENROUTER_MODELS_CONTENT"])
  console.warn("⚠️  OPENROUTER_MODELS_CONTENT não definida no .env, usando default");

// ── Args ─────────────────────────────────────────────────────────────────────
const runId = process.argv[2];
if (!runId) {
  console.error("Usage: node generate-scenes.mjs <run-id>");
  process.exit(1);
}

// ── Caminhos ─────────────────────────────────────────────────────────────────
const draftPath      = path.join(SQUAD_ROOT, "output", runId, "v1", "carousel-draft.md");
const brandAssetsPath = path.join(SQUAD_ROOT, "output", runId, "v1", "brand-assets.md");
const outPath        = path.join(SQUAD_ROOT, "output", runId, "v1", "slide-scenes.md");

if (!fs.existsSync(draftPath)) {
  console.error(`❌ carousel-draft.md não encontrado: ${draftPath}`);
  console.error("   Execute generate-content.mjs antes deste script.");
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function readData(filename) {
  const p = path.join(SQUAD_ROOT, "pipeline", "data", filename);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

async function callOpenRouter(messages, label) {
  console.log(`\n📡 ${label} via OpenRouter (${MODEL})...`);
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
      messages,
      max_tokens: 6000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`❌ Erro na API [${label}]:`, response.status, err);
    process.exit(1);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error(`❌ Resposta vazia da API [${label}]`);
    process.exit(1);
  }
  return content;
}

// ── Carregar contexto ─────────────────────────────────────────────────────────
const carouselDraft = fs.readFileSync(draftPath, "utf-8");
const artGuide      = readData("art-direction-photography-guide.md");
const realImagery   = readData("real-imagery-and-safe-zones.md");
const brandAssets   = fs.existsSync(brandAssetsPath)
  ? fs.readFileSync(brandAssetsPath, "utf-8")
  : "";

if (!brandAssets) {
  console.warn("⚠️  brand-assets.md não encontrado — Daniel trabalhará sem referências de marca. Execute research-brand-assets.mjs antes.");
}

const today = new Date().toISOString().slice(0, 10);

console.log(`\n══ generate-scenes.mjs — run: ${runId} ══`);
console.log(`📋 Modelo: ${MODEL}`);

// ── Prompt ───────────────────────────────────────────────────────────────────
const systemPrompt = `Você é Daniel Diretor, diretor de arte e fotografia da Innovation Latam.
Sua tarefa: receber o carousel-draft.md (copy + visual cues por slide) e criar o slide-scenes.md com a direção de arte completa para cada slide.

IDENTIDADE:
- Pensa em cenas cinematográficas e fotografia editorial de alta qualidade
- Interpreta o texto narrativamente, não apenas repete palavras-chave
- Conhece o vocabulário técnico de fotografia: ângulos, planos, iluminação, color grading
- Detecta a empresa protagonista do carrossel e incorpora brand elements visuais nos prompts
- Escreve prompts mestres em inglês (prontos para geração de imagem IA)
- Suas notas para Dária são claras e acionáveis para implementação HTML

GUIA DE DIREÇÃO DE ARTE:
${artGuide}

NORMA DE IMAGENS E SAFE ZONES:
${realImagery}

${brandAssets ? `BRAND ASSETS — REFERÊNCIAS VISUAIS DAS MARCAS (gerado por Leo Logos):
${brandAssets}` : ""}

REGRAS DE OUTPUT:
- Um bloco "## Slide NN" para cada slide do draft
- Prompt mestre em inglês, estilo cinematográfico, pronto para IA de imagem
- Notas para Dária: tipo de fundo (full-bleed fotográfico / gradiente), overlay, temperatura de cor
- Não duplicar o copy do Carlos no lugar da cena — "Mensagem (síntese)" máx 1–2 frases
- Variedade de ângulos e composições ao longo dos slides
- Retornar SOMENTE o markdown do slide-scenes.md, sem explicações adicionais`;

const userMessage = `CAROUSEL-DRAFT:
${carouselDraft}

DATA: ${today}

TAREFA:
Crie o slide-scenes.md completo com direção de arte para cada slide.
${brandAssets
  ? "Use os BRAND ASSETS fornecidos acima (gerados por Leo Logos) como referência principal para incorporar os elementos visuais da empresa protagonista nos prompts. As cores, ambientes sugeridos e prompt elements do brand-assets.md devem orientar diretamente suas escolhas fotográficas nos slides prioritários (1, 2 e o mais temático)."
  : "Detecte a empresa/produto protagonista e incorpore brand elements nos prompts dos slides prioritários (1, 2 e o mais temático)."
}

FORMATO EXATO DE SAÍDA:
# Direção de arte — [TÍTULO DO CARROSSEL]
**Carrossel:** [mesmo título do carousel-draft]
**Gerado por:** Daniel Diretor
**Data:** ${today}
**Empresa detectada:** [nome ou "nenhuma"]
**Brand elements aplicados:** [lista ou "nenhum"]

---

## Slide 01 — [PAPEL: ex. HOOK / Cover]
### Mensagem (síntese)
[1–2 frases do que o slide comunica]

### Interpretação narrativa
[Tom emocional + metáfora espacial]

### Parâmetros técnicos
| Campo | Escolha |
|-------|---------|
| Camera angle | [ex.: Eye Level] |
| Shot size | [ex.: Medium Wide Shot] |
| Lens reference | [ex.: 35mm] |
| Lighting | [ex.: soft directional, low-key] |
| Color mood | [ex.: deep purple and teal] |

### Prompt mestre (EN)
> [Parágrafo único em inglês — cinematic editorial photography, …, --no cartoon, illustration, 3d render, text, watermark]

### Notas para Dária (implementação HTML)
- Fundo: [full-bleed fotográfico / gradiente + formas]
- Overlay: [rgba(21,10,28,0.85) ou variação]
- Temperatura de cor: [fria/quente/neutra — alinhada à paleta roxo/teal]
- Evitar: texto na imagem; safe zone y ≥ 1150px para texto editorial

---

[Repetir para todos os slides do draft]

---

## Checklist
- [ ] Número de slides = número de secções "## Slide NN"
- [ ] Cada slide tem prompt EN + notas Dária
- [ ] Variedade de ângulos/planos ao longo do carrossel`;

// ── Chamar API ────────────────────────────────────────────────────────────────
const scenesRaw = await callOpenRouter(
  [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
  "Gerando slide-scenes.md"
);

// Limpar possível bloco de código markdown
const scenesClean = scenesRaw
  .replace(/^```markdown\n?/i, "")
  .replace(/\n?```$/i, "")
  .trim();

fs.writeFileSync(outPath, scenesClean, "utf-8");
console.log(`✅ slide-scenes.md salvo: ${outPath}`);
console.log(`\n✅ Direção de arte gerada para run: ${runId}`);
