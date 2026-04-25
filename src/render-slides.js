import { chromium } from 'playwright';
import path from 'node:path';
import { promises as fs, openSync, closeSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const LOCK_FILE = path.join(ROOT_DIR, '.chromium.lock');
const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes max wait
const LOCK_POLL_MS = 2000;

async function acquireLock() {
    const deadline = Date.now() + LOCK_TIMEOUT_MS;
    while (Date.now() < deadline) {
        try {
            // Check if an existing lock is stale (process died without releasing)
            if (existsSync(LOCK_FILE)) {
                const content = await fs.readFile(LOCK_FILE, 'utf-8').catch(() => '0');
                const lockedAt = parseInt(content, 10);
                if (Date.now() - lockedAt > LOCK_TIMEOUT_MS) {
                    await fs.unlink(LOCK_FILE).catch(() => {});
                }
            }
            // O_EXCL makes this atomic — only one process succeeds
            const fd = openSync(LOCK_FILE, 'wx');
            closeSync(fd);
            await fs.writeFile(LOCK_FILE, String(Date.now()));
            return true;
        } catch {
            // Lock held by another process — wait and retry
            console.log(`⏳ Waiting for Chromium lock (another render in progress)...`);
            await new Promise(r => setTimeout(r, LOCK_POLL_MS));
        }
    }
    return false;
}

async function releaseLock() {
    await fs.unlink(LOCK_FILE).catch(() => {});
}

async function render() {
    const args = process.argv.slice(2);
    const slidesDir = args[0];

    if (!slidesDir) {
        console.error('Usage: node render-slides.js <slides-dir>');
        process.exit(1);
    }

    const acquired = await acquireLock();
    if (!acquired) {
        console.error('❌ Could not acquire Chromium lock after 5 minutes. Aborting render.');
        process.exit(1);
    }

    let browser;
    try {
        browser = await chromium.launch();
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1080, height: 1350 });

        const files = await fs.readdir(slidesDir);
        const htmlFiles = files.filter(f => f.endsWith('.html')).sort();

        for (const file of htmlFiles) {
            const htmlPath = path.join(slidesDir, file);
            const pngPath = htmlPath.replace('.html', '.png');

            console.log(`🖼️ Rendering ${file}...`);
            await page.goto(`file://${path.resolve(htmlPath)}`, { waitUntil: 'networkidle' });
            await page.evaluateHandle(() => document.fonts.ready);
            await page.evaluate(async () => {
                const selectors = Array.from(document.querySelectorAll('img'));
                await Promise.all(selectors.map(img => {
                    if (img.complete) return;
                    return new Promise((resolve, reject) => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', reject);
                    });
                }));
            });
            await page.screenshot({ path: pngPath });
        }

        console.log('✅ Rendering complete!');
    } finally {
        if (browser) await browser.close();
        await releaseLock();
    }
}

render().catch(async (err) => {
    await releaseLock();
    console.error(err);
    process.exit(1);
});
