import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// ── Load Env ──────────────────────────────────────────────────────────────────
async function loadEnv() {
    const envPath = path.join(ROOT_DIR, '.env');
    let env = { ...process.env };
    try {
        const content = await fs.readFile(envPath, 'utf-8');
        const dotenv = content.split('\n').reduce((acc, line) => {
            const [key, ...val] = line.split('=');
            if (key && val.length > 0) acc[key.trim()] = val.join('=').trim().replace(/^['"]|['"]$/g, '');
            return acc;
        }, {});
        env = { ...dotenv, ...env }; // process.env takes precedence
    } catch {
        // .env not found, using process.env only
    }
    return env;
}

// ── OpenRouter API ────────────────────────────────────────────────────────────
async function callOpenRouter(prompt, model, apiKey) {
    console.log(`🤖 Calling LLM (${model})...`);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/renatoasse/opensquad',
            'X-Title': 'OpenSquad Headless Runner'
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter API error: ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ── Bruno: Image Research (script-based, not LLM) ─────────────────────────────
async function runBrunoImageSearch(squadDir, runDir, env) {
    const extractScript = path.join(squadDir, 'scripts', 'extract-topics.mjs');
    const searchScript = path.join(squadDir, 'scripts', 'search-reference-images.mjs');

    console.log('🔍 Running extract-topics.mjs (parsing === ENTIDADES === block)...');
    const extractResult = spawnSync('node', [extractScript, runDir], {
        cwd: ROOT_DIR,
        stdio: 'inherit',
        env: { ...process.env, ...env }
    });
    if (extractResult.status !== 0) {
        throw new Error(`extract-topics.mjs failed with exit ${extractResult.status}`);
    }

    // Skip search if topics.json has no entities
    const topicsPath = path.join(runDir, 'topics.json');
    try {
        const topics = JSON.parse(await fs.readFile(topicsPath, 'utf-8'));
        if (!Array.isArray(topics.entities) || topics.entities.length === 0) {
            console.log('ℹ️ Nenhuma entidade declarada — Bruno encerra sem downloads.');
            const imagesDir = path.join(runDir, 'images');
            await fs.mkdir(imagesDir, { recursive: true });
            await fs.writeFile(
                path.join(imagesDir, 'index.json'),
                JSON.stringify({ generated_at: new Date().toISOString(), images: [], pending_manual_download: [] }, null, 2)
            );
            return;
        }
    } catch (err) {
        throw new Error(`Could not read topics.json: ${err.message}`);
    }

    console.log('🌐 Running search-reference-images.mjs (SerpAPI Google Images)...');
    const searchResult = spawnSync('node', [searchScript, runDir], {
        cwd: ROOT_DIR,
        stdio: 'inherit',
        env: { ...process.env, ...env }
    });
    if (searchResult.status !== 0) {
        console.warn(`⚠️ search-reference-images.mjs exited with ${searchResult.status} — continuing (Diana will fallback to AI)`);
    }
    console.log('✅ Bruno image search complete');
}

// ── Helpers for render: find Bruno's reference + build HTML ───────────────────
async function findBrunoReference(imagesDir, slideNumber) {
    const slideLabel = String(slideNumber).padStart(2, '0');
    for (const ext of ['.webp', '.png', '.jpg', '.jpeg']) {
        const candidate = path.join(imagesDir, `slide-${slideLabel}-ref${ext}`);
        try {
            await fs.access(candidate);
            return { path: candidate, ext };
        } catch {}
    }
    return null;
}

async function readBrunoIndex(imagesDir) {
    try {
        const data = await fs.readFile(path.join(imagesDir, 'index.json'), 'utf-8');
        return JSON.parse(data);
    } catch {
        return { images: [] };
    }
}

function buildSlideHtml({ slide, isOdd, isLast, bgPath, bgEntityType, logoPath }) {
    const headline = (slide.headline || '').replace(/"/g, '&quot;');
    const supporting = (slide.text || '').replace(/"/g, '&quot;');
    const cta = (slide.cta || '').replace(/"/g, '&quot;');

    if (!isOdd) {
        // Even slides: solid #993CB1, white text, no overlay/scrim
        return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      position: relative;
      background-color: #993CB1;
      color: #FFFFFF;
    }
    .content {
      position: absolute;
      top: 50%; left: 0; right: 0;
      transform: translateY(-50%);
      padding: 80px;
      max-width: 1000px;
    }
    h1 { font-size: 48px; font-weight: 700; line-height: 1.2; margin-bottom: 28px; letter-spacing: -0.5px; }
    p { font-size: 32px; font-weight: 500; line-height: 1.5; opacity: 0.95; }
    .cta { font-size: 36px; font-weight: 700; margin-top: 40px; }
    .branding {
      position: absolute; bottom: 44px; right: 56px;
      display: flex; align-items: center; gap: 14px;
    }
    .branding img { height: 36px; width: auto; }
    .handle { font-size: 24px; font-weight: 500; color: rgba(255,255,255,0.85); }
  </style>
</head>
<body>
  <div class="content">
    <h1>${headline}</h1>
    ${supporting ? `<p>${supporting}</p>` : ''}
    ${isLast && cta ? `<div class="cta">${cta}</div>` : ''}
  </div>
  <div class="branding">
    <img src="file://${logoPath}" alt="Innovation Latam" />
    <span class="handle">@innovationlatam</span>
  </div>
</body>
</html>`;
    }

    // Odd slides: image bg + .overlay + .text-scrim
    // For company/brand logos (typically transparent PNGs): centered <img> on dark bg
    // For photos (person/location/AI-generated): full-bleed background-image
    const isLogo = bgEntityType === 'company' || bgEntityType === 'brand';
    const bgUrl = `file://${bgPath}`;

    const bgLayer = isLogo
        ? `<img class="bg-logo" src="${bgUrl}" alt="" />`
        : '';
    const bgStyle = isLogo
        ? `background-color: #0a0a0a;`
        : `background-color: #0a0a0a; background-image: url('${bgUrl}'); background-size: cover; background-position: center;`;

    return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      position: relative;
      ${bgStyle}
    }
    .bg-logo {
      position: absolute;
      top: 18%; left: 50%;
      transform: translateX(-50%);
      width: 70%;
      height: auto;
      filter: invert(1) brightness(1.05);
      z-index: 1;
    }
    .overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%);
      z-index: 2;
    }
    .text-scrim {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 62%;
      background: linear-gradient(to top,
        rgba(0,0,0,0.92) 0%,
        rgba(0,0,0,0.78) 35%,
        rgba(0,0,0,0.45) 65%,
        transparent 100%);
      z-index: 3;
    }
    .content {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 80px;
      padding-bottom: 160px;
      z-index: 4;
      max-width: 920px;
    }
    h1 {
      font-size: 67px; font-weight: 700; color: #FFFFFF;
      line-height: 1.15; margin-bottom: 28px; letter-spacing: -0.5px;
    }
    p {
      font-size: 32px; font-weight: 500; color: rgba(255,255,255,0.85);
      line-height: 1.45;
    }
    .cta {
      font-size: 36px; font-weight: 700; color: #FFFFFF; margin-top: 32px;
    }
    .branding {
      position: absolute; bottom: 44px; right: 56px;
      display: flex; align-items: center; gap: 14px;
      z-index: 5;
    }
    .branding img { height: 36px; width: auto; }
    .handle { font-size: 24px; font-weight: 500; color: rgba(255,255,255,0.85); }
  </style>
</head>
<body>
  ${bgLayer}
  <div class="overlay"></div>
  <div class="text-scrim"></div>
  <div class="content">
    <h1>${headline}</h1>
    ${supporting ? `<p>${supporting}</p>` : ''}
    ${isLast && cta ? `<div class="cta">${cta}</div>` : ''}
  </div>
  <div class="branding">
    <img src="file://${logoPath}" alt="Innovation Latam" />
    <span class="handle">@innovationlatam</span>
  </div>
</body>
</html>`;
}

// ── Agent Context ─────────────────────────────────────────────────────────────
async function getAgentContext(squadDir, agentId) {
    const agentPath = path.join(squadDir, 'agents', `${agentId}.agent.md`);
    const content = await fs.readFile(agentPath, 'utf-8');

    // Add company context and squad memory
    const companyContext = await fs.readFile(path.join(ROOT_DIR, '_opensquad', '_memory', 'company.md'), 'utf-8').catch(() => '');
    const squadMemory = await fs.readFile(path.join(squadDir, '_memory', 'memories.md'), 'utf-8').catch(() => '');

    return `
AGENT DEFINITION:
${content}

COMPANY CONTEXT:
${companyContext}

SQUAD MEMORY:
${squadMemory}
`;
}

// ── Main Runner ───────────────────────────────────────────────────────────────
async function run() {
    console.log(`[runner] Process started at ${new Date().toISOString()}`);
    console.log(`[runner] Node version: ${process.version}`);
    console.log(`[runner] CWD: ${process.cwd()}`);
    console.log(`[runner] ROOT_DIR: ${ROOT_DIR}`);
    console.log(`[runner] Args: ${process.argv.slice(2).join(' ')}`);

    const env = await loadEnv();
    const apiKey = env.OPENROUTER_API_KEY;
    const contentModel = env.OPENROUTER_MODELS_CONTENT || 'openai/gpt-4o-mini';

    console.log(`[runner] OPENROUTER_API_KEY present: ${!!apiKey}`);
    console.log(`[runner] Model: ${contentModel}`);

    const args = process.argv.slice(2);
    const squadName = args[args.indexOf('--squad') + 1];
    const runId = args[args.indexOf('--runId') + 1];
    const startStep = parseInt(args[args.indexOf('--startStep') + 1] || '1');

    if (!squadName || !runId) {
        console.error(`[runner] FATAL: missing --squad or --runId arguments`);
        process.exit(1);
    }

    console.log(`🚀 Starting REAL headless run for squad: ${squadName}`);
    console.log(`📁 Run ID: ${runId}`);

    const squadDir = path.join(ROOT_DIR, 'squads', squadName);
    const pipelinePath = path.join(squadDir, 'pipeline', 'pipeline.yaml');

    console.log(`[runner] Squad dir: ${squadDir}`);
    console.log(`[runner] Pipeline path: ${pipelinePath}`);

    let pipeline;
    try {
        const pipelineContent = await fs.readFile(pipelinePath, 'utf-8');
        pipeline = parseYaml(pipelineContent);
        console.log(`[runner] Pipeline loaded: ${pipeline.steps.length} steps`);
    } catch (err) {
        console.error(`[runner] FATAL: could not load pipeline.yaml: ${err.message}`);
        process.exit(1);
    }

    const runDir = path.join(squadDir, 'output', runId);
    await fs.mkdir(runDir, { recursive: true });
    const statePath = path.join(runDir, 'state.json');

    let state = {
        squad: squadName,
        status: 'running',
        step: { current: startStep, total: pipeline.steps.length, label: 'Iniciando...' },
        updatedAt: new Date().toISOString()
    };

    // Write initial state immediately
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    try {
        for (let i = startStep - 1; i < pipeline.steps.length; i++) {
            const step = pipeline.steps[i];
            const stepFile = path.join(squadDir, 'pipeline', step.file);
            const stepContent = await fs.readFile(stepFile, 'utf-8');
            const stepMeta = parseYaml(stepContent.match(/^---\n([\s\S]*?)\n---/)[1]);

            let logMessage = `Agente ${stepMeta.agent} processando ${step.name}...`;
            console.log(`\n[Step ${step.step}/${pipeline.steps.length}] ${logMessage}`);

            state.step.current = step.step;
            state.step.label = logMessage;
            state.updatedAt = new Date().toISOString();
            await fs.writeFile(statePath, JSON.stringify(state, null, 2));

            // ─── Special: Bruno's image research is script-driven, NOT LLM ───
            if (step.name === 'pesquisa-imagens-referencia') {
                await runBrunoImageSearch(squadDir, runDir, env);
                console.log(`✓ Step ${step.step} completed`);
                continue;
            }

            // EXECUTION
            if (stepMeta.execution === 'subagent' || stepMeta.execution === 'inline') {
                const agentContext = await getAgentContext(squadDir, stepMeta.agent);

                // Read input files from Context Loading section and frontmatter
                let contextData = '';
                const contextFiles = [];

                // 1. From frontmatter
                if (stepMeta.inputFile) contextFiles.push(stepMeta.inputFile);

                // 2. From Context Loading section
                const contextSection = stepContent.match(/## Context Loading\n\nLoad these files before executing:\n([\s\S]*?)\n##/);
                if (contextSection) {
                    const matches = contextSection[1].matchAll(/- `(.+?)`/g);
                    for (const match of matches) contextFiles.push(match[1]);
                }

                for (const file of [...new Set(contextFiles)]) {
                    let filePath = file.replace('{run_id}', runId).replace('{squad}', squadName);

                    // If it's an output file but doesn't have runId, try to inject it
                    if (filePath.includes('/output/') && !filePath.includes(runId)) {
                        filePath = filePath.replace('/output/', `/output/${runId}/`);
                    }

                    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(ROOT_DIR, filePath);
                    try {
                        const data = await fs.readFile(fullPath, 'utf-8');
                        contextData += `\nFILE: ${file}\n---\n${data}\n---\n`;
                    } catch (err) {
                        console.warn(`⚠️ Could not load context file: ${file}`);
                    }
                }

                const prompt = `
${agentContext}

STEP INSTRUCTIONS:
${stepContent}

CONTEXT DATA:
${contextData}

Please perform the task described in the STEP INSTRUCTIONS. 
If the instructions ask to save a file, provide the content of that file clearly.
`;

                const output = await callOpenRouter(prompt, contentModel, apiKey);

                // Save output if specified
                if (stepMeta.outputFile) {
                    let outputPath = stepMeta.outputFile.replace('{run_id}', runId).replace('{squad}', squadName);

                    // If it's an output file but doesn't have runId, try to inject it
                    if (outputPath.includes('/output/') && !outputPath.includes(runId)) {
                        outputPath = outputPath.replace('/output/', `/output/${runId}/`);
                    }

                    let fullOutputPath = path.isAbsolute(outputPath) ? outputPath : path.join(ROOT_DIR, outputPath);

                    // If the output path is a directory (ends with /), save the LLM response as report.md inside it
                    if (fullOutputPath.endsWith('/') || fullOutputPath.endsWith('\\')) {
                        await fs.mkdir(fullOutputPath, { recursive: true });
                        fullOutputPath = path.join(fullOutputPath, 'report.md');
                    } else {
                        await fs.mkdir(path.dirname(fullOutputPath), { recursive: true });
                    }

                    // Extract content if the LLM wrapped it in code blocks
                    let cleanOutput = output;
                    const codeBlockMatch = output.match(/```(?:markdown|html|yaml|json)?\n([\s\S]*?)\n```/);
                    if (codeBlockMatch) cleanOutput = codeBlockMatch[1];

                    await fs.writeFile(fullOutputPath, cleanOutput);
                    console.log(`✓ Output saved to ${fullOutputPath}`);
                }
            } else {
                // For checkpoint steps or steps without agents
                console.log(`ℹ️ Step ${step.step} is a ${stepMeta.type || 'system'} step, skipping LLM call.`);
            }

            // Special handling for image generation step (Bruno-first policy)
            if (step.name === 'gerar-e-renderizar-slides') {
                console.log('🎨 Starting visual production (Bruno-first → AI fallback)...');

                const artBriefPath = path.join(runDir, 'art-brief.md');
                const artBrief = await fs.readFile(artBriefPath, 'utf-8').catch(() => '');
                const copyPath = path.join(runDir, 'carousel-copy.md');
                const copy = await fs.readFile(copyPath, 'utf-8').catch(() => '');

                // 1. Parse carousel-copy.md for slide text
                const slides = [];
                const copyBlocks = copy.split(/Slide \d+/);
                for (let j = 1; j < copyBlocks.length; j++) {
                    const block = copyBlocks[j];
                    const headlineMatch = block.match(/Headline: "(.+)"/) || block.match(/Headline: (.+)/);
                    const textMatch = block.match(/Supporting text: "(.+)"/) || block.match(/Supporting text: (.+)/);
                    const ctaMatch = block.match(/CTA: "(.+)"/) || block.match(/CTA: (.+)/);

                    let text = textMatch ? textMatch[1].replace(/"/g, '').trim() : '';
                    if (text.toLowerCase().includes('fonte:')) text = '';

                    slides.push({
                        number: j,
                        headline: headlineMatch ? headlineMatch[1].replace(/"/g, '').trim() : '',
                        text,
                        cta: ctaMatch ? ctaMatch[1].replace(/"/g, '').trim() : '',
                        bgPrompt: ''
                    });
                }

                // 2. Parse art-brief.md for AI prompts (only used if Bruno didn't bring a reference)
                const briefBlocks = artBrief.split(/Slide \d+/);
                for (let j = 1; j < briefBlocks.length; j++) {
                    const block = briefBlocks[j];
                    const bgMatch = block.match(/Prompt de imagem AI: "(.+)"/) || block.match(/Prompt de imagem AI: (.+)/);
                    if (bgMatch && slides[j - 1]) {
                        slides[j - 1].bgPrompt = bgMatch[1].replace(/"/g, '').trim();
                    }
                }

                const imagesDir = path.join(runDir, 'images');
                await fs.mkdir(imagesDir, { recursive: true });

                // 3. Read Bruno's index.json to know entity type per slide (logo vs photo layout)
                const brunoIndex = await readBrunoIndex(imagesDir);
                const brunoBySlide = new Map(brunoIndex.images.map((img) => [img.slide, img]));

                // 4. Resolve background per odd slide: Bruno's reference > AI generation
                const backgroundOrigins = []; // {slide, origin: 'reference'|'ai-generated', file, type}
                for (const slide of slides) {
                    if (slide.number % 2 === 0) continue;
                    const slideLabel = String(slide.number).padStart(2, '0');

                    const ref = await findBrunoReference(imagesDir, slide.number);
                    if (ref) {
                        const bgPath = path.join(imagesDir, `slide-${slideLabel}-bg${ref.ext}`);
                        await fs.copyFile(ref.path, bgPath);
                        const entityType = brunoBySlide.get(slide.number)?.type || 'photo';
                        backgroundOrigins.push({ slide: slide.number, origin: 'reference', file: bgPath, type: entityType });
                        console.log(`📷 Slide ${slide.number}: usando referência do Bruno (${entityType})`);
                        continue;
                    }

                    if (slide.bgPrompt) {
                        console.log(`🎨 Slide ${slide.number}: gerando imagem AI (fallback)...`);
                        const bgPath = path.join(imagesDir, `slide-${slideLabel}-bg.png`);
                        const genScript = path.join(ROOT_DIR, 'skills', 'image-ai-generator', 'scripts', 'generate.py');
                        const imgResult = spawnSync('python3', [
                            genScript,
                            '--prompt', slide.bgPrompt,
                            '--output', bgPath,
                            '--mode', 'production'
                        ], {
                            env: {
                                ...process.env,
                                OPENROUTER_API_KEY: apiKey,
                                OPENROUTER_MODELS_IMAGE: env.OPENROUTER_MODELS_IMAGE || 'google/gemini-2.5-flash-image'
                            },
                            stdio: 'inherit'
                        });
                        if (imgResult.status === 0) {
                            backgroundOrigins.push({ slide: slide.number, origin: 'ai-generated', file: bgPath, type: 'photo' });
                            console.log(`✅ slide-${slideLabel}-bg.png gerado via AI`);
                        } else {
                            console.error(`❌ Falha ao gerar imagem AI para slide ${slide.number} (exit ${imgResult.status})`);
                        }
                    } else {
                        console.warn(`⚠️ Slide ${slide.number}: sem referência do Bruno e sem prompt AI no art-brief — slide ficará sem background.`);
                    }
                }

                // 5. Build HTML per slide using design system (text-scrim, branding, etc.)
                const slidesDir = path.join(runDir, 'slides', 'v1');
                await fs.mkdir(slidesDir, { recursive: true });

                const logoPath = path.resolve(path.join(ROOT_DIR, 'squads', 'carousel-noticias', 'assets', 'innovation-latam-logo-white.png'));

                for (const slide of slides) {
                    const slideLabel = String(slide.number).padStart(2, '0');
                    const isOdd = slide.number % 2 !== 0;
                    const isLast = slide.number === slides.length;

                    const bgInfo = backgroundOrigins.find((b) => b.slide === slide.number);
                    const bgPath = bgInfo ? path.resolve(bgInfo.file) : null;
                    const bgEntityType = bgInfo?.type || null;

                    const html = buildSlideHtml({
                        slide, isOdd, isLast,
                        bgPath, bgEntityType,
                        logoPath
                    });

                    await fs.writeFile(path.join(slidesDir, `slide-${slideLabel}.html`), html);
                }

                // 6. Render via Playwright
                console.log('🖼️ Calling render-slides.js (Playwright → PNG)...');
                const renderScript = path.join(ROOT_DIR, 'src', 'render-slides.js');
                const renderResult = spawnSync('node', [renderScript, slidesDir], {
                    cwd: ROOT_DIR,
                    stdio: 'inherit'
                });

                if (renderResult.status === 0) {
                    console.log('✅ Slides renderizados.');
                } else {
                    console.error(`❌ Render falhou (exit ${renderResult.status}).`);
                }

                // 7. Salvar report.md com origens dos backgrounds
                const reportLines = ['=== PRODUÇÃO VISUAL ===\n', 'Backgrounds dos slides ímpares:'];
                for (const b of backgroundOrigins) {
                    reportLines.push(`  slide-${String(b.slide).padStart(2, '0')}-bg — ${b.origin}${b.origin === 'reference' ? ` (Bruno: ${b.type})` : ''}`);
                }
                reportLines.push('\nSlides renderizados:');
                for (const slide of slides) {
                    reportLines.push(`  slide-${String(slide.number).padStart(2, '0')}.png — 1080×1350px`);
                }
                reportLines.push(`\nTotal: ${slides.length} slides em squads/carousel-noticias/output/<runId>/slides/v1/`);
                await fs.writeFile(path.join(runDir, 'slides', 'report.md'), reportLines.join('\n'));
            }

            console.log(`✓ Step ${step.step} completed`);
        }

        state.status = 'completed';
        state.updatedAt = new Date().toISOString();
        await fs.writeFile(statePath, JSON.stringify(state, null, 2));

        console.log('\n✅ Pipeline complete!');

        // Trigger Drive Upload
        console.log('\n📤 Starting Drive upload...');
        const driveScript = path.join(squadDir, 'scripts', 'upload-to-drive.mjs');
        try {
            const uploadResult = spawnSync('node', [driveScript, runId], {
                cwd: ROOT_DIR,
                stdio: 'inherit'
            });
            if (uploadResult.status === 0) console.log('✅ Drive upload completed successfully!');
            else console.error('❌ Drive upload failed.');
        } catch (error) {
            console.error('❌ Error triggering Drive upload:', error);
        }
    } catch (error) {
        console.error('❌ Error during squad execution:', error);
        state.status = 'failed';
        state.step.label = `Erro: ${error.message}`;
        state.updatedAt = new Date().toISOString();
        await fs.writeFile(statePath, JSON.stringify(state, null, 2));
    }
}

run().catch(console.error);
