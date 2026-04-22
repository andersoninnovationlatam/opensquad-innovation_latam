import type { Plugin, ViteDevServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import type { Server, IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { watch as chokidarWatch } from "chokidar";
import path from "node:path";
import { spawn } from "node:child_process";
import type { SquadState } from "../types/state";

function resolveProjectRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), ".."),
    process.cwd(),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "CLAUDE.md"))) return c;
  }
  return path.resolve(process.cwd(), "..");
}

function resolveSquadsDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "../squads"),
    path.resolve(process.cwd(), "squads"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return path.resolve(process.cwd(), "../squads");
}

function resolveEnvFile(): string {
  const candidates = [
    path.resolve(process.cwd(), "../.env"),
    path.resolve(process.cwd(), ".env"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return path.resolve(process.cwd(), "../.env");
}

async function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function isValidState(data: unknown): data is SquadState {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.status === "string" &&
    d.step != null &&
    typeof d.step === "object" &&
    Array.isArray(d.agents)
  );
}

async function readSquadState(squadsDir: string): Promise<SquadState | null> {
  try {
    const raw = await fsp.readFile(
      path.join(squadsDir, "carousel-noticias", "state.json"),
      "utf-8"
    );
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function findLatestRunDir(outputDir: string): Promise<string | null> {
  try {
    const entries = await fsp.readdir(outputDir, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort()
      .reverse();
    return dirs[0] ? path.join(outputDir, dirs[0]) : null;
  } catch {
    return null;
  }
}

async function readOutputContent(
  squadsDir: string,
  type: "copy" | "artbrief"
): Promise<string | null> {
  const outputDir = path.join(squadsDir, "carousel-noticias", "output");
  const runDir = await findLatestRunDir(outputDir);
  if (!runDir) return null;

  const fileMap: Record<string, string> = {
    copy: "carousel-copy.md",
    artbrief: "art-brief.md",
  };
  try {
    return await fsp.readFile(path.join(runDir, fileMap[type]), "utf-8");
  } catch {
    return null;
  }
}

async function updateEnvFile(
  envPath: string,
  updates: Record<string, string>
): Promise<void> {
  let content = "";
  try {
    content = await fsp.readFile(envPath, "utf-8");
  } catch {
    // file doesn't exist yet — start empty
  }

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}=${value}`;
    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      content += (content.endsWith("\n") ? "" : "\n") + line + "\n";
    }
  }

  await fsp.writeFile(envPath, content, "utf-8");
}

const CHECKPOINT_STEP_MAP: Record<string, string> = {
  "approve-content": "step-05-checkpoint-approve-content.response.md",
  "approve-art-brief": "step-07-checkpoint-approve-art-brief.response.md",
  "final-approval": "step-10-checkpoint-final-approval.response.md",
};

function broadcastCarousel(wss: WebSocketServer, state: SquadState) {
  const data = JSON.stringify({ type: "CAROUSEL_UPDATE", state });
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch {
        // ignore dying connections
      }
    }
  }
}

function sendJson(
  res: import("node:http").ServerResponse,
  status: number,
  body: unknown
) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  });
  res.end(json);
}

export function carouselPlugin(): Plugin {
  return {
    name: "carousel-noticias",
    configureServer(server: ViteDevServer) {
      if (!server.httpServer) {
        server.config.logger.warn("[carousel] no httpServer — skipping");
        return;
      }

      const squadsDir = resolveSquadsDir();
      const projectRoot = resolveProjectRoot();
      const envPath = resolveEnvFile();
      const stepsDir = path.join(
        squadsDir,
        "carousel-noticias",
        "pipeline",
        "steps"
      );
      const dataDir = path.join(
        squadsDir,
        "carousel-noticias",
        "pipeline",
        "data"
      );

      server.config.logger.info(`[carousel] squads dir: ${squadsDir}`);
      server.config.logger.info(`[carousel] project root: ${projectRoot}`);
      server.config.logger.info(`[carousel] env file: ${envPath}`);

      // WebSocket server
      const wss = new WebSocketServer({ noServer: true });

      (server.httpServer as Server).on(
        "upgrade",
        (req: IncomingMessage, socket: Duplex, head: Buffer) => {
          if (req.url === "/__carousel_ws") {
            wss.handleUpgrade(req, socket, head, (ws) => {
              wss.emit("connection", ws, req);
            });
          }
        }
      );

      wss.on("connection", async (ws) => {
        server.config.logger.info("[carousel] WebSocket client conectado");
        const state = await readSquadState(squadsDir);
        if (state) {
          server.config.logger.info(`[carousel] enviando state inicial → status=${state.status} step=${JSON.stringify(state.step)}`);
          try {
            ws.send(JSON.stringify({ type: "CAROUSEL_UPDATE", state }));
          } catch {
            // ignore
          }
        }
        ws.on("close", () => server.config.logger.info("[carousel] WebSocket client desconectado"));
      });

      // File watcher for state.json
      const statePath = path.join(
        squadsDir,
        "carousel-noticias",
        "state.json"
      );
      const watcher = chokidarWatch(statePath, {
        awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 50 },
      });

      watcher.on("change", () => {
        server.config.logger.info("[carousel] state.json alterado — lendo novo estado");
        fsp
          .readFile(statePath, "utf-8")
          .then((raw) => {
            const parsed = JSON.parse(raw);
            if (isValidState(parsed)) {
              server.config.logger.info(`[carousel] state atualizado → status=${parsed.status} step=${JSON.stringify(parsed.step)}`);
              broadcastCarousel(wss, parsed);
            } else {
              server.config.logger.warn("[carousel] state.json inválido — ignorando");
            }
          })
          .catch((err) => server.config.logger.warn(`[carousel] erro ao ler state.json: ${err}`));
      });

      server.httpServer.on("close", () => watcher.close());

      // REST middleware
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const { pathname } = url;

        // POST /api/carousel/input
        if (req.method === "POST" && pathname === "/api/carousel/input") {
          server.config.logger.info("[carousel] POST /api/carousel/input recebido");
          try {
            const body = (await parseBody(req)) as Record<string, string>;
            const { newsText, angle, contentModel, imageModel } = body;

            if (!newsText || !angle) {
              server.config.logger.warn("[carousel] campos obrigatórios ausentes: newsText e angle");
              return sendJson(res, 400, { error: "newsText and angle required" });
            }

            server.config.logger.info(`[carousel] ângulo selecionado: "${angle}"`);
            if (contentModel) server.config.logger.info(`[carousel] modelo de conteúdo: ${contentModel}`);
            if (imageModel) server.config.logger.info(`[carousel] modelo de imagem: ${imageModel}`);

            server.config.logger.info("[carousel] criando diretórios data/ e steps/");
            await fsp.mkdir(dataDir, { recursive: true });
            await fsp.mkdir(stepsDir, { recursive: true });

            server.config.logger.info("[carousel] escrevendo news-input.md e selected-angle.md");
            await fsp.writeFile(
              path.join(dataDir, "news-input.md"),
              `# Notícia\n\n${newsText}\n`,
              "utf-8"
            );
            await fsp.writeFile(
              path.join(dataDir, "selected-angle.md"),
              `# Ângulo Selecionado\n\n${angle}\n`,
              "utf-8"
            );

            server.config.logger.info("[carousel] pré-preenchendo checkpoints step-01 e step-03");
            await fsp.writeFile(
              path.join(stepsDir, "step-01-checkpoint-news-input.response.md"),
              `${newsText}\n`,
              "utf-8"
            );
            await fsp.writeFile(
              path.join(
                stepsDir,
                "step-03-checkpoint-angle-selection.response.md"
              ),
              `${angle}\n`,
              "utf-8"
            );

            // Update .env with selected models
            const envUpdates: Record<string, string> = {};
            if (contentModel) envUpdates["OPENROUTER_MODELS_CONTENT"] = contentModel;
            if (imageModel) envUpdates["OPENROUTER_MODELS_IMAGE"] = imageModel;
            if (Object.keys(envUpdates).length > 0) {
              server.config.logger.info(`[carousel] atualizando .env: ${Object.keys(envUpdates).join(", ")}`);
              await updateEnvFile(envPath, envUpdates);
            }

            // Auto-trigger squad execution
            server.config.logger.info("[carousel] iniciando squad carousel-noticias via claude CLI");
            try {
              const proc = spawn("claude", ["-p", "/opensquad run carousel-noticias"], {
                cwd: projectRoot,
                detached: true,
                stdio: "ignore",
                shell: true,
              });
              proc.on("error", (err) => {
                server.config.logger.warn(`[carousel] falha ao iniciar squad automaticamente: ${err.message}`);
              });
              proc.unref();
              server.config.logger.info("[carousel] squad carousel-noticias iniciado — processo rodando em background");
            } catch (spawnErr) {
              server.config.logger.warn(`[carousel] falha ao iniciar squad automaticamente: ${spawnErr}`);
            }

            return sendJson(res, 200, { ok: true, autoStarted: true });
          } catch (err) {
            server.config.logger.error(`[carousel] /input error: ${err}`);
            return sendJson(res, 500, { error: "internal error" });
          }
        }

        // GET /api/carousel/state
        if (req.method === "GET" && pathname === "/api/carousel/state") {
          server.config.logger.info("[carousel] GET /api/carousel/state");
          const state = await readSquadState(squadsDir);
          if (!state) {
            server.config.logger.warn("[carousel] state.json não encontrado ou inválido");
            return sendJson(res, 404, { error: "no state" });
          }
          server.config.logger.info(`[carousel] estado atual → status=${state.status} step=${JSON.stringify(state.step)}`);
          return sendJson(res, 200, state);
        }

        // GET /api/carousel/content?type=copy|artbrief
        if (req.method === "GET" && pathname === "/api/carousel/content") {
          const type = url.searchParams.get("type") as "copy" | "artbrief" | null;
          server.config.logger.info(`[carousel] GET /api/carousel/content?type=${type}`);
          if (type !== "copy" && type !== "artbrief") {
            return sendJson(res, 400, { error: "type must be copy or artbrief" });
          }
          const content = await readOutputContent(squadsDir, type);
          if (!content) {
            server.config.logger.warn(`[carousel] conteúdo "${type}" não encontrado no output`);
            return sendJson(res, 404, { error: "content not found" });
          }
          server.config.logger.info(`[carousel] conteúdo "${type}" lido (${content.length} chars)`);
          return sendJson(res, 200, { content });
        }

        // POST /api/carousel/checkpoint/:step
        const checkpointMatch = pathname.match(
          /^\/api\/carousel\/checkpoint\/(.+)$/
        );
        if (req.method === "POST" && checkpointMatch) {
          const step = checkpointMatch[1];
          server.config.logger.info(`[carousel] POST /api/carousel/checkpoint/${step}`);
          const fileName = CHECKPOINT_STEP_MAP[step];
          if (!fileName) {
            server.config.logger.warn(`[carousel] step desconhecido: "${step}"`);
            return sendJson(res, 400, { error: "unknown step" });
          }

          try {
            const body = (await parseBody(req)) as Record<string, string>;
            const responseContent = body.editedContent ?? body.response ?? "ok";

            server.config.logger.info(`[carousel] escrevendo resposta do checkpoint → ${fileName}`);
            await fsp.mkdir(stepsDir, { recursive: true });
            await fsp.writeFile(
              path.join(stepsDir, fileName),
              responseContent + "\n",
              "utf-8"
            );
            server.config.logger.info(`[carousel] checkpoint "${step}" respondido — pipeline pode continuar`);
            return sendJson(res, 200, { ok: true });
          } catch (err) {
            server.config.logger.error(`[carousel] /checkpoint error: ${err}`);
            return sendJson(res, 500, { error: "internal error" });
          }
        }

        // GET /api/carousel/sse — Server-Sent Events (for Cloudflare / fallback)
        if (req.method === "GET" && pathname === "/api/carousel/sse") {
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });
          res.write(":\n\n"); // comment keep-alive

          const interval = setInterval(async () => {
            const state = await readSquadState(squadsDir);
            if (state) {
              res.write(
                `data: ${JSON.stringify({ type: "CAROUSEL_UPDATE", state })}\n\n`
              );
            }
          }, 2000);

          req.on("close", () => clearInterval(interval));
          return; // don't call next()
        }

        next();
      });
    },
  };
}
