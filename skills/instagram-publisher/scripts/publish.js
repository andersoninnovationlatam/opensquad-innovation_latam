#!/usr/bin/env node
// Instagram Carousel Publisher
// Usage: node --env-file=.env publish.js --images "slide1.jpg,slide2.jpg" --caption "..." [--dry-run]

import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Argument parsing ──────────────────────────────────────────

export function parseArgs(argv) {
  const args = { images: [], caption: '', dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--images') {
      if (i + 1 < argv.length) args.images = argv[++i].split(',').map(s => s.trim());
    }
    else if (argv[i] === '--caption') {
      if (i + 1 < argv.length) args.caption = argv[++i];
    }
    else if (argv[i] === '--dry-run') args.dryRun = true;
  }
  return args;
}

// ── Image upload (public URL for Instagram fetch) ─────────────

/** Catbox — no API key; direct HTTPS URLs usually work with Instagram’s media fetcher (imgBB often returns 9004). */
export async function uploadToCatbox(imagePath) {
  const absolutePath = resolve(imagePath);
  const fileBuffer = readFileSync(absolutePath);
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', new Blob([fileBuffer]), basename(absolutePath));
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
  const text = (await res.text()).trim();
  if (!/^https:\/\//i.test(text)) throw new Error(`Catbox upload failed: ${text.slice(0, 200)}`);
  return text;
}

/** imgBB — optional; some regions/hosts fail Instagram error 9004 on fetch. */
export async function uploadToImgBB(imagePath, apiKey) {
  const absolutePath = resolve(imagePath);
  const fileBuffer = readFileSync(absolutePath);
  const base64Image = fileBuffer.toString('base64');
  const form = new FormData();
  form.append('key', apiKey);
  form.append('image', base64Image);
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`imgBB upload failed [${res.status}]: ${await res.text()}`);
  const json = await res.json();
  if (!json.success) throw new Error(`imgBB upload failed: ${JSON.stringify(json)}`);
  return json.data?.image?.url ?? json.data?.display_url ?? json.data?.url;
}

/** Imgur — set IMGUR_CLIENT_ID in .env (anonymous upload). */
export async function uploadToImgur(imagePath, clientId) {
  const absolutePath = resolve(imagePath);
  const base64Image = readFileSync(absolutePath).toString('base64');
  const body = new URLSearchParams();
  body.set('image', base64Image);
  body.set('type', 'base64');
  const res = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: { Authorization: `Client-ID ${clientId}` },
    body,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(`Imgur upload failed: ${JSON.stringify(json)}`);
  const link = json.data?.link;
  if (!link) throw new Error('Imgur response missing data.link');
  return link;
}

async function uploadImageForInstagram(imagePath, env) {
  const host = (env.INSTAGRAM_IMAGE_HOST || 'catbox').toLowerCase();
  if (host === 'imgbb') {
    if (!env.IMGBB_API_KEY) throw new Error('IMGBB_API_KEY is required when INSTAGRAM_IMAGE_HOST=imgbb');
    return uploadToImgBB(imagePath, env.IMGBB_API_KEY);
  }
  if (host === 'imgur') {
    if (!env.IMGUR_CLIENT_ID) throw new Error('IMGUR_CLIENT_ID is required when INSTAGRAM_IMAGE_HOST=imgur');
    return uploadToImgur(imagePath, env.IMGUR_CLIENT_ID);
  }
  return uploadToCatbox(imagePath);
}

// ── Instagram Graph API ───────────────────────────────────────

const IG_BASE = 'https://graph.facebook.com/v22.0';

/** Graph API accepts long tokens and image URLs more reliably as form body than query string. */
async function graphFormPost(path, fields) {
  const body = new URLSearchParams({ ...fields, access_token: fields.access_token });
  const res = await fetch(`${IG_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Graph API invalid JSON [${res.status}]: ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    throw new Error(`Graph API failed [${res.status}]: ${text}`);
  }
  return json;
}

export async function createChildContainer(userId, imageUrl, accessToken) {
  if (!imageUrl || typeof imageUrl !== 'string' || !/^https?:\/\//i.test(imageUrl)) {
    throw new Error(`Invalid image_url for Instagram: ${String(imageUrl)}`);
  }
  const json = await graphFormPost(`${userId}/media`, {
    image_url: imageUrl,
    is_carousel_item: 'true',
    access_token: accessToken,
  });
  return json.id;
}

export async function getContainerStatus(containerId, accessToken) {
  const params = new URLSearchParams({ fields: 'status_code', access_token: accessToken });
  const res = await fetch(`${IG_BASE}/${containerId}?${params}`);
  if (!res.ok) throw new Error(`getContainerStatus failed [${res.status}]: ${await res.text()}`);
  return (await res.json()).status_code;
}

export async function pollUntilFinished(containerId, accessToken, timeoutMs = 60_000, intervalMs = 3_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = await getContainerStatus(containerId, accessToken);
    if (status === 'FINISHED') return;
    if (status === 'ERROR') throw new Error(`Container ${containerId} entered ERROR state`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Container ${containerId} timed out after ${timeoutMs}ms`);
}

export async function createCarouselContainer(userId, childIds, caption, accessToken) {
  const json = await graphFormPost(`${userId}/media`, {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
    access_token: accessToken,
  });
  return json.id;
}

export async function publishMedia(userId, containerId, accessToken) {
  const json = await graphFormPost(`${userId}/media_publish`, {
    creation_id: containerId,
    access_token: accessToken,
  });
  return json.id;
}

export async function getPermalink(mediaId, accessToken) {
  const params = new URLSearchParams({ fields: 'permalink', access_token: accessToken });
  const res = await fetch(`${IG_BASE}/${mediaId}?${params}`);
  if (!res.ok) return null; // non-fatal — just skip the URL display
  const json = await res.json();
  return json.permalink ?? null;
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const { images, caption, dryRun } = parseArgs(process.argv);

  if (!images.length) throw new Error('--images is required (e.g. --images "slide1.jpg,slide2.jpg")');
  if (!caption) throw new Error('--caption is required');
  if (images.length < 2 || images.length > 10) {
    throw new Error(`Instagram carousels require 2–10 images (got ${images.length})`);
  }
  if (caption.length > 2200) {
    throw new Error(`Caption exceeds Instagram's 2200-character limit (got ${caption.length})`);
  }

  const env = process.env;
  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID } = env;
  if (!INSTAGRAM_ACCESS_TOKEN) throw new Error('INSTAGRAM_ACCESS_TOKEN is not set in environment');
  if (!INSTAGRAM_USER_ID) throw new Error('INSTAGRAM_USER_ID is not set in environment');

  const host = (env.INSTAGRAM_IMAGE_HOST || 'catbox').toLowerCase();
  if (host === 'imgbb' && !env.IMGBB_API_KEY) {
    throw new Error('IMGBB_API_KEY is not set. Get one at https://api.imgbb.com/ or use INSTAGRAM_IMAGE_HOST=catbox (default)');
  }
  if (host === 'imgur' && !env.IMGUR_CLIENT_ID) {
    throw new Error('IMGUR_CLIENT_ID is not set. Register at https://api.imgur.com/oauth2/addclient or use catbox (default)');
  }

  console.log(`📸 Uploading ${images.length} image(s) (${host})...`);
  const imageUrls = await Promise.all(images.map(p => uploadImageForInstagram(p, env)));
  imageUrls.forEach((url, i) => console.log(`   [${i + 1}] ${url}`));

  console.log('\n📦 Creating Instagram media containers (sequential)...');
  const childIds = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    let lastErr;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const id = await createChildContainer(INSTAGRAM_USER_ID, url, INSTAGRAM_ACCESS_TOKEN);
        childIds.push(id);
        console.log(`   [${i + 1}/${imageUrls.length}] container ${id}`);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
    if (lastErr) throw lastErr;
  }
  console.log(`   Container IDs: ${childIds.join(', ')}`);

  console.log('\n⏳ Waiting for containers to finish processing...');
  await Promise.all(childIds.map(id => pollUntilFinished(id, INSTAGRAM_ACCESS_TOKEN)));
  console.log('   All containers ready.');

  console.log('\n🎠 Creating carousel container...');
  const carouselId = await createCarouselContainer(
    INSTAGRAM_USER_ID, childIds, caption, INSTAGRAM_ACCESS_TOKEN
  );
  await pollUntilFinished(carouselId, INSTAGRAM_ACCESS_TOKEN);
  console.log(`   Carousel container ID: ${carouselId}`);

  if (dryRun) {
    console.log('\n✅ DRY RUN complete — skipping final publish call.');
    console.log(`   Carousel container ready: ${carouselId}`);
    return;
  }

  console.log('\n🚀 Publishing to Instagram...');
  const postId = await publishMedia(INSTAGRAM_USER_ID, carouselId, INSTAGRAM_ACCESS_TOKEN);
  const permalink = await getPermalink(postId, INSTAGRAM_ACCESS_TOKEN);
  console.log(`\n✅ Published successfully!`);
  console.log(`   Post ID: ${postId}`);
  if (permalink) console.log(`   URL: ${permalink}`);
}

// Run only when executed directly (not when imported for tests)
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch(err => {
    console.error(`\n❌ ${err.message}`);
    process.exit(1);
  });
}
