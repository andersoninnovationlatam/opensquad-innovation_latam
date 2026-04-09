#!/usr/bin/env node
/**
 * Google Chat — envia imagens locais via incoming webhook (cardsV2 com imageUrl HTTPS).
 * Upload temporário: Catbox (sem API key), igual ao instagram-publisher.
 */

import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

export function parseArgs(argv) {
  const args = { images: [], text: '', dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--images' && i + 1 < argv.length) {
      args.images = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (argv[i] === '--text' && i + 1 < argv.length) {
      args.text = argv[++i];
    } else if (argv[i] === '--dry-run') {
      args.dryRun = true;
    }
  }
  return args;
}

export async function uploadToCatbox(imagePath) {
  const absolutePath = resolve(imagePath);
  const fileBuffer = readFileSync(absolutePath);
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', new Blob([fileBuffer]), basename(absolutePath));
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
  const text = (await res.text()).trim();
  if (!/^https:\/\//i.test(text)) {
    throw new Error(`Catbox upload failed: ${text.slice(0, 200)}`);
  }
  return text;
}

function cardPayload(imageUrl, altText) {
  const cardId = `img-${randomBytes(8).toString('hex')}`;
  return {
    cardsV2: [
      {
        cardId,
        card: {
          sections: [
            {
              widgets: [
                {
                  image: {
                    imageUrl,
                    altText: altText.slice(0, 200),
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

async function postJson(webhookUrl, body, dryRun) {
  if (dryRun) {
    const preview = JSON.stringify(body);
    console.log(`[dry-run] POST (${preview.length} chars): ${preview.slice(0, 280)}…`);
    return { ok: true, dryRun: true };
  }
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(body),
  });
  const txt = await res.text();
  if (!res.ok) {
    throw new Error(`Webhook HTTP ${res.status}: ${txt.slice(0, 500)}`);
  }
  return { ok: true, body: txt };
}

async function main() {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error(
      'Missing GOOGLE_CHAT_WEBHOOK_URL. Add it to .env (see .env.example). Do not commit secrets.',
    );
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  if (args.images.length === 0) {
    console.error('Usage: send.js --images "a.jpg,b.jpg" [--text "header"] [--dry-run]');
    process.exit(1);
  }

  const results = [];

  if (args.text) {
    await postJson(webhookUrl, { text: args.text }, args.dryRun);
    results.push({ type: 'text', ok: true });
  }

  for (const imagePath of args.images) {
    const alt = basename(imagePath);
    const publicUrl = args.dryRun ? 'https://example.com/dry-run-placeholder.jpg' : await uploadToCatbox(imagePath);
    const payload = cardPayload(publicUrl, alt);
    await postJson(webhookUrl, payload, args.dryRun);
    results.push({ type: 'image', file: alt, ok: true });
    if (!args.dryRun) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  console.log(JSON.stringify({ ok: true, sent: results.length, dryRun: args.dryRun }, null, 0));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
