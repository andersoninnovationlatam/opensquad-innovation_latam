/**
 * Extrai os prompts de imagem do slide-scenes.md e gera bg-prompts.json
 * para uso pelo generate-bg-image.mjs (que já suporta este arquivo como override).
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/extract-bg-prompts.mjs <run-id>
 *
 * Input:  squads/agent-social-v3/output/<run-id>/v1/slide-scenes.md
 * Output: squads/agent-social-v3/output/<run-id>/bg-prompts.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQUAD_ROOT = path.resolve(__dirname, "..");

const runId = process.argv[2];
if (!runId) {
  console.error("Usage: node extract-bg-prompts.mjs <run-id>");
  process.exit(1);
}

const scenesPath = path.join(SQUAD_ROOT, "output", runId, "v1", "slide-scenes.md");
if (!fs.existsSync(scenesPath)) {
  console.error(`❌ slide-scenes.md não encontrado: ${scenesPath}`);
  console.error("   Execute o step-03 (Daniel Diretor) antes deste script.");
  process.exit(1);
}

console.log(`\n══ extract-bg-prompts.mjs — run: ${runId} ══`);
console.log(`📄 Lendo: ${scenesPath}`);

const content = fs.readFileSync(scenesPath, "utf-8");

// Dividir o conteúdo por seções de slide ("## Slide NN")
const slideSections = content.split(/(?=^## Slide \d)/m).filter((s) => s.trim());

const prompts = {};

for (const section of slideSections) {
  // Extrair número do slide
  const slideMatch = section.match(/^## Slide (\d{1,2})/m);
  if (!slideMatch) continue;

  const slideNum = slideMatch[1].padStart(2, "0");

  // Localizar bloco "### Prompt mestre (EN)" e extrair até a próxima seção ###/##
  const promptBlockMatch = section.match(
    /###\s*Prompt mestre\s*\(EN\)\s*\n([\s\S]*?)(?=\n###|\n##|$)/i
  );
  if (!promptBlockMatch) {
    console.warn(`⚠️  Slide ${slideNum}: sem "Prompt mestre (EN)" — usando default do generate-bg-image`);
    continue;
  }

  const block = promptBlockMatch[1];

  // Extrair linhas de blockquote (> texto)
  const blockquoteLines = block
    .split("\n")
    .filter((l) => l.trim().startsWith(">"))
    .map((l) => l.replace(/^>\s?/, "").trim())
    .filter((l) => l.length > 0);

  if (blockquoteLines.length > 0) {
    prompts[slideNum] = blockquoteLines.join(" ");
    console.log(`✅ Slide ${slideNum}: prompt extraído (${blockquoteLines.join(" ").length} chars)`);
  } else {
    // Tentar extrair parágrafo simples (sem blockquote) após o header
    const plainLines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("-"));

    if (plainLines.length > 0) {
      prompts[slideNum] = plainLines.join(" ");
      console.log(`✅ Slide ${slideNum}: prompt extraído (parágrafo, ${prompts[slideNum].length} chars)`);
    } else {
      console.warn(`⚠️  Slide ${slideNum}: prompt vazio no bloco — usando default`);
    }
  }
}

if (Object.keys(prompts).length === 0) {
  console.error("\n❌ Nenhum prompt extraído do slide-scenes.md.");
  console.error("   Verifique se Daniel Diretor gerou os prompts no formato:");
  console.error("   ### Prompt mestre (EN)");
  console.error("   > [texto do prompt em inglês]");
  process.exit(1);
}

const outPath = path.join(SQUAD_ROOT, "output", runId, "bg-prompts.json");
fs.writeFileSync(outPath, JSON.stringify(prompts, null, 2), "utf-8");

console.log(`\n✅ bg-prompts.json salvo: ${outPath}`);
console.log(`   Slides com prompts personalizados: ${Object.keys(prompts).sort().join(", ")}`);
console.log("\n📋 Preview dos prompts:");
for (const [num, prompt] of Object.entries(prompts).sort()) {
  const preview = prompt.length > 100 ? prompt.slice(0, 100) + "…" : prompt;
  console.log(`   [${num}] ${preview}`);
}
