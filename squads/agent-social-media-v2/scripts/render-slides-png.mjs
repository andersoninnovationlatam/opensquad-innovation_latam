/**
 * Renderiza slide-*.html → rendered/slide-*.png (1080×1350) com Playwright.
 * Uso (raiz do repo):
 *   node squads/agent-social-media-v2/scripts/render-slides-png.mjs squads/agent-social-media-v2/output/2026-04-06-195850/slides/v1
 */
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const slidesDir = process.argv[2];
if (!slidesDir) {
  console.error("Usage: node render-slides-png.mjs <path-to-slides-v1>");
  process.exit(1);
}

const abs = path.resolve(slidesDir);
const rendered = path.join(abs, "rendered");
fs.mkdirSync(rendered, { recursive: true });

const files = fs.readdirSync(abs).filter((f) => /^slide-\d+\.html$/.test(f)).sort();

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 1,
});

for (const f of files) {
  const htmlPath = path.join(abs, f);
  const url = `file://${htmlPath}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  const pngPath = path.join(rendered, f.replace(".html", ".png"));
  await page.screenshot({
    path: pngPath,
    clip: { x: 0, y: 0, width: 1080, height: 1350 },
  });
  console.log("OK", pngPath);
}

await browser.close();
console.log("Rendered", files.length, "slides.");
