/**
 * Envia os slides PNG do carousel-noticias para uma pasta no Google Drive.
 * Cria uma subpasta por run_id dentro da pasta pai configurada no .env.
 *
 * Pré-requisitos:
 *   - GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON=secrets/google-drive-service-account.json no .env
 *   - GOOGLE_DRIVE_PARENT_FOLDER_ID=<folder-id> no .env
 *   - npm install googleapis (já no package.json do projeto)
 *
 * Uso (na raiz do repo):
 *   node squads/carousel-noticias/scripts/upload-to-drive.mjs <run-id>
 *
 * Exemplo:
 *   node squads/carousel-noticias/scripts/upload-to-drive.mjs 2026-04-14-094324
 *
 * O script detecta automaticamente a versão mais recente (v1, v2, v3...) e faz upload
 * de todos os slide-NN.png encontrados.
 */

import path from "node:path";
import { readdirSync, readFileSync, writeFileSync, existsSync, createReadStream } from "node:fs";
import { google } from "googleapis";

// ── Config ─────────────────────────────────────────────────────────────────────
const REPO_ROOT = process.cwd();
const DEFAULT_PARENT_FOLDER_ID = "1YB6Qt7-NoI62HU-4v_R-qZpHMNOhANB3";

function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env");
  if (!existsSync(envPath)) return {};
  return readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#") && l.trim())
    .reduce((acc, l) => {
      const [k, ...v] = l.split("=");
      acc[k.trim()] = v.join("=").trim().replace(/^['"]|['"]$/g, "");
      return acc;
    }, {});
}

const env = loadEnv();

const parentFolderId =
  process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID ||
  env["GOOGLE_DRIVE_PARENT_FOLDER_ID"] ||
  DEFAULT_PARENT_FOLDER_ID;

const saPathRaw =
  process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON ||
  env["GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON"];

if (!saPathRaw) {
  console.error("❌ GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON não configurada no .env");
  console.error("   Adicione: GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON=secrets/google-drive-service-account.json");
  process.exit(1);
}

const saAbs = path.isAbsolute(saPathRaw)
  ? saPathRaw
  : path.join(REPO_ROOT, saPathRaw);

if (!existsSync(saAbs)) {
  console.error(`❌ Arquivo de service account não encontrado: ${saAbs}`);
  process.exit(1);
}

// ── Args ───────────────────────────────────────────────────────────────────────
const runId = process.argv[2];
if (!runId) {
  console.error("Uso: node upload-to-drive.mjs <run-id>");
  console.error("Exemplo: node upload-to-drive.mjs 2026-04-14-094324");
  process.exit(1);
}

// ── Localizar slides ───────────────────────────────────────────────────────────
const runRoot = path.join(REPO_ROOT, "squads/carousel-noticias/output", runId);
const slidesRoot = path.join(runRoot, "slides");

if (!existsSync(slidesRoot)) {
  console.error(`❌ Pasta de slides não encontrada: ${slidesRoot}`);
  process.exit(1);
}

// Detectar versão mais recente (v1, v2, v3...)
const versions = readdirSync(slidesRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^v\d+$/.test(e.name))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (versions.length === 0) {
  console.error(`❌ Nenhuma versão (v1, v2...) encontrada em ${slidesRoot}`);
  process.exit(1);
}

const version = versions.at(-1);
const slidesDir = path.join(slidesRoot, version);

// Coletar PNGs (slide-NN.png) — ordenados
const files = readdirSync(slidesDir)
  .filter((f) => /^slide-\d{2}\.png$/.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (files.length === 0) {
  console.error(`❌ Nenhum slide-NN.png encontrado em ${slidesDir}`);
  process.exit(1);
}

console.log(`\n📤 Upload para Google Drive`);
console.log(`   Run:     ${runId}`);
console.log(`   Versão:  ${version}`);
console.log(`   Slides:  ${files.length} arquivos`);
console.log(`   Origem:  ${slidesDir}`);

// ── Autenticação Google Drive ──────────────────────────────────────────────────
const sa = JSON.parse(readFileSync(saAbs, "utf8"));
const auth = new google.auth.JWT({
  email: sa.client_email,
  key: sa.private_key,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// ── Criar pasta no Drive ───────────────────────────────────────────────────────
const folderName = `carousel-noticias — ${runId} (${version})`;
let folderId;

try {
  const folderRes = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id",
  });
  folderId = folderRes.data.id;
  console.log(`\n📁 Pasta criada no Drive: "${folderName}"`);
  console.log(`   ID: ${folderId}`);
} catch (err) {
  // Se a pasta pai falhar, tenta o default
  if (parentFolderId !== DEFAULT_PARENT_FOLDER_ID) {
    console.warn(`⚠️  Falha na pasta pai configurada, tentando default...`);
    const folderRes = await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [DEFAULT_PARENT_FOLDER_ID],
      },
      fields: "id",
    });
    folderId = folderRes.data.id;
    console.log(`📁 Pasta criada (default parent): "${folderName}" — ID: ${folderId}`);
  } else {
    throw err;
  }
}

// ── Upload dos slides ──────────────────────────────────────────────────────────
console.log("\n⬆️  Enviando slides...");
let uploaded = 0;

for (const f of files) {
  const abs = path.join(slidesDir, f);
  try {
    await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: f,
        parents: [folderId],
      },
      media: {
        mimeType: "image/png",
        body: createReadStream(abs),
      },
      fields: "id",
    });
    uploaded += 1;
    console.log(`   ✅ ${f}`);
  } catch (err) {
    console.error(`   ❌ Falha ao enviar ${f}:`, err.message);
  }
}

// ── Salvar resultado ───────────────────────────────────────────────────────────
const now = new Date();
const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

const md = `# Upload Google Drive — ${stamp}

- **Status:** ${uploaded === files.length ? "Sucesso" : `Parcial (${uploaded}/${files.length})`}
- **Slides:** ${uploaded}/${files.length} imagens enviadas
- **Run:** \`${runId}\`
- **Versão:** \`${version}\`
- **Pasta (Drive):** \`${folderName}\`
- **Folder ID:** \`${folderId}\`
- **Parent Folder ID:** \`${parentFolderId}\`
`;

writeFileSync(path.join(runRoot, "drive-upload-result.md"), md, "utf8");

console.log(`\n✅ Upload concluído: ${uploaded}/${files.length} slides`);
console.log(`📄 Resultado salvo: squads/carousel-noticias/output/${runId}/drive-upload-result.md`);
console.log(JSON.stringify({ folderId, folderName, uploaded, total: files.length, version }, null, 2));
