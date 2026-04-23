/**
 * Gera slide-XX.html + PNG (1080×1440) a partir de carousel-post-*.md.
 *
 * Padrão default (post-05 Innovation Latam):
 * - Slide 1: capa tipo slide-titulo — imagem hero (ai-brain-glow), Montserrat Bold, manchete + destaques dourados, sem rodapé de handle.
 * - Slide 2: conteúdo com imagem de fundo — hero image + overlay escuro forte, Montserrat, texto mais denso, @innovationlatam + ARRASTE.
 * - Slides 3+: conteúdo tipo slide-conteudo — fundo roxo marca, Montserrat, só corpo (sem título de slide), padding 5%, destaques teal, @innovationlatam + ARRASTE.
 * Logo branco Innovation Latam: **sempre** embutido no HTML (data-URI) em todos os slides (capa e conteúdo).
 *
 * Uso (na raiz do repo):
 *   node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs [RUN_DIR]
 *   node squads/tech-instagram-carousel/scripts/build-carousel-slides.mjs --png-only [RUN_DIR]
 * RUN_DIR: opcional; se omitido, usa a pasta mais recente em output/YYYY-MM-DD-*.
 * --png-only: só gera PNG a partir dos HTML existentes (não reescreve .html).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQUAD_DIR = path.resolve(__dirname, "..");
/** Raiz do repositório (squads/tech-instagram-carousel → dois níveis acima). */
const REPO_ROOT = path.resolve(SQUAD_DIR, "..", "..");

const POSTS = [
  { key: "post-01-medo", md: "carousel-post-01-medo.md", label: "01" },
  { key: "post-02-oportunidade", md: "carousel-post-02-oportunidade.md", label: "02" },
  { key: "post-03-educacional", md: "carousel-post-03-educacional.md", label: "03" },
  { key: "post-04-contrario", md: "carousel-post-04-contrario.md", label: "04" },
  { key: "post-05-inspiracional", md: "carousel-post-05-inspiracional.md", label: "05" },
];

const SOCIAL_HANDLE = "@innovationlatam";

/** Montserrat Variable Font — embutida como base64 para garantir renderização offline (file://) */
const MONTSERRAT_FONT_CANDIDATES = [
  path.join(SQUAD_DIR, "assets", "Montserrat-VF.ttf"),
  path.join(REPO_ROOT, "squads", "innovation-latam-news", "pipeline", "assets", "fonts", "Montserrat-VF.ttf"),
];

function getMontserratFontFace() {
  for (const p of MONTSERRAT_FONT_CANDIDATES) {
    if (fs.existsSync(p)) {
      const b64 = fs.readFileSync(p).toString("base64");
      return `@font-face {
      font-family: 'Montserrat';
      src: url('data:font/truetype;base64,${b64}') format('truetype');
      font-weight: 100 900;
      font-style: normal;
    }`;
    }
  }
  // fallback: Google Fonts (funciona em ambiente com internet)
  console.warn("Montserrat-VF.ttf não encontrado — usando Google Fonts @import (requer internet).");
  return `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`;
}

/** Ordem: primeiro o asset local do squad; depois o canónico partilhado com noticias-ia-tech-instagram. */
const INNOVATION_LATAM_LOGO_CANDIDATES = [
  path.join(SQUAD_DIR, "assets", "innovation-latam-logo-white.png"),
  path.join(REPO_ROOT, "squads", "noticias-ia-tech-instagram", "pipeline", "assets", "innovation-latam-logo-white.png"),
];

function resolveInnovationLatamLogoPath() {
  for (const p of INNOVATION_LATAM_LOGO_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** Logo branco Innovation Latam: obrigatório em todos os slides (capa e conteúdo), embutido no HTML. */
function getLogoHtml() {
  const logoPath = resolveInnovationLatamLogoPath();
  if (!logoPath) {
    console.error(
      "ERRO: innovation-latam-logo-white.png não encontrado. Coloque o ficheiro em um destes caminhos:\n  -",
      INNOVATION_LATAM_LOGO_CANDIDATES[0],
      "\n  -",
      INNOVATION_LATAM_LOGO_CANDIDATES[1],
    );
    throw new Error("Logo Innovation Latam obrigatório em todos os slides.");
  }
  const b64 = fs.readFileSync(logoPath).toString("base64");
  return `<div class="logo-wrap"><img src="data:image/png;base64,${b64}" alt="Innovation Latam" /></div>`;
}

function resolveRunDir(arg) {
  if (arg) return path.resolve(arg);
  const outBase = path.join(SQUAD_DIR, "output");
  if (!fs.existsSync(outBase)) return path.join(SQUAD_DIR, "output", "2026-04-01-093432");
  const dirs = fs
    .readdirSync(outBase, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse();
  return dirs.length ? path.join(outBase, dirs[0]) : path.join(SQUAD_DIR, "output", "2026-04-01-093432");
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseField(block, name) {
  const re = new RegExp(`\\*\\*${name}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`);
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function parseSlides(md) {
  const cap = md.indexOf("\n## Caption");
  const head = cap >= 0 ? md.slice(0, cap) : md;
  const re = /## Slide (\d+):\s*([^\n]*)\n([\s\S]*?)(?=\n## Slide \d+:|$)/g;
  const slides = [];
  let m;
  while ((m = re.exec(head)) !== null) {
    const block = m[3];
    const bgLine = (block.match(/\*\*Background:\*\*\s*([^\n]+)/) || [])[1] || "";
    let headline = parseField(block, "Headline");
    let supporting = parseField(block, "Supporting Text");
    const ctaExtra = parseField(block, "CTA Text");
    const accentKw = (block.match(/\*\*Accent Keywords:\*\*\s*([^\n]+)/) || [])[1] || "";
    if (ctaExtra) supporting += (supporting ? "\n\n" : "") + ctaExtra;
    slides.push({
      slideTitle: m[2].trim(),
      headline: headline || m[2].trim(),
      supporting,
      accentKw,
      bgLine,
    });
  }
  return slides;
}

function highlightKeywords(text, accentLine, className = "hl") {
  let t = esc(text);
  if (!accentLine) return t;
  const parts = accentLine
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  for (const kw of parts) {
    const plain = kw.replace(/\*\*/g, "").trim();
    if (plain.length < 2) continue;
    const r = new RegExp(`(${plain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    t = t.replace(r, `<span class="${className}">$1</span>`);
  }
  return t;
}

/** Corpo em parágrafos para slides de conteúdo */
function supportingToParagraphs(supporting, accentKw) {
  const raw = (supporting || "").trim();
  if (!raw) return "<p><span class=\"hl\">—</span></p>";
  let chunks = raw.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  if (chunks.length === 1) {
    const one = chunks[0];
    const sentences = one.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length > 3) {
      chunks = [];
      for (let i = 0; i < sentences.length; i += 2) {
        chunks.push(sentences.slice(i, i + 2).join(" "));
      }
    }
  }
  return chunks
    .map((c) => `<p>${highlightKeywords(c, accentKw, "hl")}</p>`)
    .join("\n        ");
}

function coverSlideHtml(slide, bgUrl, companyLogoUrl) {
  const headlineHtml = highlightKeywords(slide.headline, slide.accentKw, "hl");
  const companyLogoHtml = companyLogoUrl
    ? `<div class="company-logo-wrap"><img src="${companyLogoUrl}" alt="Company Logo" /></div>`
    : "";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    ${getMontserratFontFace()}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .slide {
      position: relative;
      width: 1080px;
      height: 1440px;
      overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      color: #fff;
    }
    .bg-full {
      position: absolute;
      inset: 0;
      background-image: url('${bgUrl.replace(/'/g, "%27")}');
      background-size: cover;
      background-position: center center;
    }
    .gradient-fade {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        linear-gradient(120deg, rgba(26, 21, 34, 0) 0%, rgba(26, 21, 34, 0) 40%, rgba(8, 6, 14, 0.55) 68%, rgba(6, 5, 10, 0.92) 88%, #050408 100%),
        linear-gradient(120deg, rgba(5, 2, 14, 0) 0%, rgba(5, 2, 14, 0.12) 52%, rgba(10, 8, 18, 0.75) 78%, rgba(7, 6, 12, 0.97) 100%);
    }
    .title-wrap {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3;
      padding: 0 5% 10% 5%;
    }
    .headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 82px;
      font-weight: 700;
      line-height: 1.02;
      text-align: left;
      color: #fff;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      max-width: 100%;
    }
    .headline .hl { color: #e8c85c; }
    .logo-wrap {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 4;
      opacity: 0.98;
    }
    .logo-wrap img {
      display: block;
      width: auto;
      height: auto;
      max-width: 200px;
      object-fit: contain;
    }
    .company-logo-wrap {
      position: absolute;
      top: 30%;
      right: 5%;
      z-index: 4;
      opacity: 0.90;
    }
    .company-logo-wrap img {
      display: block;
      width: auto;
      height: auto;
      max-width: 180px;
      object-fit: contain;
      filter: drop-shadow(0 2px 12px rgba(0,0,0,0.7));
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="bg-full" aria-hidden="true"></div>
    <div class="gradient-fade" aria-hidden="true"></div>
    ${getLogoHtml()}
    ${companyLogoHtml}
    <div class="title-wrap">
      <h1 class="headline">${headlineHtml}</h1>
    </div>
  </div>
</body>
</html>`;
}

function contentSlideHtml(slide) {
  const bodyInner = supportingToParagraphs(slide.supporting, slide.accentKw);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    ${getMontserratFontFace()}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .slide {
      position: relative;
      width: 1080px;
      height: 1440px;
      overflow: hidden;
      font-family: 'Montserrat', system-ui, sans-serif;
      color: #fff;
      font-size: 100px;
    }
    .bg-base {
      position: absolute;
      inset: 0;
      background: linear-gradient(165deg, #150a1c 0%, #2a1538 42%, #1a0f24 100%);
    }
    .bg-base::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 100% 58% at 50% 0%, rgba(153, 60, 177, 0.42) 0%, transparent 58%),
        radial-gradient(ellipse 48% 42% at 100% 88%, rgba(150, 28, 130, 0.22) 0%, transparent 55%);
      pointer-events: none;
    }
    .bg-base::after {
      content: "";
      position: absolute;
      left: 10%;
      top: 48%;
      width: 80%;
      height: 20%;
      background: linear-gradient(90deg, transparent 0%, rgba(153, 60, 177, 0.14) 50%, transparent 100%);
      pointer-events: none;
    }
    .swipe-hint {
      position: absolute;
      right: 5%;
      bottom: 118px;
      z-index: 3;
      font-size: 22px;
      font-weight: 600;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.04em;
    }
    .center-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: 96px;
      bottom: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5%;
      z-index: 2;
    }
    /* Card: respiro generoso (~Tailwind p-12 = 3rem) */
    .text-card {
      width: 100%;
      max-width: 920px;
      margin: 0 auto;
      padding: 48px;
      border-radius: 22px;
      background: rgba(8, 6, 14, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow:
        0 12px 48px rgba(0, 0, 0, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    .content { max-width: 100%; width: 100%; padding: 0; }
    .body-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 40%;
      font-weight: 500;
      line-height: 1.55;
      text-align: left;
      color: rgba(255,255,255,0.92);
    }
    .body-text p { margin: 0; }
    .body-text p + p { margin-top: 1.35em; }
    .body-text p::first-letter {
      text-transform: uppercase;
    }
    .body-text .hl { color: #c0fefd; font-weight: 700; }
    .logo-wrap {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 4;
      opacity: 0.98;
    }
    .logo-wrap img {
      display: block;
      width: auto;
      height: auto;
      max-width: 200px;
      object-fit: contain;
    }
    .bottom-strip {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0.5% 5% 0.65%;
      z-index: 3;
      text-align: left;
      background: linear-gradient(180deg, transparent 0%, rgba(21, 10, 28, 0.9) 45%, #150a1c 100%);
    }
    .bottom-strip .handle {
      font-family: 'Montserrat', system-ui, sans-serif;
      font-size: 24px;
      font-weight: 600;
      color: rgba(255,255,255,0.82);
      letter-spacing: 0.04em;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="bg-base" aria-hidden="true"></div>
    ${getLogoHtml()}
    <div class="swipe-hint">ARRASTE →</div>
    <div class="center-wrap">
      <div class="text-card">
        <div class="content">
          <div class="body-text">
          ${bodyInner}
          </div>
        </div>
      </div>
    </div>
    <footer class="bottom-strip">
      <div class="handle">${esc(SOCIAL_HANDLE)}</div>
    </footer>
  </div>
</body>
</html>`;
}

/** Slide 2: imagem de fundo (como a capa) + overlay escuro forte + texto denso */
function contentWithImageSlideHtml(slide, bgUrl) {
  const bodyInner = supportingToParagraphs(slide.supporting, slide.accentKw);
  const headlineHtml = highlightKeywords(slide.headline, slide.accentKw, "hl");
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    ${getMontserratFontFace()}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .slide {
      position: relative;
      width: 1080px;
      height: 1440px;
      overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      color: #fff;
      font-size: 100px;
    }
    .bg-full {
      position: absolute;
      inset: 0;
      background-image: url('${bgUrl.replace(/'/g, "%27")}');
      background-size: cover;
      background-position: center center;
    }
    .gradient-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(21, 10, 28, 0.82) 0%, rgba(21, 10, 28, 0.75) 40%, rgba(21, 10, 28, 0.88) 70%, rgba(21, 10, 28, 0.95) 100%);
    }
    .swipe-hint {
      position: absolute;
      right: 5%;
      bottom: 118px;
      z-index: 5;
      font-size: 22px;
      font-weight: 600;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.04em;
    }
    /* Área do texto começa abaixo do logo Innovation Latam (logo ~top 30px, altura até ~140px) */
    .center-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: 178px;
      bottom: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 0 5%;
      z-index: 3;
    }
    .slide2-text-modal {
      width: 100%;
      max-width: 920px;
      margin: 0 auto;
      padding: 48px;
      border-radius: 22px;
      background: rgba(8, 6, 14, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow:
        0 12px 48px rgba(0, 0, 0, 0.55),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .content { max-width: 100%; width: 100%; padding: 0; }
    .slide-headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 46px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.01em;
      color: #fff;
      margin-bottom: 28px;
      text-align: left;
      width: 100%;
    }
    .slide-headline .hl { color: #e8c85c; }
    .body-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 36%;
      font-weight: 500;
      line-height: 1.55;
      text-align: left;
      color: rgba(255,255,255,0.92);
    }
    .body-text p { margin: 0; }
    .body-text p + p { margin-top: 1.15em; }
    .body-text .hl { color: #c0fefd; font-weight: 700; }
    .logo-wrap {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 5;
      opacity: 0.98;
    }
    .logo-wrap img {
      display: block;
      width: auto;
      height: auto;
      max-width: 200px;
      object-fit: contain;
    }
    .bottom-strip {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0.5% 5% 0.65%;
      z-index: 5;
      text-align: left;
      background: linear-gradient(180deg, transparent 0%, rgba(21, 10, 28, 0.9) 45%, #150a1c 100%);
    }
    .bottom-strip .handle {
      font-family: 'Montserrat', sans-serif;
      font-size: 24px;
      font-weight: 600;
      color: rgba(255,255,255,0.82);
      letter-spacing: 0.04em;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="bg-full" aria-hidden="true"></div>
    <div class="gradient-overlay" aria-hidden="true"></div>
    ${getLogoHtml()}
    <div class="swipe-hint">ARRASTE →</div>
    <div class="center-wrap">
      <div class="slide2-text-modal">
        <div class="content">
          <h2 class="slide-headline">${headlineHtml}</h2>
          <div class="body-text">
          ${bodyInner}
          </div>
        </div>
      </div>
    </div>
    <footer class="bottom-strip">
      <div class="handle">${esc(SOCIAL_HANDLE)}</div>
    </footer>
  </div>
</body>
</html>`;
}

function slideDocument(slides, index, outDir) {
  const slide = slides[index];
  // Prefer a content-specific cover image saved by Diana before the build run.
  // Expected path: output/<run>/design/<post-key>/cover-image.png
  // Falls back to the generic ai-brain-glow.png asset if not found.
  const customCoverAbs = path.join(outDir, "..", "cover-image.png");
  const defaultCoverAbs = path.join(SQUAD_DIR, "assets", "ai-brain-glow.png");
  const bgAbs = fs.existsSync(customCoverAbs) ? customCoverAbs : defaultCoverAbs;
  if (!fs.existsSync(bgAbs)) {
    console.warn("Missing hero asset (using solid fallback path):", bgAbs);
  } else if (bgAbs === customCoverAbs) {
    console.log("Using custom cover image:", bgAbs);
  }
  const bgUrl = path.relative(outDir, bgAbs).split(path.sep).join("/");
  if (index === 0) {
    // Company logo: if the news mentions a specific company, Diana saves
    // company-logo.png at output/<run>/design/<post-key>/company-logo.png
    const companyLogoAbs = path.join(outDir, "..", "company-logo.png");
    let companyLogoUrl = null;
    if (fs.existsSync(companyLogoAbs)) {
      const b64 = fs.readFileSync(companyLogoAbs).toString("base64");
      companyLogoUrl = `data:image/png;base64,${b64}`;
      console.log("Using company logo:", companyLogoAbs);
    }
    return coverSlideHtml(slide, bgUrl || "about:blank", companyLogoUrl);
  }
  // Slide 2: imagem de fundo + overlay escuro + texto denso
  if (index === 1) {
    // Tenta usar slide2-image.png; fallback para cover-image.png; depois ai-brain-glow.png
    const slide2ImageAbs = path.join(outDir, "..", "slide2-image.png");
    const slide2Bg = fs.existsSync(slide2ImageAbs) ? slide2ImageAbs : bgAbs;
    const slide2BgUrl = path.relative(outDir, slide2Bg).split(path.sep).join("/");
    console.log("Slide 2 bg image:", slide2Bg);
    return contentWithImageSlideHtml(slide, slide2BgUrl || "about:blank");
  }
  return contentSlideHtml(slide);
}

async function renderFolder(slidesDir) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1440 },
    deviceScaleFactor: 1,
  });
  const files = fs.readdirSync(slidesDir).filter((f) => f.endsWith(".html")).sort();
  for (const f of files) {
    const htmlPath = path.join(slidesDir, f);
    const pngPath = path.join(slidesDir, f.replace(".html", ".png"));
    const url = `file://${htmlPath}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1080, height: 1440 } });
    console.log("OK", pngPath);
  }
  await browser.close();
}

const argv = process.argv.slice(2);
const PNG_ONLY = argv.includes("--png-only");
const runArg = argv.find((a) => a !== "--png-only");
const RUN_DIR = resolveRunDir(runArg);

(async () => {
  console.log("RUN_DIR:", RUN_DIR);
  if (PNG_ONLY) console.log("Modo: --png-only (apenas PNG a partir dos HTML existentes)");
  if (!PNG_ONLY) {
    for (const post of POSTS) {
      const mdPath = path.join(RUN_DIR, post.md);
      if (!fs.existsSync(mdPath)) {
        console.warn("Skip (missing):", mdPath);
        continue;
      }
      const md = fs.readFileSync(mdPath, "utf8");
      const slides = parseSlides(md);
      if (slides.length === 0) throw new Error("Nenhum slide em " + post.md);
      const outDir = path.join(RUN_DIR, "design", post.key, "slides");
      fs.mkdirSync(outDir, { recursive: true });
      slides.forEach((_, i) => {
        const n = String(i + 1).padStart(2, "0");
        const html = slideDocument(slides, i, outDir);
        fs.writeFileSync(path.join(outDir, `slide-${n}.html`), html, "utf8");
      });
      console.log("Wrote", slides.length, "HTML to", outDir);
    }
  }
  for (const post of POSTS) {
    const slidesDir = path.join(RUN_DIR, "design", post.key, "slides");
    if (!fs.existsSync(slidesDir)) continue;
    await renderFolder(slidesDir);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
