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

            // Special handling for image generation step (Step 8)
            if (step.name === 'gerar-e-renderizar-slides') {
                console.log('🎨 Starting real image generation and rendering...');

                const artBriefPath = path.join(runDir, 'art-brief.md');
                const artBrief = await fs.readFile(artBriefPath, 'utf-8').catch(() => '');
                const copyPath = path.join(runDir, 'carousel-copy.md');
                const copy = await fs.readFile(copyPath, 'utf-8').catch(() => '');

                // 1. Parse carousel-copy for text
                const slides = [];
                const copyBlocks = copy.split(/Slide \d+/);
                for (let j = 1; j < copyBlocks.length; j++) {
                    const block = copyBlocks[j];
                    const headlineMatch = block.match(/Headline: "(.+)"/) || block.match(/Headline: (.+)/);
                    const textMatch = block.match(/Supporting text: "(.+)"/) || block.match(/Supporting text: (.+)/);
                    const ctaMatch = block.match(/CTA: "(.+)"/) || block.match(/CTA: (.+)/);

                    let text = textMatch ? textMatch[1].replace(/"/g, '').trim() : '';
                    // Remove source if it's the last slide or contains "Fonte"
                    if (text.toLowerCase().includes('fonte:')) text = '';

                    slides.push({
                        number: j,
                        headline: headlineMatch ? headlineMatch[1].replace(/"/g, '').trim() : '',
                        text: text,
                        cta: ctaMatch ? ctaMatch[1].replace(/"/g, '').trim() : '',
                        bgPrompt: '' // Will be filled from art-brief
                    });
                }

                // 2. Parse art-brief for image prompts
                const briefBlocks = artBrief.split(/Slide \d+/);
                for (let j = 1; j < briefBlocks.length; j++) {
                    const block = briefBlocks[j];
                    const bgMatch = block.match(/Prompt de imagem AI: "(.+)"/) || block.match(/Prompt de imagem AI: (.+)/) || block.match(/Background: (.+)/);
                    if (bgMatch && slides[j - 1]) {
                        slides[j - 1].bgPrompt = bgMatch[1].replace(/"/g, '').trim();
                    }
                }

                // 2. Generate images for odd slides
                const imagesDir = path.join(runDir, 'images');
                await fs.mkdir(imagesDir, { recursive: true });

                for (const slide of slides) {
                    if (slide.number % 2 !== 0 && slide.bgPrompt) {
                        console.log(`📸 Generating background for Slide ${slide.number}...`);
                        const imgPath = path.join(imagesDir, `slide-${String(slide.number).padStart(2, '0')}-bg.png`);

                        // Call image-ai-generator
                        const genScript = path.join(ROOT_DIR, 'skills', 'image-ai-generator', 'scripts', 'generate.py');
                        spawnSync('python3', [
                            genScript,
                            '--prompt', slide.bgPrompt,
                            '--output', imgPath,
                            '--mode', 'production'
                        ], { env: { ...process.env, OPENROUTER_API_KEY: apiKey } });
                    }
                }

                // 3. Render slides to PNG
                console.log('🖼️ Rendering slides to PNG...');
                const slidesDir = path.join(runDir, 'slides', 'v1');
                await fs.mkdir(slidesDir, { recursive: true });

                // We'll use a simple HTML template for rendering
                for (const slide of slides) {
                    const htmlPath = path.join(slidesDir, `slide-${String(slide.number).padStart(2, '0')}.html`);
                    const pngPath = path.join(slidesDir, `slide-${String(slide.number).padStart(2, '0')}.png`);

                    const isOdd = slide.number % 2 !== 0;
                    const isFirst = slide.number === 1;
                    const isLast = slide.number === slides.length;
                    const bgPath = path.resolve(path.join(imagesDir, `slide-${String(slide.number).padStart(2, '0')}-bg.png`));
                    const logoPath = path.resolve(path.join(ROOT_DIR, 'squads', 'carousel-noticias', 'assets', 'innovation-latam-logo-white.png'));

                    const bgStyle = isOdd
                        ? `background-image: url('file://${bgPath}'); background-size: cover; background-position: center;`
                        : `background-color: #993CB1;`;

                    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 1080px; height: 1350px; overflow: hidden;
            font-family: 'Montserrat', sans-serif;
            position: relative;
            display: flex; flex-direction: column;
            justify-content: ${isFirst || isLast ? 'flex-end' : 'center'}; 
            padding: 100px;
            padding-bottom: ${isFirst || isLast ? '160px' : '100px'};
            ${bgStyle}
            color: white;
            text-align: left;
        }
        ${isOdd ? '.overlay { position: absolute; inset: 0; background: rgba(21, 10, 28, 0.7); z-index: 1; }' : ''}
        .logo {
            position: absolute; top: 30px; left: 100px;
            height: 40px; z-index: 2;
        }
        .content { position: relative; z-index: 2; width: 100%; }
        h1 { font-size: 64px; font-weight: 700; line-height: 1.2; margin-bottom: 30px; }
        p { font-size: 38px; font-weight: 500; line-height: 1.45; opacity: 0.95; }
        .cta { font-size: 42px; font-weight: 700; color: #FFD700; margin-top: 40px; }
        .footer {
            position: absolute; bottom: 40px; left: 100px; right: 100px;
            display: flex; justify-content: space-between; align-items: center;
            z-index: 2; font-size: 24px; font-weight: 600;
        }
    </style>
</head>
<body>
    <img src="file://${logoPath}" class="logo" />
    ${isOdd ? '<div class="overlay"></div>' : ''}
    <div class="content">
        <h1>${slide.headline}</h1>
        <p>${slide.text}</p>
        ${isLast && slide.cta ? `<div class="cta">${slide.cta}</div>` : ''}
    </div>
    <div class="footer">
        <span>@innovationlatam</span>
        <span>ARRASTE -></span>
    </div>
</body>
</html>`;
                    await fs.writeFile(htmlPath, html);
                }

                // Call the real rendering script
                console.log('🖼️ Calling render-slides.js...');
                const renderScript = path.join(ROOT_DIR, 'src', 'render-slides.js');
                const renderResult = spawnSync('node', [renderScript, slidesDir], {
                    cwd: ROOT_DIR,
                    stdio: 'inherit'
                });

                if (renderResult.status === 0) {
                    console.log('✅ Slides rendered successfully!');
                } else {
                    console.error('❌ Slide rendering failed.');
                }
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
