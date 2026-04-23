import path from "node:path";
import { readdirSync, readFileSync, writeFileSync, existsSync, createReadStream } from "node:fs";
import { google } from "googleapis";

const runId = process.argv[2];
if (!runId) {
  console.error("Usage: node squads/agent-social-v3/scripts/upload-to-drive.mjs <run-id>");
  process.exit(1);
}

const repoRoot = process.cwd();
const DEFAULT_PARENT_FOLDER_ID = "1YB6Qt7-NoI62HU-4v_R-qZpHMNOhANB3";
const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID || DEFAULT_PARENT_FOLDER_ID;
const saPath = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
if (!saPath) {
  console.error("Missing env GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON");
  process.exit(1);
}

const runRoot = path.join(repoRoot, "squads/agent-social-v3/output", runId);
const slidesRoot = path.join(runRoot, "slides");

const versions = readdirSync(slidesRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^v\d+$/.test(e.name))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const version = versions.at(-1);
if (!version) {
  console.error(`No version folders found in ${slidesRoot}`);
  process.exit(1);
}

const renderedDir = path.join(slidesRoot, version, "rendered");
if (!existsSync(renderedDir)) {
  console.error(`Missing rendered dir: ${renderedDir}`);
  process.exit(1);
}

const files = readdirSync(renderedDir)
  .filter((f) => /^slide-\d\d\.jpg$/.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (files.length === 0) {
  console.error(`No slide-NN.jpg files found in ${renderedDir}`);
  process.exit(1);
}

const saAbs = path.isAbsolute(saPath) ? saPath : path.join(repoRoot, saPath);
const sa = JSON.parse(readFileSync(saAbs, "utf8"));
const auth = new google.auth.JWT({
  email: sa.client_email,
  key: sa.private_key,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

const folderName = `agent-social-v3 — ${runId}`;
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
} catch (err) {
  // Service accounts generally need a Shared Drive folder. If the configured parent fails,
  // retry with the squad default parent folder (expected to be shared).
  if (parentFolderId !== DEFAULT_PARENT_FOLDER_ID) {
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
  } else {
    throw err;
  }
}

let uploaded = 0;
for (const f of files) {
  const abs = path.join(renderedDir, f);
  await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: f,
      parents: [folderId],
    },
    media: {
      mimeType: "image/jpeg",
      body: createReadStream(abs),
    },
    fields: "id",
  });
  uploaded += 1;
}

const now = new Date();
const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

const md = `# Upload Google Drive — ${stamp}

- **Status:** Sucesso
- **Slides:** ${uploaded} imagens
- **Run:** \`${runId}\`
- **Versão:** \`${version}\`
- **Pasta (Drive):** \`${folderName}\`
- **Folder ID:** \`${folderId}\`
`;

writeFileSync(path.join(runRoot, "drive-upload-result.md"), md, "utf8");
writeFileSync(path.join(runRoot, version, "drive-upload-result.md"), md, "utf8");

console.log(JSON.stringify({ folderId, uploaded, version, folderName }, null, 2));
