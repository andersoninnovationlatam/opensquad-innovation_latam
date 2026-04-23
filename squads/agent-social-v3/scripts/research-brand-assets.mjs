/**
 * Pesquisa identidades visuais das empresas mencionadas no carousel-draft.md.
 * Gera brand-assets.md via OpenRouter — Leo Logos.
 * Usa OPENROUTER_MODELS_CONTENT do .env.
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/research-brand-assets.mjs <run-id>
 *
 * Input:  output/{run_id}/v1/carousel-draft.md + input/content.md
 * Output: output/{run_id}/v1/brand-assets.md
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
  console.error("Usage: node research-brand-assets.mjs <run-id>");
  process.exit(1);
}

// ── Caminhos ─────────────────────────────────────────────────────────────────
const draftPath   = path.join(SQUAD_ROOT, "output", runId, "v1", "carousel-draft.md");
const inputPath   = path.join(SQUAD_ROOT, "input", "content.md");
const outPath     = path.join(SQUAD_ROOT, "output", runId, "v1", "brand-assets.md");

if (!fs.existsSync(draftPath)) {
  console.error(`❌ carousel-draft.md não encontrado: ${draftPath}`);
  console.error("   Execute generate-content.mjs antes deste script.");
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function callOpenRouter(messages, label) {
  console.log(`\n📡 ${label} via OpenRouter (${MODEL})...`);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://innovationlatam.com",
      "X-Title": "Innovation Latam Brand Assets Researcher",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 4000,
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
const carouselDraft = fs.readFileSync(draftPath, "utf-8");
const originalNews  = fs.existsSync(inputPath) ? fs.readFileSync(inputPath, "utf-8") : "";

const today = new Date().toISOString().slice(0, 10);

console.log(`\n══ research-brand-assets.mjs — run: ${runId} ══`);
console.log(`📋 Modelo: ${MODEL}`);

// ── Prompt ───────────────────────────────────────────────────────────────────
const systemPrompt = `Você é Leo Logos, pesquisador de marcas e ativos visuais da Innovation Latam.

Sua missão: identificar todas as empresas mencionadas no carousel-draft.md e na notícia original, e documentar suas identidades visuais para o Diretor de Arte usar como referência na criação de cenas fotográficas.

IDENTIDADE:
- Você pensa como um brand strategist com olhar de diretor de fotografia
- Não inventa informações — usa seu conhecimento sobre marcas globais e regionais conhecidas
- Quando a confiança for baixa, sinaliza claramente e oferece alternativas
- Descreve cores com hex codes quando conhecidos; usa faixas aproximadas quando incerto
- Escreve prompt elements em inglês, prontos para geração de imagem

REGRAS DE OUTPUT:
- Identificar qual empresa é a PROTAGONISTA (sujeito principal da notícia)
- Bloco completo para a protagonista, blocos resumidos para as demais
- Hex codes reais quando conhecidos; faixa aproximada + nota de incerteza quando não
- Prompt elements em inglês, 1–2 linhas, capturando o visual essence da marca
- NUNCA descrever reprodução literal de logos — apenas ambientes, cores e estilo fotográfico
- Retornar SOMENTE o markdown do brand-assets.md, sem explicações adicionais`;

const userMessage = `NOTÍCIA ORIGINAL:
${originalNews}

CAROUSEL-DRAFT (gerado por Carlos):
${carouselDraft}

DATA: ${today}
RUN: ${runId}

TAREFA:
1. Identifique todas as empresas/marcas/organizações mencionadas nos dois documentos
2. Determine qual é a protagonista (sujeito principal da notícia)
3. Pesquise e documente as identidades visuais usando seu conhecimento de marca

FORMATO EXATO DE SAÍDA:

# Brand Assets — [TÍTULO DO CARROSSEL]
**Gerado por:** Leo Logos
**Data:** ${today}
**Run:** ${runId}

---

## Empresa Protagonista

### [NOME DA EMPRESA]
**Setor:** [setor]
**Confiança:** Alta | Média | Baixa

#### Identidade Visual
| Campo | Detalhes |
|-------|----------|
| Cor primária | \`#XXXXXX\` — [nome da cor] |
| Cor secundária | \`#XXXXXX\` — [nome da cor] |
| Cor de destaque | \`#XXXXXX\` — [nome da cor] |
| Tipografia | [fonte(s) associadas à marca] |
| Elementos icônicos | [formas, símbolos, padrões visuais] |

#### Estilo Visual de Marca
[2–3 frases descrevendo como a marca se apresenta visualmente em inglês]

#### Feeling Fotográfico
[Como a marca usa imagens em campanhas — ambientes, iluminação, pessoas]

#### Ambientes Sugeridos para Daniel
1. **[Ambiente 1]:** [Cenário fotográfico que evoca a marca]
2. **[Ambiente 2]:** [Cenário fotográfico que evoca a marca]
3. **[Ambiente 3]:** [Cenário fotográfico que evoca a marca]

#### Prompt Element (EN)
> [Fragmento 1–2 linhas em inglês pronto para inserir em prompt de geração de imagem]

---

## Empresas Mencionadas

### [NOME DA EMPRESA 2]
**Setor:** [setor] | **Confiança:** [nível]
**Cores:** \`#XXXXXX\` (primária), \`#XXXXXX\` (secundária)
**Prompt element (EN):** [1 linha em inglês]

[Repetir para cada empresa adicional]

---

## Notas para Daniel Diretor

- **Slides prioritários para brand integration:** [quais slides (1, 2, mais temático) e como aplicar]
- **Combinação com paleta IL:** [como as cores da empresa combinam/contrastam com roxo #7B2D8B e teal #00B4D8 da IL]
- **Alerta de rebrand:** [se houver mudança recente conhecida, sinalizar aqui]
- **Alternativa se confiança baixa:** [estilo genérico do setor para usar no lugar]`;

// ── Chamar API ────────────────────────────────────────────────────────────────
const assetsRaw = await callOpenRouter(
  [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
  "Pesquisando brand assets"
);

// Limpar possível bloco de código markdown
const assetsClean = assetsRaw
  .replace(/^```markdown\n?/i, "")
  .replace(/\n?```$/i, "")
  .trim();

fs.writeFileSync(outPath, assetsClean, "utf-8");
console.log(`✅ brand-assets.md salvo: ${outPath}`);
console.log(`\n✅ Pesquisa de marcas concluída para run: ${runId}`);
