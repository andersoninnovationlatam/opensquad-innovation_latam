---
name: google-chat-notify
description: >
  Sends local images to a Google Chat space via an incoming webhook. Uploads each file to
  Catbox to obtain HTTPS URLs, then POSTs cardsV2 messages to GOOGLE_CHAT_WEBHOOK_URL.
description_pt-BR: >
  Envia imagens locais para um espaço do Google Chat via webhook. Faz upload para Catbox
  (URL pública) e publica mensagens cardsV2 no webhook configurado em GOOGLE_CHAT_WEBHOOK_URL.
type: script
version: "1.0.0"
script:
  path: scripts/send.js
  runtime: node
  invoke: 'node --env-file=.env {skill_path}/scripts/send.js --images "{images}" --text "{text}"'
env:
  - GOOGLE_CHAT_WEBHOOK_URL
categories: [social-media, notifications, google-workspace]
---

# Google Chat Notify

## When to use

Use after carousel slides are rendered as JPEGs when you need to notify a Google Chat space with those images. Requires an **incoming webhook** URL from the Chat space (Integrations → Webhooks).

## Setup

1. In Google Chat: space settings → **Webhooks** → create webhook → copy the full URL.
2. Set `GOOGLE_CHAT_WEBHOOK_URL` in `.env` (never commit real URLs). Put the URL in **single quotes** if it contains `&`, or Bash will break on `source .env`.

If a webhook URL is exposed, delete it in Chat and create a new one.

## Workflow

1. Collect ordered paths to `slide-NN.jpg` files.
2. Optional short `--text` for a header message.
3. Run (prefer `node --env-file` so `&` in the webhook URL is never parsed by the shell):

```bash
node --env-file=.env skills/google-chat-notify/scripts/send.js \
  --images "path1.jpg,path2.jpg" \
  --text "Optional header"
```

Add `--dry-run` to print payloads without uploading or posting.

## Constraints

- Webhook messages use **public HTTPS** image URLs (Catbox by default).
- One POST per image (plus optional text POST) to avoid oversized payloads.
