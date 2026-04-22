#!/usr/bin/env node
/**
 * Webhook server for carousel-noticias squad.
 *
 * Receives news via POST /webhook, triggers the squad in fully automated mode
 * using the Claude CLI, uploads the resulting PNGs to Google Drive, and
 * exposes GET /status/:job_id so the caller can poll for results.
 *
 * Usage:
 *   node scripts/webhook-server.mjs
 *   WEBHOOK_PORT=4000 node scripts/webhook-server.mjs
 *
 * Endpoints:
 *   POST /webhook   — { title, content, source? }  → 202 { job_id, status_url }
 *   GET  /status/:job_id                            → job object
 */

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SQUAD = 'carousel-noticias'
const SQUAD_OUTPUT = path.join(ROOT, 'squads', SQUAD, 'output')
const JOBS_DIR = path.join(__dirname, '.jobs')
const PORT = Number(process.env.WEBHOOK_PORT || 3000)

fs.mkdirSync(JOBS_DIR, { recursive: true })

// ── Job helpers ────────────────────────────────────────────────────────────────

function makeJobId() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

function readJob(jobId) {
  const f = path.join(JOBS_DIR, `${jobId}.json`)
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null
}

function writeJob(jobId, data) {
  fs.writeFileSync(path.join(JOBS_DIR, `${jobId}.json`), JSON.stringify(data, null, 2))
}

// ── Build the automated prompt ─────────────────────────────────────────────────

function buildPrompt(news) {
  const title = news.title || 'Notícia'
  const source = news.source ? `\n**Fonte:** ${news.source}` : ''
  const content = news.content || news.text || ''

  return `[AUTOMATED WEBHOOK EXECUTION — NO USER INPUT ALLOWED]

Execute the carousel-noticias squad pipeline in FULLY AUTOMATED mode using the news below.
Do NOT pause for user input at any checkpoint — auto-decide as specified below.

## News Input

**Título:** ${title}${source}

${content}

## Execution Instructions

1. Read \`_opensquad/core/runner.pipeline.md\` — follow it as the pipeline runner for ALL execution logic.
2. Read \`squads/carousel-noticias/squad.yaml\` and all squad files the runner prescribes.
3. Execute ALL 10 pipeline steps from step 01 to step 10.

## Checkpoint Override Rules (MANDATORY — apply to every checkpoint)

**Step 01 — News Input checkpoint:**
Do NOT present the checkpoint message. Instead, immediately write the news above (title + content) to the outputFile (applying the run_id Output Path Transformation). Advance to step 02.

**Step 03 — Angle Selection checkpoint:**
Do NOT ask the user. Read the angles generated in step 02. Select the one with the highest engagement potential for Innovation Latam's audience of innovation leaders at large enterprises. Prefer the "Oportunidade" driver; fall back to "Educacional" if it better fits the news. Write your selection to the outputFile. Advance to step 04.

**Step 05 — Approve Content checkpoint:**
Do NOT ask the user. Auto-approve. Advance to step 06.

**Step 07 — Approve Art Brief checkpoint:**
Do NOT ask the user. Auto-approve. Advance to step 08.

**Step 10 — Final Approval checkpoint:**
Pipeline is complete. Do NOT ask about publishing or downloading. Mark the run as completed and finish.

Run the complete pipeline now. Do not stop at any point.`
}

// ── Locate the run folder created after a given timestamp ──────────────────────

function findRunFolder(afterMs) {
  if (!fs.existsSync(SQUAD_OUTPUT)) return null
  const dirs = fs.readdirSync(SQUAD_OUTPUT)
    .filter(d => /^\d{4}-\d{2}-\d{2}-\d{6}$/.test(d))
    .map(d => ({ name: d, mtime: fs.statSync(path.join(SQUAD_OUTPUT, d)).mtimeMs }))
    .filter(d => d.mtime > afterMs)
    .sort((a, b) => b.mtime - a.mtime)
  return dirs.length > 0 ? dirs[0].name : null
}

function findLatestVersion(slidesDir) {
  if (!fs.existsSync(slidesDir)) return null
  const versions = fs.readdirSync(slidesDir)
    .filter(d => /^v\d+$/.test(d))
    .sort((a, b) => Number(b.slice(1)) - Number(a.slice(1)))
  return versions[0] || null
}

// ── Upload slides to Google Drive ──────────────────────────────────────────────

function uploadToDrive(runId) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      ['squads/carousel-noticias/scripts/upload-to-drive.mjs', runId],
      { cwd: ROOT, env: { ...process.env } }
    )
    proc.stdout.on('data', d => process.stdout.write(d))
    proc.stderr.on('data', d => process.stderr.write(d))
    proc.on('close', code => code === 0 ? resolve() : reject(new Error(`upload-to-drive exited ${code}`)))
  })
}

function readDriveResult(runId) {
  const f = path.join(SQUAD_OUTPUT, runId, 'drive-upload-result.md')
  if (!fs.existsSync(f)) return null
  const content = fs.readFileSync(f, 'utf8')
  const folderId = content.match(/\*\*Folder ID:\*\* `([^`]+)`/)?.[1]
  return folderId
    ? { folderId, url: `https://drive.google.com/drive/folders/${folderId}` }
    : null
}

// ── Run the squad ──────────────────────────────────────────────────────────────

function runSquad(jobId, news) {
  const startedAt = Date.now()
  const job = readJob(jobId)
  job.status = 'running'
  job.startedAt = new Date(startedAt).toISOString()
  writeJob(jobId, job)

  const proc = spawn(
    'claude',
    ['--print', '--dangerously-skip-permissions', '-p', buildPrompt(news)],
    { cwd: ROOT, env: { ...process.env } }
  )

  proc.stdout.on('data', d => process.stdout.write(d))
  proc.stderr.on('data', d => process.stderr.write(d))

  proc.on('close', async code => {
    const runId = findRunFolder(startedAt - 5000)
    const j = readJob(jobId)
    j.completedAt = new Date().toISOString()

    if (runId) {
      j.runId = runId

      const slidesDir = path.join(SQUAD_OUTPUT, runId, 'slides')
      const version = findLatestVersion(slidesDir)
      if (version) {
        const vDir = path.join(slidesDir, version)
        j.slidesPath = `squads/${SQUAD}/output/${runId}/slides/${version}`
        j.slides = fs.readdirSync(vDir).filter(f => f.endsWith('.png')).sort()
      }

      try {
        await uploadToDrive(runId)
        const drive = readDriveResult(runId)
        if (drive) j.drive = drive
      } catch (e) {
        console.error('⚠️  Drive upload failed:', e.message)
        j.driveError = e.message
      }

      j.status = 'completed'
    } else {
      j.status = code === 0 ? 'completed' : 'failed'
      if (code !== 0) j.error = `claude exited with code ${code}`
    }

    writeJob(jobId, j)
    console.log(`\n✅ Job ${jobId} — ${j.status}${j.drive ? ` → ${j.drive.url}` : ''}`)
  })
}

// ── HTTP server ────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.writeHead(204); res.end(); return
  }

  // POST /webhook
  if (req.method === 'POST' && url.pathname === '/webhook') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        const content = payload.content || payload.text

        if (!content || typeof content !== 'string' || content.trim().length < 20) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: 'Field "content" is required and must be at least 20 characters.' }))
          return
        }

        const jobId = makeJobId()
        writeJob(jobId, {
          jobId,
          status: 'queued',
          news: { title: payload.title, source: payload.source, content },
          createdAt: new Date().toISOString()
        })

        runSquad(jobId, payload)

        res.writeHead(202)
        res.end(JSON.stringify({
          job_id: jobId,
          status: 'accepted',
          status_url: `http://localhost:${PORT}/status/${jobId}`
        }))
        console.log(`\n📨 Job ${jobId} queued — "${payload.title || 'sem título'}"`)
      } catch {
        res.writeHead(400)
        res.end(JSON.stringify({ error: 'Invalid JSON body.' }))
      }
    })
    return
  }

  // GET /status/:jobId
  const match = url.pathname.match(/^\/status\/([^/]+)$/)
  if (req.method === 'GET' && match) {
    const job = readJob(match[1])
    if (!job) { res.writeHead(404); res.end(JSON.stringify({ error: 'Job not found.' })); return }
    res.writeHead(200)
    res.end(JSON.stringify(job))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found.' }))
})

server.listen(PORT, () => {
  console.log(`\n🔗 Webhook server running on http://localhost:${PORT}`)
  console.log(`   POST /webhook          — envia notícia, dispara squad`)
  console.log(`   GET  /status/:job_id   — consulta status e resultado\n`)
})
