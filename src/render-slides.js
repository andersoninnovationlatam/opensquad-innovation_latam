import { chromium } from 'playwright';
import path from 'node:path';
import { promises as fs } from 'node:fs';

async function render() {
    const args = process.argv.slice(2);
    const slidesDir = args[0];

    if (!slidesDir) {
        console.error('Usage: node render-slides.js <slides-dir>');
        process.exit(1);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1350 });

    const files = await fs.readdir(slidesDir);
    const htmlFiles = files.filter(f => f.endsWith('.html')).sort();

    for (const file of htmlFiles) {
        const htmlPath = path.join(slidesDir, file);
        const pngPath = htmlPath.replace('.html', '.png');

        console.log(`🖼️ Rendering ${file}...`);
        // Use file:// protocol for local files
        await page.goto(`file://${path.resolve(htmlPath)}`, { waitUntil: 'networkidle' });
        // Wait for fonts and images to load
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

    await browser.close();
    console.log('✅ Rendering complete!');
}

render().catch(console.error);
