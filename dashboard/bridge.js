#!/usr/bin/env node
/**
 * Bridge: sincroniza state.json do squad local com Cloudflare KV.
 *
 * Uso:
 *   node bridge.js --squad carousel-noticias --kv-id <KV_NAMESPACE_ID>
 *
 * Requer wrangler instalado: npm install -g wrangler
 * Requer autenticação: wrangler auth login
 */

import { watch } from "chokidar";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const squadArg = args[args.indexOf("--squad") + 1] ?? "carousel-noticias";
const kvIdArg = args[args.indexOf("--kv-id") + 1];

if (!kvIdArg) {
  console.error("Usage: node bridge.js --squad <name> --kv-id <namespace-id>");
  process.exit(1);
}

const rootDir = new URL("..", import.meta.url).pathname;
const squadDir = path.join(rootDir, "squads", squadArg);
const statePath = path.join(squadDir, "state.json");

function putKv(key, value) {
  try {
    execSync(
      `wrangler kv:key put --namespace-id="${kvIdArg}" "${key}" '${JSON.stringify(value)}'`,
      { stdio: "pipe" }
    );
    console.log(`[bridge] KV updated: ${key}`);
  } catch (e) {
    console.error(`[bridge] Failed to update KV key "${key}":`, e.message);
  }
}

function syncState() {
  if (!existsSync(statePath)) return;
  try {
    const state = JSON.parse(readFileSync(statePath, "utf-8"));
    putKv("state", state);
  } catch {
    // ignore parse errors
  }
}

console.log(`[bridge] Watching ${statePath}`);
console.log(`[bridge] KV namespace: ${kvIdArg}`);

// Initial sync
syncState();

watch(statePath, {
  awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 50 },
}).on("change", () => {
  syncState();
});

// Also sync output content files when they appear
const outputDir = path.join(squadDir, "output");
watch(outputDir, {
  ignored: /node_modules/,
  awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  depth: 2,
}).on("add", (filePath) => {
  const base = path.basename(filePath);
  if (base === "carousel-copy.md") {
    const content = readFileSync(filePath, "utf-8");
    putKv("copy", content);
  } else if (base === "art-brief.md") {
    const content = readFileSync(filePath, "utf-8");
    putKv("artbrief", content);
  }
});
