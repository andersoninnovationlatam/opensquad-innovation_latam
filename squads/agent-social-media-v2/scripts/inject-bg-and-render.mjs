/**
 * Injeta a imagem de fundo gerada (data-URI) no slide HTML e re-renderiza JPEG (único formato em rendered/).
 * Uso (na raiz do repo):
 *   node squads/agent-social-media-v2/scripts/inject-bg-and-render.mjs <slide-number> <slides-dir>
 *
 * Exemplo:
 *   node squads/agent-social-media-v2/scripts/inject-bg-and-render.mjs 01 squads/agent-social-media-v2/output/2026-04-03-130000/slides
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

/**
 * Slide 01: sem lavagem roxa no body; degradê só na base (hook).
 * Slides 02–06: body transparente + overlay roxo semitransparente (foto visível por baixo).
 */
function applySlideVisualRules(html, slideNum) {
  const SLIDE01_BOTTOM_FADE = `<div class="inject-slide01-bottom-fade" style="position:absolute; left:0; right:0; bottom:0; height:520px; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(21,10,28,0.45) 38%, rgba(21,10,28,0.08) 68%, transparent 100%); z-index:2; pointer-events:none;"></div>`;

  const SLIDE_TINT = `<div class="inject-slide-tint" style="position:absolute; inset:0; background: linear-gradient(135deg, rgba(21,10,28,0.55) 0%, rgba(42,21,56,0.50) 100%); z-index:2; pointer-events:none;"></div>`;

  if (slideNum === "01") {
    html = html.replace(
      /(<body[^>]*style="[^"]*?)background:\s*linear-gradient\([^)]+\);/i,
      "$1background: transparent;",
    );
    html = html.replace(
      /<div class="inject-slide01-bottom-fade"[^>]*><\/div>|<div style="position:absolute; inset:0; background: linear-gradient\(to bottom, rgba\(21,10,28,0\.50\) 0%, rgba\(21,10,28,0\.85\) 55%, rgba\(21,10,28,0\.95\) 100%\); z-index:2;"><\/div>/i,
      SLIDE01_BOTTOM_FADE,
    );
    return html;
  }

  // 02–06: re-tint idempotente (remove rodadas anteriores)
  html = html.replace(/<div class="inject-slide-tint"[^>]*><\/div>\s*/gi, "");
  html = html.replace(/<div class="inject-slide03-tint"[^>]*><\/div>\s*/gi, "");

  html = html.replace(
    /(<body[^>]*style="[^"]*?)background:\s*linear-gradient\([^)]+\);/i,
    "$1background: transparent;",
  );

  // Slide 02 (e variantes): lavagem opaca em tela cheia → fora (o tint cobre)
  html = html.replace(
    /<div style="position:absolute; inset:0; background:\s*rgba\(21,10,28,0\.85\); z-index:2;"><\/div>\s*/gi,
    "",
  );

  if (!html.includes("inject-slide-tint")) {
    html = html.replace(
      /(<div class="real-bg" style="position:absolute; inset:0; z-index:1;"><\/div>)/i,
      `$1\n\n${SLIDE_TINT}`,
    );
  }

  return html;
}

/** Logo branco só no topo esquerdo; rodapé: @ à esquerda, ARRASTE + seta à direita */
function applyInnovationBranding(html, logoDataUri) {
  const igHandle = "@innovationlatam";

  html = html.replace(/<div class="inject-brand-top"[^>]*>[\s\S]*?<\/div>\s*/gi, "");
  html = html.replace(/<div class="inject-brand-footer"[^>]*>[\s\S]*?<\/div>\s*/gi, "");
  html = html.replace(/<div class="inject-brand-cta"[^>]*>[\s\S]*?<\/div>\s*/gi, "");

  const topLogoRes = [
    /<div style="position:absolute; top:30px; left:100px; z-index:3;">\s*<img[\s\S]*?\/>\s*<\/div>/gi,
    /<div style="position:absolute; top:30px; left:100px; padding-top:0;">\s*<img[\s\S]*?\/>\s*<\/div>/gi,
    /<div style="padding-top:30px; flex-shrink:0; position:relative; z-index:3;">\s*<img[\s\S]*?\/>\s*<\/div>/gi,
    /<div style="padding-top:30px; position:relative; z-index:3;">\s*<img[\s\S]*?\/>\s*<\/div>/gi,
  ];
  for (const re of topLogoRes) html = html.replace(re, "");

  html = html.replace(
    /<div style="position:absolute; left:100px; right:100px; bottom:0; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; z-index:3;">[\s\S]*?<\/div>/gi,
    "",
  );

  // gen-slides / HTML do agente: .logo e .footer no CSS (não só inline) — remover para não duplicar inject-brand-*
  html = html.replace(/<div[^>]*\bclass="[^"]*\blogo\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*/gi, "");
  html = html.replace(/<div[^>]*\bclass="[^"]*\bfooter\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*/gi, "");

  const footerBlock = `
<div class="inject-brand-top" style="position:absolute; top:40px; left:40px; z-index:4;">
<img src="${logoDataUri}" alt="" style="height:48px; width:auto; max-width:220px; display:block; object-fit:contain;" />
</div>
<div class="inject-brand-footer" style="position:absolute; left:40px; right:40px; bottom:40px; z-index:4; display:flex; justify-content:space-between; align-items:center;">
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

const slidesDir = path.isAbsolute(slidesDirArg)
  ? slidesDirArg
  : path.resolve(REPO_ROOT, slidesDirArg);

const bgDir = path.join(slidesDir, "backgrounds");
const v1Dir = path.join(slidesDir, "v1");
const renderedDir = path.join(slidesDir, "v1", "rendered");
fs.mkdirSync(renderedDir, { recursive: true });

// ── Encontrar a imagem de fundo ──────────────────────────────────────────
const bgCandidates = ["jpg", "jpeg", "png", "webp"]
  .map(ext => path.join(bgDir, `bg-${slideNum}.${ext}`))
  .filter(f => fs.existsSync(f));

if (!bgCandidates.length) {
  console.error(`❌ Imagem de fundo não encontrada em ${bgDir}/bg-${slideNum}.*`);
  process.exit(1);
}

const bgFile = bgCandidates[0];
const ext = path.extname(bgFile).slice(1).replace("jpg", "jpeg");
const bgBase64 = fs.readFileSync(bgFile).toString("base64");
const bgDataURI = `data:image/${ext};base64,${bgBase64}`;
console.log(`🖼  Fundo: ${path.basename(bgFile)} (${(bgBase64.length * 0.75 / 1024).toFixed(0)} KB)`);

// ── Ler o HTML do slide ──────────────────────────────────────────────────
const slideFile = path.join(v1Dir, `slide-${slideNum}.html`);
if (!fs.existsSync(slideFile)) {
  console.error(`❌ Slide não encontrado: ${slideFile}`);
  process.exit(1);
}

let html = fs.readFileSync(slideFile, "utf-8");

// ── Limpar injeções anteriores (idempotente) ─────────────────────────────
// Slides só com estilos inline (sem <style>): injeção fica em <style> antes de </head>
html = html.replace(
  /<style>\s*\/\* ── Fundo real gerado por IA ── \*\/[\s\S]*?<\/style>\s*\n?(?=\s*<\/head>)/i,
  "",
);
html = html.replace(/\n\/\* ── Fundo real gerado por IA ── \*\/[\s\S]*?\.real-bg \{[\s\S]*?\}\n/g, "");
html = html.replace(/\n\s*<div class="real-bg"><\/div>/g, "");
html = html.replace(
  /\n\/\* ── Ocultar cena CSS \(substituída por foto real\) ── \*\/[\s\S]*?(?=<\/style>)/g,
  "",
);

// ── Injetar fundo real ───────────────────────────────────────────────────
// Estratégia: adicionar um elemento .real-bg como camada base (z-index:0),
// com a imagem cobrindo todo o slide (cover), antes de todos os outros elementos.
// Isso respeita os overlays e o texto existentes.

const realBgCSS = `
/* ── Fundo real gerado por IA ── */
.real-bg {
  position:absolute;inset:0;z-index:0;
  background-image: url("${bgDataURI}");
  background-size: cover;
  background-position: center top;
}
`;

// Inserir <div class="real-bg"></div> como primeiro filho do body (slides com ou sem <style>)
html = html.replace(/<body([^>]*)>/i, `<body$1>\n  <div class="real-bg"></div>`);

// Ocultar elementos de cena CSS — a foto real os substitui (só quando existe bloco <style> com regras .classe {})
const KEEP_CLASSES = new Set([
  "logo", "overlay", "footer", "vignette", "film-grain", "real-bg",
  "hl-gold", "hl-teal",
  "bottom-fade",
  "band",
  "content", "content-inner",
  "wrap",
  "callout", "callout-item", "complement", "divider",
  "headline", "body", "label", "question",
  "btn", "btn-icon", "btn-txt", "comment",
]);

const cssClassMatches = [...html.matchAll(/^\.[a-z][a-z\-0-9]+(?=\s*\{)/gm)];
const allClasses = [...new Set(cssClassMatches.map(m => m[0].slice(1)))];
const toHide = allClasses.filter(c => !KEEP_CLASSES.has(c));
const hideCSS = toHide.map(c => `.${c} { display: none !important; }`).join("\n");

const combinedInject = `${realBgCSS}\n/* ── Ocultar cena CSS (substituída por foto real) ── */\n${hideCSS}\n`;

if (/<\/style>/i.test(html)) {
  html = html.replace("</style>", `${combinedInject}</style>`);
} else {
  // Slides gerados só com inline styles: não há </style> — injetar antes de </head>
  html = html.replace(/<\/head>/i, `<style>\n${combinedInject}</style>\n</head>`);
}

// ── Regras visuais por slide (foto visível + tratamento de overlay) ────────
html = applySlideVisualRules(html, slideNum);

// ── Logo Innovation Latam (branco) topo esquerdo; rodapé @ + ARRASTE → ──
const logoPath = path.join(REPO_ROOT, "squads", "agent-social-media-v2", "assets", "innovation-latam-logo-white.png");
if (fs.existsSync(logoPath)) {
  const logoB64 = fs.readFileSync(logoPath).toString("base64");
  const logoDataUri = `data:image/png;base64,${logoB64}`;
  html = applyInnovationBranding(html, logoDataUri);
} else {
  console.warn(`⚠️  Logo não encontrado (${logoPath}) — use squads/{code}/assets/innovation-latam-logo-white.png`);
}

// ── Salvar HTML modificado (versão com fundo real) ───────────────────────
const outHtmlFile = path.join(v1Dir, `slide-${slideNum}.html`);
fs.writeFileSync(outHtmlFile, html, "utf-8");
console.log(`💾 HTML atualizado: ${outHtmlFile}`);

// ── Renderizar só JPEG (norma: um único formato em rendered/) ─────────────
const outJpg = path.join(renderedDir, `slide-${slideNum}.jpg`);
const stalePng = path.join(renderedDir, `slide-${slideNum}.png`);
const clip = { x: 0, y: 0, width: 1080, height: 1350 };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

const fileUrl = `file://${outHtmlFile}`;
await page.goto(fileUrl, { waitUntil: "networkidle" });
await page.screenshot({ path: outJpg, type: "jpeg", quality: 92, clip });
await browser.close();

if (fs.existsSync(stalePng)) fs.unlinkSync(stalePng);

console.log(`✅ JPEG: ${outJpg}`);
