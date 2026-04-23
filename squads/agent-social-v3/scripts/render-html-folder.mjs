/**
 * Renderiza todos os slide-*.html de uma pasta para PNG 1080×1350 (4:5, Playwright).
 * Uso (na raiz do repo):
 *   node squads/agent-social-v3/scripts/render-html-folder.mjs <abs-or-rel-path-to-slides-folder>
 */
import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: node render-html-folder.mjs <slides-directory>");
  process.exit(1);
}

const slidesDir = path.isAbsolute(arg) ? arg : path.resolve(REPO_ROOT, arg);
const outDir = path.join(slidesDir, "rendered");
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(slidesDir).filter((f) => /^slide-\d+\.html$/.test(f)).sort();

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });
  for (const f of files) {
    const htmlPath = path.join(slidesDir, f);
    const url = `file://${htmlPath}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 1500));
    const pngPath = path.join(outDir, f.replace(".html", ".png"));
    await page.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width: 1080, height: 1350 },
    });
    console.log("OK", pngPath);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
