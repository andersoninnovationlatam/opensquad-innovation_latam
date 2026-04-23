/**
 * Reescreve slide-01..06.html (pré-fundo/inject) a partir de output/{runId}/v1/carousel-draft.md.
 * Uso (raiz do repo): node squads/agent-social-media-v2/scripts/emit-html-for-run.mjs <run-id>
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..", "..");
const runId = process.argv[2];
if (!runId) {
  console.error("Usage: node emit-html-for-run.mjs <run-id>");
  process.exit(1);
}

const draftPath = path.join(REPO, "squads/agent-social-media-v2/output", runId, "v1/carousel-draft.md");
if (!fs.existsSync(draftPath)) {
  console.error(`Missing ${draftPath}`);
  process.exit(1);
}

const md = fs.readFileSync(draftPath, "utf8");

/** Extrai bloco entre "## Slide N" e próximo ## ou fim */
function slideBlock(n) {
  const re = new RegExp(
    `## Slide ${n}[^\\n]*\\n([\\s\\S]*?)(?=\\n## (?:Slide \\d|Caption)|$)`,
    "i",
  );
  const m = md.match(re);
  return m ? m[1].trim() : "";
}

function field(block, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\*\\*${esc}:\\*\\*\\s*([^\\n]*(?:\\n(?![*#])[^\\n]*)*)`, "i");
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const LOGO = `data:image/png;base64,${fs
  .readFileSync(path.join(REPO, "squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png"))
  .toString("base64")}`;

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

const outDir = path.join(REPO, "squads/agent-social-media-v2/output", runId, "slides/v1");
fs.mkdirSync(outDir, { recursive: true });

const b1 = slideBlock(1);
const b2 = slideBlock(2);
const b3 = slideBlock(3);
const b4 = slideBlock(4);
const b5 = slideBlock(5);
const b6 = slideBlock(6);

const h1 = field(b1, "Headline").replace(/\n+/g, " ");
const h2 = field(b2, "Headline");
const body2 = field(b2, "Body");
const h3 = field(b3, "Headline");
const body3 = field(b3, "Body");
const h4 = field(b4, "Headline");
const body4 = field(b4, "Body");
const h5 = field(b5, "Headline");
const body5 = field(b5, "Body");
const h6 = field(b6, "Headline");
const body6 = field(b6, "Body");
const a1 = field(b6, "Ação 1 (Salvar)");
const a2 = field(b6, "Ação 2 (Comentar)");

const slides = [
  () =>
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="bottom-fade"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="band">
    <div style="font-size:52px; font-weight:800; color:#fff; line-height:1.12;">
      ${esc(h1)
        .replace(/Apache 2\.0/g, '<span class="hl-gold">Apache 2.0</span>')
        .replace(/31B/g, '<span class="hl-gold">31B</span>')
        .replace(/Gemma 4/g, '<span class="hl-gold">Gemma 4</span>')}
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`,

  () =>
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
    <h2 style="font-size:46px; font-weight:700; color:#fff; margin:0 0 28px 0; line-height:1.15;">${esc(h2)}</h2>
    ${body2
      .split(/\n+/)
      .filter(Boolean)
      .map(
        p =>
          `<p style="font-size:36px; font-weight:500; color:#fff; line-height:1.5; margin:0 0 20px 0;">${esc(p)}</p>`,
      )
      .join("\n")}
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`,

  () =>
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
    <h2 style="font-size:44px; font-weight:700; color:#fff; margin:0 0 28px 0; line-height:1.2;">${esc(h3)}</h2>
    ${body3
      .split(/\n+/)
      .filter(Boolean)
      .map(
        p =>
          `<p style="font-size:38px; font-weight:500; color:rgba(255,255,255,0.92); line-height:1.45; margin:0 0 22px 0;">${esc(p)}</p>`,
      )
      .join("\n")}
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`,

  () =>
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
    <h2 style="font-size:40px; font-weight:700; color:#fff; margin:0 0 24px 0;">${esc(h4)}</h2>
    <div style="border:2px solid #c0fefd; border-radius:16px; padding:28px 32px; background:rgba(153,60,177,0.30); margin-bottom:20px; text-align:left;">
      ${body4
        .split(/\n+/)
        .filter(Boolean)
        .map(
          line =>
            `<p style="font-size:32px; font-weight:500; color:#fff; line-height:1.45; margin:8px 0;">${esc(line)}</p>`,
        )
        .join("\n")}
    </div>
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`,

  () =>
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
    <h2 style="font-size:44px; font-weight:700; color:#fff; margin:0 0 28px 0; line-height:1.2;">${esc(h5)}</h2>
    <p style="font-size:36px; font-weight:500; color:rgba(255,255,255,0.9); line-height:1.5; margin:0;">${esc(body5)}</p>
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`,

  () =>
    commonHead +
    `
  <div class="bg-synth"></div>
  <div class="overlay"></div>
  <div class="logo"><img src="${LOGO}" alt="Innovation Latam" /></div>
  <div class="content">
    <div class="content-inner">
    <h2 style="font-size:48px; font-weight:800; color:#fff; margin:0 0 24px 0;">${esc(h6)}</h2>
    <p style="font-size:34px; font-weight:500; color:rgba(255,255,255,0.9); line-height:1.45; margin:0 0 28px 0;">${esc(body6)}</p>
    <div style="background:#50beba; border-radius:16px; padding:22px 36px; display:inline-block; margin-bottom:24px; text-align:left;">
      <span style="font-size:30px; font-weight:700; color:#0d0718;">${esc(a1)}</span>
    </div>
    <p style="font-size:30px; font-weight:600; color:#e8c85c; line-height:1.4;">${esc(a2)}</p>
    </div>
  </div>
  <div class="footer">
    <span>@innovationlatam</span>
    <span>ARRASTE -&gt;</span>
  </div>
</body></html>`,
];

slides.forEach((fn, i) => {
  const n = String(i + 1).padStart(2, "0");
  fs.writeFileSync(path.join(outDir, `slide-${n}.html`), fn(), "utf8");
  console.log("Wrote slide-" + n + ".html");
});

const doc = `# Design Documentation
**Run ID:** ${runId}
**Fonte:** v1/carousel-draft.md (emit-html-for-run.mjs)

## Norma
- Pré-inject: logo .logo + rodapé .footer (removidos no inject-bg-and-render)
`;

fs.writeFileSync(path.join(outDir, "design-documentation.md"), doc, "utf8");
console.log("Done:", outDir);
