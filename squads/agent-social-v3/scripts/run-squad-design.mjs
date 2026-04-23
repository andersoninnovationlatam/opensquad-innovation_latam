/**
 * Orquestra o pipeline de design para um run: HTML (gen-slides) → 6× fundo IA → 6× inject + JPEG em rendered/.
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/run-squad-design.mjs <run-id>
 *
 * Requer OPENROUTER_API_KEY no .env (raiz do repo).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const runId = process.argv[2];
if (!runId) {
  console.error("Usage: node run-squad-design.mjs <run-id>");
  process.exit(1);
}

const envPath = path.join(REPO_ROOT, ".env");
if (!fs.existsSync(envPath)) {
  console.error(`❌ Arquivo .env não encontrado em ${envPath}`);
  process.exit(1);
}

const slidesDir = path.join(REPO_ROOT, "squads/agent-social-v3/output", runId, "slides");

function runNode(scriptRel, args) {
  const scriptPath = path.join(REPO_ROOT, scriptRel);
  const r = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: REPO_ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log(`\n══ Run design (v3): ${runId} ══\n`);
console.log("1/3 gen-slides-for-run.mjs …");
runNode("squads/agent-social-v3/scripts/gen-slides-for-run.mjs", [runId]);

const slides = ["01", "02", "03", "04", "05", "06"];
for (const n of slides) {
  console.log(`\n── Slide ${n}: generate-bg-image ──`);
  runNode("squads/agent-social-v3/scripts/generate-bg-image.mjs", [n, slidesDir]);
  console.log(`── Slide ${n}: inject-bg-and-render ──`);
  runNode("squads/agent-social-v3/scripts/inject-bg-and-render.mjs", [n, slidesDir]);
}

console.log(`\n✅ Concluído. Saída: ${slidesDir}/v1/rendered/ (slide-NN.jpg)\n`);
