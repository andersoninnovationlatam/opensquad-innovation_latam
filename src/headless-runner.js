import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

async function run() {
    const args = process.argv.slice(2);
    const squadName = args[args.indexOf('--squad') + 1];
    const runId = args[args.indexOf('--runId') + 1];
    const startStep = parseInt(args[args.indexOf('--startStep') + 1] || '1');

    console.log(`🚀 Starting headless run for squad: ${squadName}`);
    console.log(`📁 Run ID: ${runId}`);

    const squadDir = path.join(ROOT_DIR, 'squads', squadName);
    const pipelinePath = path.join(squadDir, 'pipeline', 'pipeline.yaml');

    const pipelineRaw = await fs.readFile(pipelinePath, 'utf-8');
    const pipeline = parseYaml(pipelineRaw);

    const runDir = path.join(squadDir, 'output', runId);
    await fs.mkdir(runDir, { recursive: true });

    const statePath = path.join(runDir, 'state.json');

    // Initial state
    let state = {
        squad: squadName,
        status: 'running',
        step: { current: startStep, total: pipeline.steps.length, label: '' },
        agents: [], // To be populated from squad-party.csv
        updatedAt: new Date().toISOString()
    };

    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    for (let i = startStep - 1; i < pipeline.steps.length; i++) {
        const step = pipeline.steps[i];
        console.log(`\nStep ${step.step}: ${step.name}`);

        // Update state
        state.step.current = step.step;
        state.step.label = step.name;
        state.updatedAt = new Date().toISOString();
        await fs.writeFile(statePath, JSON.stringify(state, null, 2));

        // EXECUTION LOGIC
        // In a real headless runner, this would call an LLM API.
        // For this implementation, we simulate the delay and output.
        // The actual content generation should be handled by the AI agents.

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`✓ Step ${step.step} completed`);
    }

    state.status = 'completed';
    state.updatedAt = new Date().toISOString();
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    console.log('\n✅ Pipeline complete!');
}

run().catch(console.error);
