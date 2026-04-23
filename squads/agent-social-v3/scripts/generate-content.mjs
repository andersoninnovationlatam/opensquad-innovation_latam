/**
 * Gera angles.yaml + carousel-draft.md para um run via OpenRouter.
 * Usa OPENROUTER_MODELS_CONTENT do .env (ex: openai/gpt-4o-mini).
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/generate-content.mjs <run-id>
 *
 * Requer OPENROUTER_API_KEY e OPENROUTER_MODELS_CONTENT no .env.
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
  console.error("Usage: node generate-content.mjs <run-id>");
  process.exit(1);
}

// ── Caminhos ─────────────────────────────────────────────────────────────────
const inputPath = path.join(SQUAD_ROOT, "input", "content.md");
const outDir = path.join(SQUAD_ROOT, "output", runId, "v1");
const anglesPath = path.join(outDir, "angles.yaml");
const draftPath = path.join(outDir, "carousel-draft.md");

if (!fs.existsSync(inputPath)) {
  console.error(`❌ input/content.md não encontrado: ${inputPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
function readData(filename) {
  const p = path.join(SQUAD_ROOT, "pipeline", "data", filename);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: md };
  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    frontmatter[key] = value;
  }
  return { frontmatter, body: md.slice(match[0].length).trim() };
}

async function callOpenRouter(messages, label) {
  console.log(`\n📡 ${label} via OpenRouter (${MODEL})...`);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://innovationlatam.com",
      "X-Title": "Innovation Latam Content Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 4000,
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
const inputRaw = fs.readFileSync(inputPath, "utf-8");
const { frontmatter, body: inputBody } = parseFrontmatter(inputRaw);
const anguloEscolhido = frontmatter["angulo_escolhido"] || "";

if (!anguloEscolhido) {
  console.error("❌ Campo 'angulo_escolhido' ausente no frontmatter de input/content.md");
  console.error("   Adicione: angulo_escolhido: medo|oportunidade|educacional|contrario|inspiracional");
  process.exit(1);
}

const domainFramework = readData("domain-framework.md");
const toneOfVoice = readData("tone-of-voice.md");
const antiPatterns = readData("anti-patterns.md");

const today = new Date().toISOString().slice(0, 10);

console.log(`\n══ generate-content.mjs — run: ${runId} ══`);
console.log(`📋 Modelo: ${MODEL}`);
console.log(`📐 Ângulo escolhido: ${anguloEscolhido}`);

// ── CHAMADA 1: Gerar angles.yaml ──────────────────────────────────────────────
const systemPromptAngles = `Você é Carlos Conteúdo, estrategista de copy e carrossel da Innovation Latam.
Sua tarefa: receber uma notícia/texto e gerar um arquivo YAML com 5 ângulos editoriais virais.

IDENTIDADE:
- Analítico e emocionalmente inteligente
- Pensa como jornalista de negócios com psicologia do comportamento
- NÃO substitui o ângulo escolhido pelo usuário — documenta os 5 mas marca SOMENTE o ângulo indicado
- Todo texto em português do Brasil, gramática e ortografia corretas
- Maiúscula no início de cada frase, hook_preview e justificativa

CONTEXTO DO DOMÍNIO:
${domainFramework}

TOM DE VOZ:
${toneOfVoice}

ANTI-PATTERNS (nunca fazer):
${antiPatterns}

REGRAS DO OUTPUT:
- Retorne SOMENTE o YAML válido, sem blocos de código markdown, sem explicações fora do YAML
- O campo angulo_escolhido_pelo_usuario deve ser exatamente o ID recebido no input
- Apenas O ângulo cujo id = angulo_escolhido_pelo_usuario deve ter selected: true
- Todos os hook_preview começam com o dado-âncora ou derivado direto
- gerado_em: ${today}`;

const userMessageAngles = `INPUT DO USUÁRIO:
angulo_escolhido: ${anguloEscolhido}

CONTEÚDO/NOTÍCIA:
${inputBody}

TAREFA:
1. Extraia o dado-âncora (número, afirmação central ou gancho factual mais forte)
2. Identifique a tensão central do conteúdo
3. Gere os 5 ângulos (medo, oportunidade, educacional, contrario, inspiracional) com scores de 1-5 em: força com âncora, relevância para profissionais de inovação, potencial de engajamento
4. Marque selected: true SOMENTE no ângulo cujo id = "${anguloEscolhido}"
5. Escreva hook_preview de 1-2 linhas para cada ângulo (começa com dado-âncora)
6. Justificativa no ângulo selecionado: por que esse ângulo + encaixe com a notícia (2-3 linhas)

FORMATO EXATO DE SAÍDA (YAML puro, sem markdown):
# angles.yaml
tema: ""
dado_ancora: ""
fonte_ancora: ""
angulo_escolhido_pelo_usuario: ""
gerado_em: "${today}"

angulos:
  - id: medo
    label: "Medo / Urgência"
    emotional_lens: ""
    hook_preview: ""
    score_ancora: 0
    score_relevancia: 0
    score_engajamento: 0
    selected: false
    justification: ""

  - id: oportunidade
    label: "Oportunidade / FOMO"
    emotional_lens: ""
    hook_preview: ""
    score_ancora: 0
    score_relevancia: 0
    score_engajamento: 0
    selected: false
    justification: ""

  - id: educacional
    label: "Educacional / Didático"
    emotional_lens: ""
    hook_preview: ""
    score_ancora: 0
    score_relevancia: 0
    score_engajamento: 0
    selected: false
    justification: ""

  - id: contrario
    label: "Contrário / Revelador"
    emotional_lens: ""
    hook_preview: ""
    score_ancora: 0
    score_relevancia: 0
    score_engajamento: 0
    selected: false
    justification: ""

  - id: inspiracional
    label: "Inspiracional / Transformador"
    emotional_lens: ""
    hook_preview: ""
    score_ancora: 0
    score_relevancia: 0
    score_engajamento: 0
    selected: false
    justification: ""

angulo_selecionado: ${anguloEscolhido}
proximo_passo: ""`;

const anglesYaml = await callOpenRouter(
  [
    { role: "system", content: systemPromptAngles },
    { role: "user", content: userMessageAngles },
  ],
  "Gerando angles.yaml"
);

// Limpar possível bloco de código markdown
const anglesClean = anglesYaml
  .replace(/^```ya?ml\n?/i, "")
  .replace(/\n?```$/i, "")
  .trim();

fs.writeFileSync(anglesPath, anglesClean, "utf-8");
console.log(`✅ angles.yaml salvo: ${anglesPath}`);

// ── CHAMADA 2: Gerar carousel-draft.md ───────────────────────────────────────
const realImagery = readData("real-imagery-and-safe-zones.md");
const layoutVariations = readData("layout-variations.md");

const systemPromptDraft = `Você é Carlos Conteúdo, estrategista de copy e carrossel da Innovation Latam.
Sua tarefa: com o ângulo selecionado e o angles.yaml gerado, criar o carousel-draft.md completo (6 slides + caption).

IDENTIDADE:
- Todo copy em português do Brasil com gramática e ortografia corretas
- Maiúscula no início de cada headline, body, caption e frase após ponto final
- Telegráfico nos slides: frases curtas, poucas linhas (meta ≤3 linhas no corpo)
- Didático-revelador, nunca corporativo-formal
- NUNCA usar travessão (—): substituir por ponto final ou vírgula

CONTEXTO DO DOMÍNIO:
${domainFramework}

TOM DE VOZ:
${toneOfVoice}

ANTI-PATTERNS (nunca fazer):
${antiPatterns}

NORMA DE IMAGENS E SAFE ZONES:
${realImagery}

VARIAÇÕES DE LAYOUT:
${layoutVariations}

ESTRUTURA FIXA — EXATAMENTE 6 SLIDES:
Slide 1 (hook) → Slide 2 (contexto) → Slides 3-4 (desenvolvimento) → Slide 5 (reflexão) → Slide 6 (CTA)

REGRAS:
- Slide 1: abre com dado-âncora direto, máx 2 linhas, nunca começa com marca ou apresentação
- Slide 2: 2-3 frases curtas (~25-45 palavras no total), imagem full-bleed
- Slides 3-4: 1 ideia/slide, máx 2 frases curtas no body, ≤3 linhas visíveis
- Slide 5: reflexão emocional SEM dado novo, pergunta ou afirmação que toca na realidade do profissional
- Slide 6: CTA com 2 ações específicas ao tema (salvar + comentar)
- Caption: hook nos primeiros 125 chars + 3-5 parágrafos + pergunta final + 8-12 hashtags (máx 2.200 chars)
- Visual cue em cada slide conforme real-imagery-and-safe-zones.md e layout-variations.md
- Retorne SOMENTE o markdown do carousel-draft, sem explicações adicionais`;

const userMessageDraft = `ÂNGULO SELECIONADO: ${anguloEscolhido}

ANGLES.YAML GERADO:
${anglesClean}

CONTEÚDO ORIGINAL:
${inputBody}

TAREFA:
Crie o carousel-draft.md completo seguindo exatamente o formato abaixo.
Use o hook_preview do ângulo selecionado como ponto de partida para o slide 1.

FORMATO EXATO DE SAÍDA:
# Carrossel: [TÍTULO DESCRITIVO]
**Ângulo:** [ângulo selecionado — label]
**Dado-âncora:** [dado âncora e fonte]
**Total de slides:** 6

---

## Brief de layout (esta run)
- **Imagens temáticas:** [tema/marca]; [metáfora / estética].
- **Safe zone:** nenhum texto editorial em y ≥ 1150px (canvas 1080×1350); rodapé acima da faixa.
- **Slide 1:** headline só entre 60%–80% altura, alinhada à esquerda no bloco; padding 100px lateral.
- **Todos os slides:** texto editorial alinhado à esquerda; padding 100px esquerda/direita.

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** [texto — máx 2 linhas]
**Visual cue:** Cover Layout. Fundo full-bleed: [cena/metáfora]. Headline na banda 60%–80%, alinhada à esquerda; padding 100px. Destaque numérico gold #e8c85c.

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** [texto — 1 linha]
**Body:** [2 ou 3 frases curtas — ~25–45 palavras no total]
**Visual cue:** Image Context Layout. Full-bleed: [cenário concreto]. Overlay rgba(21,10,28,0.85).

---

## Slide 3 — [NOME] (Standard ou Split Content Layout)
**Headline:** [texto]
**Body:** [texto — frases curtas, ≤3 linhas]
**Visual cue:** [Standard ou Split v3 — texto à esquerda; padding 100px; safe zone y ≥ 1150px]

---

## Slide 4 — [NOME] (Standard ou Split Content Layout)
**Headline:** [texto]
**Body:** [texto — frases curtas, ≤3 linhas]
**Visual cue:** [Standard ou Split v3 — texto à esquerda; padding 100px]

---

## Slide 5 — REFLEXÃO (Reflection Layout)
**Headline:** [pergunta ou afirmação reflexiva]
**Body:** [complemento opcional]
**Visual cue:** Reflection Layout — texto à esquerda, padding 100px, rodapé @ + ARRASTE ->

---

## Slide 6 — CTA (CTA Layout)
**Headline:** [headline do CTA]
**Body:** [contexto]
**Ação 1 (Salvar):** [instrução de save específica ao tema]
**Ação 2 (Comentar):** [pergunta específica ao tema]
**Visual cue:** CTA Layout — botão teal #50beba, rodapé @ + ARRASTE ->

---

## Caption Instagram

[Hook — primeiras 125 chars incluem o gancho principal]

[Body — 3-5 parágrafos concisos]

[Pergunta final de engajamento]

📌 [CTA de salvar na caption]

#[8-12 hashtags relevantes]`;

const carouselDraft = await callOpenRouter(
  [
    { role: "system", content: systemPromptDraft },
    { role: "user", content: userMessageDraft },
  ],
  "Gerando carousel-draft.md"
);

// Limpar possível bloco de código markdown
const draftClean = carouselDraft
  .replace(/^```markdown\n?/i, "")
  .replace(/\n?```$/i, "")
  .trim();

fs.writeFileSync(draftPath, draftClean, "utf-8");
console.log(`✅ carousel-draft.md salvo: ${draftPath}`);

console.log(`\n✅ Conteúdo gerado com sucesso para run: ${runId}`);
console.log(`   → ${anglesPath}`);
console.log(`   → ${draftPath}`);
