/**
 * Gera slide-01..06.html (pré-injeção) em output/{runId}/slides/v1/.
 * Usa .bg-synth (oculto após inject-bg-and-render). Slide 1: hook à esquerda na banda.
 * Slides 2–6: texto à esquerda. Rodapé: @innovationlatam + ARRASTE -> em todos os slides.
 *
 * Uso (raiz do repo):
 *   node squads/agent-social-v3/scripts/gen-slides-for-run.mjs <run-id>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..", "..");
const runId = process.argv[2];
if (!runId) {
  console.error("Usage: node gen-slides-for-run.mjs <run-id>");
  process.exit(1);
}

// Logo oficial (branco) do próprio squad v3
const LOGO_PATH = path.join(REPO, "squads/agent-social-v3/assets/innovation-latam-logo-white.png");
if (!fs.existsSync(LOGO_PATH)) {
  console.error(`❌ Logo não encontrado: ${LOGO_PATH}`);
  process.exit(1);
}
const logoB64 = fs.readFileSync(LOGO_PATH).toString("base64");
const LOGO = `data:image/png;base64,${logoB64}`;

const RUN_ROOT = path.join(REPO, "squads/agent-social-v3/output", runId);
const CAROUSEL_DRAFT_PATH = path.join(RUN_ROOT, "v1", "carousel-draft.md");
if (!fs.existsSync(CAROUSEL_DRAFT_PATH)) {
  console.error(`❌ carousel-draft.md não encontrado: ${CAROUSEL_DRAFT_PATH}`);
  process.exit(1);
}

const outDir = path.join(RUN_ROOT, "slides", "v1");
fs.mkdirSync(outDir, { recursive: true });

const draft = fs.readFileSync(CAROUSEL_DRAFT_PATH, "utf8");

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function mdBetween(hay, start, end) {
  const s = hay.indexOf(start);
  if (s === -1) return "";
  const from = s + start.length;
  const e = hay.indexOf(end, from);
  return (e === -1 ? hay.slice(from) : hay.slice(from, e)).trim();
}

function getField(block, label) {
  const re = new RegExp(`^\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`, "m");
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function getSlide(n) {
  // Suporta dois formatos de delimitador:
  // 1. Bold: **Slide N: TYPE** (formato gerado por generate-content.mjs)
  // 2. Heading: ## Slide N — (formato legado)
  //
  // Para o formato bold, usamos "**Slide N: " (colon + space) para distinguir
  // de itens de brief como "**Slide 1:**" (colon + closing **)
  const boldStart = `**Slide ${n}: `;
  const boldNext = n < 6 ? `\n**Slide ${n + 1}: ` : "\n**Caption";
  const headingStart = `## Slide ${n} —`;
  const headingNext = n < 6 ? `## Slide ${n + 1} —` : "## Caption Instagram";

  let block = "";
  if (draft.includes(boldStart)) {
    block = mdBetween(draft, boldStart, boldNext);
  } else {
    block = mdBetween(draft, headingStart, headingNext);
  }

  return {
    headline: getField(block, "Headline"),
    body: getField(block, "Body"),
    action1: getField(block, "Ação 1 \\(Salvar\\)"),
    action2: getField(block, "Ação 2 \\(Comentar\\)"),
  };
}

const slidesData = [1, 2, 3, 4, 5, 6].map(getSlide);

const commonHead = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:1080px; height:1350px; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  position:relative;
  background:#0a0510;
}
.bg-synth {
  position:absolute; inset:0; z-index:1;
  background: linear-gradient(165deg, #0a0510 0%, #150a1c 45%, #1a0d28 100%);
}
.overlay {
  position:absolute; inset:0; z-index:2;
  background: rgba(21,10,28,0.85);
  pointer-events:none;
}
.logo { position:absolute; top:30px; left:100px; z-index:10; }
.logo img { max-width:200px; display:block; }
.hl-gold { color:#e8c85c; font-weight:800; }
.hl-teal { color:#c0fefd; font-weight:700; }
.bottom-fade {
  position:absolute; left:0; right:0; bottom:0;
  height: 820px;
  z-index:3;
  pointer-events:none;
  background: linear-gradient(
    to top,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,0.90) 18%,
    rgba(0,0,0,0.55) 45%,
    rgba(0,0,0,0.18) 72%,
    rgba(0,0,0,0) 100%
  );
}
.footer {
  position:absolute; left:100px; right:100px; bottom:0; margin-bottom:20px; z-index:10;
  display:flex; justify-content:space-between; align-items:center;
  font-size:24px; font-weight:600; color:rgba(255,255,255,0.55);
}
.band {
  position:absolute; top:810px; left:100px; right:100px; height:270px;
  display:flex; flex-direction:column; justify-content:center;
  text-align:left; z-index:5;
  padding: 0 8px;
  background: rgba(10,5,16,0.55);
  border-radius: 12px;
}
.content {
  position:absolute; top:130px; left:100px; right:100px; bottom:280px;
  z-index:5;
  display:flex; flex-direction:column; justify-content:center;
  text-align:left; align-items:flex-start;
}
.content-inner { max-width:880px; width:100%; margin:0; }
</style>
</head>
<body>`;

function slide01() {
  const s = slidesData[0];
  const lines = s.headline.split("\n").map((l) => l.trim()).filter(Boolean);
  const l1 = escapeHtml(lines[0] ?? "");
  const l2 = escapeHtml(lines.slice(1).join(" "));
  return (
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="bottom-fade"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="band">
    <div style="font-size:56px; font-weight:800; color:#fff; line-height:1.12;">
      ${l1}
    </div>
    <div style="font-size:40px; font-weight:600; color:rgba(255,255,255,0.95); line-height:1.15; margin-top:16px;">
      ${l2}
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`
  );
}

function slide02(idx, tag) {
  const s = slidesData[idx];
  const h = escapeHtml(s.headline);
  const b = escapeHtml(s.body).replaceAll("\n", "<br/>");
  return (
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
      <div style="font-size:26px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(192,254,253,0.75); margin-bottom:18px;">${tag}</div>
      <h2 style="font-size:46px; font-weight:700; color:#fff; margin:0 0 22px 0; line-height:1.15;">${h}</h2>
      <p style="font-size:36px; font-weight:500; color:#fff; line-height:1.5; margin:0;">${b}</p>
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`
  );
}

function slide04() {
  const s = slidesData[3];
  const h = escapeHtml(s.headline);
  // Split body into two parts for the callout box (first sentence vs rest)
  const bodyRaw = s.body || "";
  const sentences = bodyRaw.split(/(?<=\.)\s+/);
  const callout = escapeHtml(sentences[0] || bodyRaw);
  const rest = escapeHtml(sentences.slice(1).join(" ")).replaceAll("\n", "<br/>");
  return (
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
      <div style="font-size:26px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(192,254,253,0.75); margin-bottom:18px;">Visual &amp; Vídeo</div>
      <h2 style="font-size:44px; font-weight:700; color:#fff; margin:0 0 18px 0; line-height:1.15;">${h}</h2>
      <div style="background:rgba(80,190,186,0.20); border:2px solid #50beba; border-radius:16px; padding:20px 26px; margin-bottom:18px;">
        <div style="font-size:32px; font-weight:700; color:#c0fefd; line-height:1.4;">${callout}</div>
      </div>
      <p style="font-size:32px; font-weight:500; color:rgba(255,255,255,0.9); line-height:1.45; margin:0;">${rest}</p>
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`
  );
}

function slide06() {
  const s = slidesData[5];
  const h = escapeHtml(s.headline);
  const b = escapeHtml(s.body).replaceAll("\n", "<br/>");
  // action1/action2 são opcionais — fallback gracioso se ausentes no draft
  const a1 = s.action1 ? escapeHtml(s.action1) : "";
  const a2 = s.action2 ? escapeHtml(s.action2) : "";
  return (
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
      <div style="font-size:26px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(192,254,253,0.75); margin-bottom:18px;">CTA</div>
      <h2 style="font-size:52px; font-weight:800; color:#fff; margin:0 0 18px 0; line-height:1.1;">${h}</h2>
      ${b ? `<p style="font-size:34px; font-weight:500; color:rgba(255,255,255,0.9); line-height:1.45; margin:0 0 28px 0;">${b}</p>` : ""}
      ${a1 ? `<div style="background:#50beba; border-radius:16px; padding:22px 28px; display:inline-block; margin-bottom:18px;"><span style="font-size:30px; font-weight:800; color:#0d0718;">${a1}</span></div>` : ""}
      ${a2 ? `<p style="font-size:32px; font-weight:700; color:#e8c85c; line-height:1.35; margin:0;">💬 ${a2}</p>` : ""}
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`
  );
}

const htmls = [
  slide01(),
  slide02(1, "Contexto"),
  slide02(2, "Como funciona"),
  slide04(),
  slide02(4, "Reflexão"),
  slide06(),
];

htmls.forEach((html, i) => {
  const n = String(i + 1).padStart(2, "0");
  fs.writeFileSync(path.join(outDir, `slide-${n}.html`), html, "utf8");
  console.log("Wrote", path.join(outDir, `slide-${n}.html`));
});

// Extrair título do draft para o documentation
const titleMatch = draft.match(/^#\s+Carrossel:\s*(.+)/m);
const carouselTitle = titleMatch ? titleMatch[1].trim() : runId;

const doc = `# Design Documentation
**Carrossel:** ${carouselTitle}
**Run ID:** ${runId}

## Norma aplicada
- \`real-imagery-and-safe-zones.md\`: imagens geradas + injetadas; texto à esquerda; rodapé \`@innovationlatam\` + \`ARRASTE ->\` em todos os slides.

## Pipeline
1. \`generate-bg-image.mjs\` → \`backgrounds/bg-NN.*\`
2. \`inject-bg-and-render.mjs\` → HTML + JPEG em \`rendered/\` (só \`.jpg\`)
`;
fs.writeFileSync(path.join(outDir, "design-documentation.md"), doc, "utf8");
console.log("Done. Output:", outDir);
