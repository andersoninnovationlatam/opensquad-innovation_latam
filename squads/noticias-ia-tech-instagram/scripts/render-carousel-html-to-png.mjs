#!/usr/bin/env node
/**
 * 1) Lê instagram-draft.md (roteiro de slides)
 * 2) Gera slide-NN.html (estilo alinhado a pipeline/assets/examples/)
 * 3) Converte cada HTML em PNG 1080×1440 com Playwright (Chromium)
 *
 * Uso (a partir da raiz do repo):
 *   node squads/noticias-ia-tech-instagram/scripts/render-carousel-html-to-png.mjs \
 *     --draft squads/noticias-ia-tech-instagram/output/RUN/v3/instagram-draft.md \
 *     --png-out squads/noticias-ia-tech-instagram/output/RUN/carousel-package/v1
 *
 * Requer: npm install && npx playwright install chromium
 *
 * Ilustrações: array DEFAULT_ILLUSTRATIONS (Unsplash) — uma URL por slide;
 * fundo com gradientes/scrims para legibilidade. Ajustar URLs por pauta.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQUAD_DIR = path.join(__dirname, '..');
/** Única fonte canónica: squads/noticias-ia-tech-instagram/pipeline/assets/innovation-latam-logo.png */
const LOGO_SRC = path.join(SQUAD_DIR, 'pipeline', 'assets', 'innovation-latam-logo.png');

/**
 * Ilustrações de fundo (Unsplash) — uma por slide; temas saúde / IA / pesquisa / equipas.
 * Sempre combinadas com scrims no HTML para o texto não competir com a imagem.
 * Para outra pauta: editar URLs ou passar ficheiro JSON futuro.
 */
const DEFAULT_ILLUSTRATIONS = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1080&h=1440&q=85',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1080&h=1440&q=85',
];

function illustrationForSlide(n) {
  const i = Math.min(Math.max(n - 1, 0), DEFAULT_ILLUSTRATIONS.length - 1);
  return DEFAULT_ILLUSTRATIONS[i];
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseSlides(md) {
  const chunks = md.split(/\n(?=### Slide \d+ —)/).filter((c) => /### Slide \d+ —/.test(c));
  if (chunks.length === 0) throw new Error('Roteiro: nenhum bloco ### Slide encontrado');
  return chunks
    .map((block) => {
      const n = parseInt(block.match(/### Slide (\d+)/)[1], 10);
      const headline = block.match(/\*\*Headline:\*\*\s*(.+)/)?.[1]?.trim() ?? '';
      const bm = block.match(/\*\*Body:\*\*\s*([\s\S]+?)(?=\n\*\*Fonte:\*\*|\n### Slide|$)/);
      const body = bm ? bm[1].trim() : '';
      const fonte = block.match(/\*\*Fonte:\*\*\s*(.+)/)?.[1]?.trim();
      return { n, headline, body, fonte };
    })
    .sort((a, b) => a.n - b.n);
}

function textDensityClass(headline, body) {
  const len = headline.length + body.length;
  if (len > 480) return 'text-density--long';
  if (len > 260) return 'text-density--medium';
  return 'text-density--short';
}

/**
 * Com imagem de fundo: texto na parte inferior, centrado horizontalmente, com faixa de contraste.
 * Sem imagem (imageUrl vazio): texto centrado no cartão com fundo sólido/contraste.
 * Não inclui fonte da notícia nem tags entre colchetes. @innovationlatam sempre no canto inferior direito.
 */
function slideHtml({ headline, body, imageUrl, isCover }) {
  const bg = escapeHtml(imageUrl);
  const hasImage = Boolean(imageUrl && imageUrl.trim());
  const density = textDensityClass(headline, body);
  const logoW = isCover ? 280 : 260;
  const hTag = isCover ? 'h1' : 'h2';

  const bottomBand = `
    <div class="bottom-gradient" aria-hidden="true"></div>
    <div class="text-zone text-zone--bottom">
      <div class="text-block ${density}">
        <${hTag} class="headline">${escapeHtml(headline)}</${hTag}>
        <p class="body">${escapeHtml(body)}</p>
      </div>
    </div>`;

  const centerBlock = `
    <div class="text-zone text-zone--center">
      <div class="text-panel ${density}">
        <${hTag} class="headline">${escapeHtml(headline)}</${hTag}>
        <p class="body">${escapeHtml(body)}</p>
      </div>
    </div>`;

  const bgLayer = hasImage
    ? `<div class="bg-photo" style="background-image:url('${bg}')" role="img" aria-label=""></div>
       <div class="scrim-light" aria-hidden="true"></div>`
    : `<div class="bg-solid" aria-hidden="true"></div>`;

  const mainContent = hasImage ? bottomBand : centerBlock;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=1080"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body.canvas {
      width: 1080px; height: 1440px;
      font-family: 'Poppins', system-ui, sans-serif;
      color: #f5f5f5;
      overflow: hidden;
      position: relative;
      background: #111;
    }
    .bg-photo {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      z-index: 0;
    }
    .scrim-light {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,.5) 100%);
      z-index: 1;
      pointer-events: none;
    }
    .bg-solid {
      position: absolute; inset: 0;
      background: linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 50%, #141414 100%);
      z-index: 0;
    }
    .logo {
      position: absolute; top: 40px; left: 40px;
      width: ${logoW}px; height: auto; z-index: 6;
      filter: drop-shadow(0 2px 10px rgba(0,0,0,.85));
    }
    .handle {
      position: absolute; bottom: 36px; right: 44px; z-index: 8;
      font-size: 22px; font-weight: 600;
      color: #fafafa;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-shadow: 0 2px 14px rgba(0,0,0,.95);
    }
    .bottom-gradient {
      position: absolute; left: 0; right: 0; bottom: 0; height: 58%; z-index: 2;
      background: linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.75) 45%, rgba(0,0,0,.2) 85%, transparent 100%);
      pointer-events: none;
    }
    .text-zone--bottom {
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 5;
      display: flex; justify-content: flex-start; align-items: flex-end;
      padding: 32px 48px 128px;
      pointer-events: none;
    }
    .text-zone--bottom .text-block {
      width: 100%; max-width: 920px; text-align: left;
      pointer-events: none;
    }
    .text-zone--center {
      position: absolute; inset: 0; z-index: 5;
      display: flex; align-items: center; justify-content: center;
      padding: 120px 56px 120px;
    }
    .text-panel {
      max-width: 900px; width: 100%;
      text-align: left;
      padding: 48px 44px;
      background: rgba(0,0,0,.72);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0,0,0,.55);
    }
    .headline {
      font-family: 'Poppins', system-ui, sans-serif;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #fff;
      line-height: 1.25;
      text-shadow: 0 3px 24px rgba(0,0,0,.9);
    }
    .body {
      margin-top: 20px;
      font-family: 'Poppins', system-ui, sans-serif;
      color: #e8e8e8;
      font-weight: 400;
      line-height: 1.48;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-shadow: 0 2px 16px rgba(0,0,0,.85);
    }
    .text-density--short .headline { font-size: clamp(32px, 4.2vw, 46px); }
    .text-density--short .body { font-size: clamp(20px, 2.5vw, 26px); }
    .text-density--medium .headline { font-size: clamp(28px, 3.6vw, 40px); }
    .text-density--medium .body { font-size: clamp(18px, 2.2vw, 24px); }
    .text-density--long .headline { font-size: clamp(24px, 3vw, 34px); }
    .text-density--long .body { font-size: clamp(16px, 2vw, 21px); }
    .text-density--long .body { max-height: 520px; overflow: hidden; }
  </style>
</head>
<body class="canvas">
  ${bgLayer}
  <img class="logo" src="logo.png" width="${logoW}" alt="Innovation Latam"/>
  ${mainContent}
  <div class="handle">@innovationlatam</div>
</body>
</html>`;
}

async function main() {
  const args = process.argv.slice(2);
  let draftPath = '';
  let pngOut = '';
  let htmlOnly = false;
  let noIllustrations = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--draft') draftPath = args[++i];
    else if (args[i] === '--png-out') pngOut = args[++i];
    else if (args[i] === '--html-only') htmlOnly = true;
    else if (args[i] === '--no-illustrations') noIllustrations = true;
  }
  if (!draftPath || !pngOut) {
    console.error(
      'Uso: node render-carousel-html-to-png.mjs --draft <instagram-draft.md> --png-out <pasta> [--html-only] [--no-illustrations]',
    );
    process.exit(1);
  }

  draftPath = path.resolve(draftPath);
  const md = await fs.readFile(draftPath, 'utf8');
  const slides = parseSlides(md);
  if (slides.length === 0) throw new Error('Nenhum slide parseado');

  const htmlDir = path.resolve(path.join(pngOut, 'html'));
  const pngOutAbs = path.resolve(pngOut);
  await fs.mkdir(htmlDir, { recursive: true });
  await fs.copyFile(LOGO_SRC, path.join(htmlDir, 'logo.png'));

  const total = slides.length;
  for (const s of slides) {
    const isCover = s.n === 1;
    const imageUrl = noIllustrations ? '' : illustrationForSlide(s.n);
    const html = slideHtml({ headline: s.headline, body: s.body, imageUrl, isCover });
    const name = `slide-${String(s.n).padStart(2, '0')}.html`;
    await fs.writeFile(path.join(htmlDir, name), html, 'utf8');
    console.log('wrote', path.join(htmlDir, name));
  }

  if (htmlOnly) {
    console.log('Só HTML; ignorar PNG.');
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
  for (const s of slides) {
    const name = `slide-${String(s.n).padStart(2, '0')}`;
    const filePath = path.resolve(path.join(htmlDir, `${name}.html`));
    const fileUrl = pathToFileURL(filePath).href;
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({
      path: path.join(pngOutAbs, `${name}.png`),
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1440 },
    });
    console.log('png', path.join(pngOutAbs, `${name}.png`));
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
