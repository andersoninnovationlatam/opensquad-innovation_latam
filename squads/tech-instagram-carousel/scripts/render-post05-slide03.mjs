/**
 * Builds and renders only slide-03 of post-05-inspiracional
 * with the new editorial layout.
 *
 * Usage (from repo root):
 *   node squads/tech-instagram-carousel/scripts/render-post05-slide03.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQUAD_DIR = path.resolve(__dirname, "..");
const SLIDES_DIR = path.join(
  SQUAD_DIR,
  "output/2026-04-01-093432/design/post-05-inspiracional/slides"
);
const LOGO_PNG = path.join(SQUAD_DIR, "assets/innovation-latam-logo-white.png");

function buildLogoHtml() {
  if (fs.existsSync(LOGO_PNG)) {
    const b64 = fs.readFileSync(LOGO_PNG).toString("base64");
    return `<img src="data:image/png;base64,${b64}" alt="Innovation Latam" height="36" />`;
  }
  return `<span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:0.06em;">INNOVATION LATAM</span>`;
}

const logoHtml = buildLogoHtml();

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }

    .slide {
      position: relative;
      width: 1080px;
      height: 1440px;
      overflow: hidden;
      font-family: 'Montserrat', system-ui, sans-serif;
      color: #fff;
    }

    /* ── BACKGROUND ── */
    .bg-image {
      position: absolute;
      inset: 0;
      background: #07040f;
    }
    .bg-image svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg,
        rgba(8, 4, 20, 0.82) 0%,
        rgba(28, 8, 48, 0.80) 50%,
        rgba(12, 8, 28, 0.82) 100%);
    }
    .bg-blur {
      position: absolute;
      inset: 0;
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
    }

    /* ── LOGO ── */
    .logo-wrap {
      position: absolute;
      top: 36px;
      left: 80px;
      z-index: 10;
    }
    .logo-wrap img {
      height: 36px;
      width: auto;
      max-width: 200px;
      display: block;
    }

    /* ── SWIPE HINT ── */
    .swipe-hint {
      position: absolute;
      right: 80px;
      bottom: 120px;
      z-index: 10;
      font-size: 20px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.38);
      letter-spacing: 0.06em;
    }

    /* ── CONTENT WRAPPER ── */
    .content-wrap {
      position: absolute;
      left: 80px;
      right: 80px;
      top: 140px;
      bottom: 170px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 5;
    }

    /* ── GLASS CARD ── */
    .glass-card {
      background: rgba(8, 4, 22, 0.52);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 64px 72px 60px;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.45);
    }

    /* ── PILL ── */
    .pill {
      display: block;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.42);
      margin-bottom: 36px;
    }

    /* ── HEADLINE (Montserrat Bold) ── */
    .headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 70px;
      font-weight: 700;
      line-height: 0.9;
      color: #fff;
      margin-bottom: 36px;
      text-align: left;
    }
    .headline .hl {
      color: #f5c438;
      font-weight: 800;
    }

    /* ── DIVIDER LINE ── */
    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg,
        #f5c438 0%,
        rgba(153, 60, 177, 0.65) 40%,
        rgba(255, 255, 255, 0.04) 100%);
      margin-bottom: 36px;
      border: none;
    }

    /* ── BODY TEXT ── */
    .body-text {
      font-family: 'Montserrat', system-ui, sans-serif;
      font-size: 22px;
      font-weight: 400;
      line-height: 1.4;
      color: #c0bfd0;
      max-width: 594px;
      text-align: left;
    }
    .body-text .hl {
      color: #f5c438;
      font-weight: 600;
    }

    /* ── FOOTER ── */
    .bottom-strip {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 32px 80px 40px;
      z-index: 10;
      background: linear-gradient(180deg,
        transparent 0%,
        rgba(5, 2, 14, 0.96) 55%,
        rgba(5, 2, 14, 0.99) 100%);
    }
    .bottom-strip .handle {
      font-family: 'Montserrat', system-ui, sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.68);
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="slide">

    <!-- BACKGROUND: neural network / digital brain pattern -->
    <div class="bg-image">
      <svg viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <rect width="1080" height="1440" fill="#07040f"/>
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#7c22ce" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#7c22ce" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4338ca" stop-opacity="0.32"/>
            <stop offset="100%" stop-color="#4338ca" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="g3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#6d28d9" stop-opacity="0.38"/>
            <stop offset="100%" stop-color="#6d28d9" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="g4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f5c438" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#f5c438" stop-opacity="0"/>
          </radialGradient>
          <filter id="blur-node">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>
        <ellipse cx="820" cy="260" rx="420" ry="340" fill="url(#g1)"/>
        <ellipse cx="160" cy="820" rx="360" ry="420" fill="url(#g2)"/>
        <ellipse cx="750" cy="1150" rx="400" ry="300" fill="url(#g3)"/>
        <ellipse cx="540" cy="560" rx="200" ry="200" fill="url(#g4)"/>
        <g stroke="rgba(99,102,241,0.10)" stroke-width="0.6" fill="none">
          <line x1="0" y1="360" x2="1080" y2="360"/>
          <line x1="0" y1="720" x2="1080" y2="720"/>
          <line x1="0" y1="1080" x2="1080" y2="1080"/>
          <line x1="270" y1="0" x2="270" y2="1440"/>
          <line x1="540" y1="0" x2="540" y2="1440"/>
          <line x1="810" y1="0" x2="810" y2="1440"/>
        </g>
        <g stroke="rgba(139,92,246,0.28)" stroke-width="1.2" fill="none">
          <line x1="100" y1="160" x2="320" y2="275"/>
          <line x1="320" y1="275" x2="560" y2="195"/>
          <line x1="560" y1="195" x2="800" y2="320"/>
          <line x1="800" y1="320" x2="970" y2="155"/>
          <line x1="100" y1="160" x2="240" y2="430"/>
          <line x1="240" y1="430" x2="460" y2="500"/>
          <line x1="460" y1="500" x2="680" y2="395"/>
          <line x1="680" y1="395" x2="800" y2="320"/>
          <line x1="680" y1="395" x2="940" y2="470"/>
          <line x1="460" y1="500" x2="300" y2="660"/>
          <line x1="300" y1="660" x2="530" y2="720"/>
          <line x1="530" y1="720" x2="760" y2="630"/>
          <line x1="760" y1="630" x2="940" y2="470"/>
          <line x1="760" y1="630" x2="880" y2="800"/>
          <line x1="300" y1="660" x2="160" y2="830"/>
          <line x1="160" y1="830" x2="400" y2="930"/>
          <line x1="400" y1="930" x2="630" y2="850"/>
          <line x1="630" y1="850" x2="880" y2="800"/>
          <line x1="400" y1="930" x2="260" y2="1080"/>
          <line x1="260" y1="1080" x2="480" y2="1160"/>
          <line x1="480" y1="1160" x2="710" y2="1060"/>
          <line x1="710" y1="1060" x2="880" y2="800"/>
          <line x1="480" y1="1160" x2="330" y2="1310"/>
          <line x1="330" y1="1310" x2="580" y2="1370"/>
          <line x1="580" y1="1370" x2="800" y2="1260"/>
          <line x1="800" y1="1260" x2="710" y2="1060"/>
          <line x1="320" y1="275" x2="460" y2="500"/>
          <line x1="560" y1="195" x2="680" y2="395"/>
          <line x1="240" y1="430" x2="300" y2="660"/>
          <line x1="530" y1="720" x2="630" y2="850"/>
          <line x1="630" y1="850" x2="710" y2="1060"/>
          <line x1="940" y1="470" x2="960" y2="640"/>
          <line x1="960" y1="640" x2="880" y2="800"/>
        </g>
        <g fill="rgba(167,139,250,0.72)" filter="url(#blur-node)">
          <circle cx="100" cy="160" r="5"/>
          <circle cx="320" cy="275" r="6"/>
          <circle cx="560" cy="195" r="5"/>
          <circle cx="800" cy="320" r="7"/>
          <circle cx="970" cy="155" r="4"/>
          <circle cx="240" cy="430" r="6"/>
          <circle cx="460" cy="500" r="8"/>
          <circle cx="680" cy="395" r="6"/>
          <circle cx="940" cy="470" r="5"/>
          <circle cx="300" cy="660" r="7"/>
          <circle cx="530" cy="720" r="9"/>
          <circle cx="760" cy="630" r="6"/>
          <circle cx="160" cy="830" r="5"/>
          <circle cx="400" cy="930" r="8"/>
          <circle cx="630" cy="850" r="7"/>
          <circle cx="880" cy="800" r="6"/>
          <circle cx="260" cy="1080" r="6"/>
          <circle cx="480" cy="1160" r="8"/>
          <circle cx="710" cy="1060" r="7"/>
          <circle cx="800" cy="1260" r="5"/>
          <circle cx="330" cy="1310" r="6"/>
          <circle cx="580" cy="1370" r="7"/>
          <circle cx="960" cy="640" r="5"/>
        </g>
        <g fill="rgba(245,196,56,0.75)">
          <circle cx="530" cy="720" r="4"/>
          <circle cx="800" cy="320" r="5"/>
          <circle cx="460" cy="500" r="4"/>
          <circle cx="710" cy="1060" r="4"/>
        </g>
        <g fill="rgba(196,181,253,0.9)">
          <circle cx="100" cy="160" r="3"/>
          <circle cx="320" cy="275" r="3.5"/>
          <circle cx="560" cy="195" r="3"/>
          <circle cx="800" cy="320" r="4"/>
          <circle cx="240" cy="430" r="3.5"/>
          <circle cx="460" cy="500" r="4.5"/>
          <circle cx="680" cy="395" r="3.5"/>
          <circle cx="300" cy="660" r="4"/>
          <circle cx="530" cy="720" r="5"/>
          <circle cx="760" cy="630" r="3.5"/>
          <circle cx="400" cy="930" r="4.5"/>
          <circle cx="630" cy="850" r="4"/>
          <circle cx="480" cy="1160" r="4.5"/>
          <circle cx="710" cy="1060" r="4"/>
        </g>
      </svg>
    </div>

    <div class="bg-overlay"></div>
    <div class="bg-blur"></div>

    <div class="logo-wrap">${logoHtml}</div>

    <div class="swipe-hint">ARRASTE →</div>

    <div class="content-wrap">
      <div class="glass-card">
        <span class="pill">Carrossel 05 · 3/9</span>
        <h1 class="headline">
          Menos horas<br>
          repetindo;<br>
          mais <span class="hl">decisão</span>
        </h1>
        <hr class="divider">
        <p class="body-text">
          Quando modelos entendem melhor contexto, times gastam menos energia corrigindo mal-entendidos e mais energia em <span class="hl">priorização</span> e validação com stakeholders. Para produto, especificações mais fiéis. Para conteúdo, consistência de tom. Para dados, interpretações mais estáveis. O ganho não é preguiça; é <span class="hl">foco</span>.
        </p>
      </div>
    </div>

    <footer class="bottom-strip">
      <div class="handle">@innovationlatam</div>
    </footer>
  </div>
</body>
</html>`;

const HTML_PATH = path.join(SLIDES_DIR, "slide-03.html");
const PNG_PATH = path.join(SLIDES_DIR, "slide-03.png");

fs.writeFileSync(HTML_PATH, html, "utf8");
console.log("Wrote HTML:", HTML_PATH);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1440 },
  deviceScaleFactor: 1,
});
await page.goto(`file://${HTML_PATH}`, { waitUntil: "networkidle", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: PNG_PATH, clip: { x: 0, y: 0, width: 1080, height: 1440 } });
console.log("Rendered PNG:", PNG_PATH);
await browser.close();
