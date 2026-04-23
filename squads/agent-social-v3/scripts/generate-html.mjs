/**
 * Gera os 6 slides HTML + design-documentation.md via OpenRouter — Daria Design.
 * Usa OPENROUTER_MODELS_CONTENT do .env.
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/generate-html.mjs <run-id>
 *
 * Input:  output/{run_id}/v1/carousel-draft.md
 *         output/{run_id}/v1/slide-scenes.md
 * Output: output/{run_id}/slides/v1/slide-01.html … slide-06.html
 *         output/{run_id}/slides/v1/design-documentation.md
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
  console.error("Usage: node generate-html.mjs <run-id>");
  process.exit(1);
}

// ── Caminhos ─────────────────────────────────────────────────────────────────
const draftPath  = path.join(SQUAD_ROOT, "output", runId, "v1", "carousel-draft.md");
const scenesPath = path.join(SQUAD_ROOT, "output", runId, "v1", "slide-scenes.md");
const slidesDir  = path.join(SQUAD_ROOT, "output", runId, "slides", "v1");
const logoPath   = path.join(SQUAD_ROOT, "assets", "innovation-latam-logo-white.png");

for (const [label, p] of [["carousel-draft.md", draftPath], ["slide-scenes.md", scenesPath]]) {
  if (!fs.existsSync(p)) {
    console.error(`❌ ${label} não encontrado: ${p}`);
    console.error("   Execute os steps anteriores antes deste script.");
    process.exit(1);
  }
}

fs.mkdirSync(slidesDir, { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
function readData(filename) {
  const p = path.join(SQUAD_ROOT, "pipeline", "data", filename);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

function getLogoBase64() {
  if (!fs.existsSync(logoPath)) {
    console.warn("⚠️  Logo não encontrada:", logoPath);
    return "";
  }
  return fs.readFileSync(logoPath).toString("base64");
}

/** Extrai o bloco de um slide pelo número (1-6) do carousel-draft.md.
 *  Suporta dois formatos:
 *    1. Bold markdown: **Slide N: ...**  (formato gerado por generate-content.mjs)
 *    2. Heading markdown: ## Slide N    (formato legado)
 */
function extractSlideBlock(draft, slideNum) {
  // Formato 1 — bold: **Slide N: ...
  const boldRegex = new RegExp(
    `\\*\\*Slide ${slideNum}:[\\s\\S]*?(?=\\n\\*\\*Slide \\d|$)`,
    "i"
  );
  const boldMatch = draft.match(boldRegex);
  if (boldMatch) return boldMatch[0].trim();

  // Formato 2 — heading: ## Slide N
  const headingRegex = new RegExp(
    `## Slide ${slideNum}[\\s\\S]*?(?=\\n## Slide \\d|\\n## Caption|$)`,
    "i"
  );
  const headingMatch = draft.match(headingRegex);
  if (headingMatch) return headingMatch[0].trim();

  return `**Slide ${slideNum}:** [bloco não encontrado no carousel-draft.md]`;
}

/** Extrai o bloco de cenas de um slide pelo número (01-06) do slide-scenes.md */
function extractSceneBlock(scenes, slideNum) {
  const paddedNum = String(slideNum).padStart(2, "0");
  const regex = new RegExp(
    `## Slide ${paddedNum}[\\s\\S]*?(?=\\n## Slide \\d{2}|\\n## Checklist|$)`,
    "i"
  );
  const match = scenes.match(regex);
  if (match) return match[0].trim();
  // Fallback: tenta sem zero à esquerda
  const regex2 = new RegExp(
    `## Slide 0?${slideNum}[\\s\\S]*?(?=\\n## Slide|\\n## Checklist|$)`,
    "i"
  );
  const match2 = scenes.match(regex2);
  return match2 ? match2[0].trim() : `## Slide ${paddedNum}\n[bloco de cenas não encontrado]`;
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
      max_tokens: 8000,
      temperature: 0.4,
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
const carouselDraft  = fs.readFileSync(draftPath, "utf-8");
const slideScenes    = fs.readFileSync(scenesPath, "utf-8");
const visualIdentity = readData("visual-identity.md");
const layoutVariations = readData("layout-variations.md");
const realImagery    = readData("real-imagery-and-safe-zones.md");
const antiPatterns   = readData("anti-patterns.md");
const logoBase64     = getLogoBase64();

const today = new Date().toISOString().slice(0, 10);

console.log(`\n══ generate-html.mjs — run: ${runId} ══`);
console.log(`📋 Modelo: ${MODEL}`);
console.log(`🖼  Logo base64: ${logoBase64 ? `${(logoBase64.length / 1024).toFixed(1)}KB` : "ausente"}`);

// ── System prompt (Daria Design — compartilhado por todos os slides) ──────────
const systemPrompt = `Você é Daria Design, designer de carrosséis Instagram da Innovation Latam.
Sua tarefa: receber o copy exato de um slide + a direção de arte (slide-scenes.md) e gerar o HTML auto-suficiente do slide.

IDENTIDADE:
- Implementa design pixel-perfect em 1080×1350px para Instagram (4:5)
- Usa EXCLUSIVAMENTE a fonte Montserrat via @import do Google Fonts
- Todo texto editorial alinhado à ESQUERDA com padding 100px
- Logo Innovation Latam: usar EXATAMENTE a tag <img src="__LOGO_BASE64__" ...> (placeholder — será substituído em pós-processamento)
- Logo: position:absolute; top:30px; left:100px; max-width:200px; z-index:10
- Rodapé obrigatório em todos os slides: "@innovationlatam   ARRASTE ->" em y ≥ 1155px (safe zone: sem texto editorial em y ≥ 1150px)
- Canvas body: width:1080px; height:1350px; overflow:hidden
- WCAG AA: contraste mínimo 4.5:1 para todo texto

IDENTIDADE VISUAL:
${visualIdentity}

VARIAÇÕES DE LAYOUT:
${layoutVariations}

NORMA DE IMAGENS E SAFE ZONES:
${realImagery}

ANTI-PATTERNS (nunca fazer):
${antiPatterns}

REGRAS CRÍTICAS DO HTML:
1. Retornar SOMENTE o HTML puro, sem blocos de código markdown, sem explicações
2. O HTML deve ser auto-suficiente: @import Montserrat, sem JS, sem CDN além de Google Fonts
3. Logo: <img src="__LOGO_BASE64__" style="position:absolute;top:30px;left:100px;max-width:200px;z-index:10;" alt="Innovation Latam">
   IMPORTANTE: use literalmente "__LOGO_BASE64__" como src — NÃO coloque base64 real aqui
4. Fundo: deixar background-color: #150a1c (roxo escuro) — o inject-bg-and-render.mjs injetará a imagem fotográfica depois
5. Adicionar comentário <!-- DRAFT SLIDE NN: [copy verbatim] --> antes do bloco de conteúdo
6. Nunca usar travessão (—): substituir por ponto final ou vírgula
7. Não repetir texto de outro slide no HTML`;

// ── Gerar HTML por slide ──────────────────────────────────────────────────────
const slideLayouts = [
  "Cover Layout",
  "Image Context Layout",
  "Standard Content Layout",
  "Standard ou Split Content Layout",
  "Reflection Layout",
  "CTA Layout",
];

const generatedSlides = [];

for (let i = 1; i <= 6; i++) {
  const paddedNum = String(i).padStart(2, "0");
  const slideBlock = extractSlideBlock(carouselDraft, i);
  const sceneBlock = extractSceneBlock(slideScenes, i);
  const layoutHint = slideLayouts[i - 1] || "Standard Content Layout";

  const userMessage = `SLIDE ${paddedNum} — ${layoutHint}

COPY DO SLIDE (do carousel-draft.md):
${slideBlock}

DIREÇÃO DE ARTE (do slide-scenes.md):
${sceneBlock}

TAREFA:
Gere o HTML completo do slide-${paddedNum}.html seguindo:
- Layout: ${layoutHint}
- Canvas: 1080×1350px, body overflow:hidden
- Background: #150a1c (roxo escuro — imagem fotográfica será injetada depois)
- Logo: <img src="__LOGO_BASE64__" style="position:absolute;top:30px;left:100px;max-width:200px;z-index:10;" alt="Innovation Latam">
  (use literalmente "__LOGO_BASE64__" como src — NÃO gere base64 real)
- Texto editorial: alinhado à esquerda, padding 100px esquerda/direita
- Safe zone: NENHUM texto editorial em y ≥ 1150px
- Rodapé: "@innovationlatam   ARRASTE ->" posicionado em top:~1165px (bottom:~185px)
- Use SOMENTE o texto do bloco "COPY DO SLIDE" acima — nenhuma palavra de outro slide
- Adicione comentário <!-- DRAFT SLIDE ${paddedNum}: [copy verbatim] --> antes do conteúdo

Retorne SOMENTE o HTML puro (<!DOCTYPE html>…</html>), sem markdown.`;

  const htmlRaw = await callOpenRouter(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    `Gerando slide-${paddedNum}.html`
  );

  // Limpar possível bloco de código markdown
  let htmlClean = htmlRaw
    .replace(/^```html\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  // Substituir placeholder da logo pelo base64 real
  if (logoBase64) {
    htmlClean = htmlClean.replace(
      /__LOGO_BASE64__/g,
      `data:image/png;base64,${logoBase64}`
    );
  }

  const outFile = path.join(slidesDir, `slide-${paddedNum}.html`);
  fs.writeFileSync(outFile, htmlClean, "utf-8");
  console.log(`✅ slide-${paddedNum}.html salvo`);
  generatedSlides.push(`slide-${paddedNum}.html`);
}

// ── Gerar design-documentation.md ────────────────────────────────────────────
console.log(`\n📡 Gerando design-documentation.md...`);

// Extrair título do draft
const titleMatch = carouselDraft.match(/^#\s+Carrossel:\s*(.+)/m);
const carouselTitle = titleMatch ? titleMatch[1].trim() : runId;

const docsContent = `# Design Documentation
**Carrossel:** ${carouselTitle}
**Run:** ${runId}
**Data:** ${today}
**Gerado por:** Daria Design (generate-html.mjs via OpenRouter)
**Modelo:** ${MODEL}

## Norma aplicada
- real-imagery-and-safe-zones.md (v3) + layout-variations.md
- Canvas: 1080×1350px | Fonte: Montserrat | Safe zone: y ≥ 1150px

## Tokens
- Fonte: Montserrat (weights 400, 500, 600, 700, 800, 900)
- Background base: #150a1c (fundos fotográficos injetados por inject-bg-and-render.mjs)
- Roxo escuro: #150a1c | Teal: #50beba | Gold: #e8c85c

## Sequência de layouts
| Slide | Variação | Status |
|-------|----------|--------|
| 01 | Cover Layout | ✓ gerado |
| 02 | Image Context Layout | ✓ gerado |
| 03 | Standard Content Layout | ✓ gerado |
| 04 | Standard / Split Content Layout | ✓ gerado |
| 05 | Reflection Layout | ✓ gerado |
| 06 | CTA Layout | ✓ gerado |

## Arquivos gerados
${generatedSlides.map((f) => `- ${f}`).join("\n")}

## Próximos passos
1. Executar \`node squads/agent-social-v3/scripts/run-squad-design.mjs ${runId}\`
   (gera fundos fotográficos via OPENROUTER_MODELS_IMAGE + injeta + renderiza JPEGs)
2. Verificar \`output/${runId}/slides/v1/rendered/\` (6 × slide-NN.jpg, 1080×1350px)

## Checklist
- [ ] Logo top:30px left:100px em todos os slides
- [ ] Texto editorial à esquerda em todos os slides
- [ ] Rodapé @innovationlatam + ARRASTE -> em todos os slides
- [ ] Safe zone y ≥ 1150px respeitada
- [ ] Fundos fotográficos injetados (pending run-squad-design.mjs)
- [ ] 6 × JPEG 1080×1350px em rendered/ (pending)
`;

const docsPath = path.join(slidesDir, "design-documentation.md");
fs.writeFileSync(docsPath, docsContent, "utf-8");
console.log(`✅ design-documentation.md salvo`);

console.log(`\n✅ HTML de ${generatedSlides.length} slides gerado para run: ${runId}`);
console.log(`   → ${slidesDir}`);
console.log(`\n📌 Próximo passo:`);
console.log(`   node squads/agent-social-v3/scripts/run-squad-design.mjs ${runId}`);
