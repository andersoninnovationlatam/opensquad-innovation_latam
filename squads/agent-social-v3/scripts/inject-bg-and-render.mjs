/**
 * Injeta a imagem de fundo gerada (data-URI) no slide HTML e re-renderiza JPEG (único formato em rendered/).
 * Uso (na raiz do repo):
 *   node squads/agent-social-v3/scripts/inject-bg-and-render.mjs <slide-number> <slides-dir>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

function applySlideVisualRules(html, slideNum) {
  const SLIDE01_BOTTOM_FADE = `<div class="inject-slide01-bottom-fade" style="position:absolute; left:0; right:0; bottom:0; height:520px; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(21,10,28,0.45) 38%, rgba(21,10,28,0.08) 68%, transparent 100%); z-index:2; pointer-events:none;"></div>`;
  const SLIDE_TINT = `<div class="inject-slide-tint" style="position:absolute; inset:0; background: linear-gradient(135deg, rgba(21,10,28,0.55) 0%, rgba(42,21,56,0.50) 100%); z-index:2; pointer-events:none;"></div>`;

  if (slideNum === "01") {
    html = html.replace(
      /(<body[^>]*style="[^"]*?)background:\s*linear-gradient\([^)]+\);/i,
      "$1background: transparent;"
    );
    html = html.replace(
      /<div class="inject-slide01-bottom-fade"[^>]*><\/div>|<div style="position:absolute; inset:0; background: linear-gradient\(to bottom, rgba\(21,10,28,0\.50\) 0%, rgba\(21,10,28,0\.85\) 55%, rgba\(21,10,28,0\.95\) 100%\); z-index:2;"><\/div>/i,
      SLIDE01_BOTTOM_FADE
    );
    return html;
  }

  html = html.replace(/<div class="inject-slide-tint"[^>]*><\/div>\s*/gi, "");
  html = html.replace(/<div class="inject-slide03-tint"[^>]*><\/div>\s*/gi, "");

  html = html.replace(
    /(<body[^>]*style="[^"]*?)background:\s*linear-gradient\([^)]+\);/i,
    "$1background: transparent;"
  );

  html = html.replace(
    /<div style="position:absolute; inset:0; background:\s*rgba\(21,10,28,0\.85\); z-index:2;"><\/div>\s*/gi,
    ""
  );

  if (!html.includes("inject-slide-tint")) {
    html = html.replace(
      /(<div class="real-bg" style="position:absolute; inset:0; z-index:1;"><\/div>)/i,
      `$1\n\n${SLIDE_TINT}`
    );
  }

  return html;
}

function applyInnovationBranding(html, logoDataUri) {
  const igHandle = "@innovationlatam";

  html = html.replace(/<div class="inject-brand-top"[^>]*>[\s\S]*?<\/div>\s*/gi, "");
  html = html.replace(/<div class="inject-brand-footer"[^>]*>[\s\S]*?<\/div>\s*/gi, "");

  const topLogoRes = [
    /<div style="position:absolute; top:30px; left:100px; z-index:3;">\s*<img[\s\S]*?\/>\s*<\/div>/gi,
    /<div style="position:absolute; top:30px; left:100px; z-index:10;">\s*<img[\s\S]*?\/>\s*<\/div>/gi,
    /<div class="logo"[^>]*>[\s\S]*?<\/div>/gi,
  ];
  for (const re of topLogoRes) html = html.replace(re, "");

  html = html.replace(/<div[^>]*\bclass="[^"]*\bfooter\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*/gi, "");

  const footerBlock = `
<div class="inject-brand-top" style="position:absolute; top:30px; left:100px; z-index:999;">
  <img src="${logoDataUri}" alt="" style="max-width:200px; display:block; object-fit:contain;" />
</div>
<div class="inject-brand-footer" style="position:absolute; left:100px; right:100px; bottom:0; margin-bottom:20px; z-index:999; display:flex; justify-content:space-between; align-items:center;">
  <span style="font-size:24px; font-weight:600; color:rgba(255,255,255,0.60);">${igHandle}</span>
  <span style="font-size:24px; font-weight:600; color:rgba(255,255,255,0.40); display:inline-flex; align-items:center; gap:6px;">
    ARRASTE <span style="font-size:17px; line-height:1; opacity:0.95;" aria-hidden="true">→</span>
  </span>
</div>`;

  return html.replace(/<\/body>/i, `${footerBlock}\n</body>`);
}

const slideNum = process.argv[2] || "01";
const slidesDirArg = process.argv[3];
if (!slidesDirArg) {
  console.error("Usage: node inject-bg-and-render.mjs <slide-number> <slides-dir>");
  process.exit(1);
}

const slidesDir = path.isAbsolute(slidesDirArg) ? slidesDirArg : path.resolve(REPO_ROOT, slidesDirArg);
const bgDir = path.join(slidesDir, "backgrounds");
const v1Dir = path.join(slidesDir, "v1");
const renderedDir = path.join(slidesDir, "v1", "rendered");
fs.mkdirSync(renderedDir, { recursive: true });

const bgCandidates = ["jpg", "jpeg", "png", "webp"]
  .map((ext) => path.join(bgDir, `bg-${slideNum}.${ext}`))
  .filter((f) => fs.existsSync(f));

if (!bgCandidates.length) {
  console.error(`❌ Imagem de fundo não encontrada em ${bgDir}/bg-${slideNum}.*`);
  process.exit(1);
}

const bgFile = bgCandidates[0];
const ext = path.extname(bgFile).slice(1).replace("jpg", "jpeg");
const bgBase64 = fs.readFileSync(bgFile).toString("base64");
const bgDataURI = `data:image/${ext};base64,${bgBase64}`;
console.log(`🖼  Fundo: ${path.basename(bgFile)} (${(bgBase64.length * 0.75 / 1024).toFixed(0)} KB)`);

const slideFile = path.join(v1Dir, `slide-${slideNum}.html`);
if (!fs.existsSync(slideFile)) {
  console.error(`❌ Slide não encontrado: ${slideFile}`);
  process.exit(1);
}

let html = fs.readFileSync(slideFile, "utf-8");

html = html.replace(
  /<style>\s*\/\* ── Fundo real gerado por IA ── \*\/[\s\S]*?<\/style>\s*\n?(?=\s*<\/head>)/i,
  ""
);
html = html.replace(/\n\s*<div class="real-bg"><\/div>/g, "");

const realBgCSS = `
/* ── Fundo real gerado por IA ── */
.real-bg {
  position:absolute;inset:0;z-index:0;
  background-image: url("${bgDataURI}");
  background-size: cover;
  background-position: center top;
}
/* gen-slides-for-run: .bg-synth é placeholder até o inject — senão cobre o .real-bg */
.bg-synth {
  display: none !important;
}
/* Overlay sólido do template escurece demais a foto; gradiente alinha ao tint do pipeline */
.overlay {
  background: linear-gradient(135deg, rgba(21,10,28,0.55) 0%, rgba(42,21,56,0.50) 100%) !important;
}
`;

html = html.replace(/<body([^>]*)>/i, `<body$1>\n  <div class="real-bg"></div>`);

if (/<\/style>/i.test(html)) {
  html = html.replace("</style>", `${realBgCSS}</style>`);
} else {
  html = html.replace(/<\/head>/i, `<style>\n${realBgCSS}</style>\n</head>`);
}

html = applySlideVisualRules(html, slideNum);

const logoPath = path.join(REPO_ROOT, "squads", "agent-social-v3", "assets", "innovation-latam-logo-white.png");
if (fs.existsSync(logoPath)) {
  const logoB64 = fs.readFileSync(logoPath).toString("base64");
  const logoDataUri = `data:image/png;base64,${logoB64}`;
  html = applyInnovationBranding(html, logoDataUri);
} else {
  console.error(`❌ Logo não encontrado (${logoPath})`);
  process.exit(1);
}

fs.writeFileSync(slideFile, html, "utf-8");
console.log(`💾 HTML atualizado: ${slideFile}`);

const outJpg = path.join(renderedDir, `slide-${slideNum}.jpg`);
const stalePng = path.join(renderedDir, `slide-${slideNum}.png`);
const clip = { x: 0, y: 0, width: 1080, height: 1350 };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(`file://${slideFile}`, { waitUntil: "networkidle" });
await page.screenshot({ path: outJpg, type: "jpeg", quality: 92, clip });
await browser.close();

if (fs.existsSync(stalePng)) fs.unlinkSync(stalePng);

console.log(`✅ JPEG: ${outJpg}`);
