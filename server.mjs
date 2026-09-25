// Servidor local do protótipo O Sócio.
// Serve a página e repassa as perguntas para a API da Anthropic.
// A chave fica só aqui (arquivo .env), nunca no navegador.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { montarPagina } from "./pagina.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
try { process.loadEnvFile(path.join(here, ".env")); } catch { /* sem .env: modo demonstração */ }

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;
const MODEL = "claude-opus-5";
const hasKey = Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim());
const client = hasKey ? new Anthropic() : null;
let useFallbacks = true;

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > 1_000_000) { reject(new Error("corpo grande demais")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function mapError(err) {
  if (err instanceof Anthropic.AuthenticationError) return { status: 401, code: "auth", message: "A chave da API é inválida." };
  if (err instanceof Anthropic.PermissionDeniedError) return { status: 403, code: "auth", message: "A chave não tem permissão para este modelo." };
  if (err instanceof Anthropic.RateLimitError) return { status: 429, code: "rate_limited", message: "Limite de uso atingido." };
  if (err instanceof Anthropic.BadRequestError) return { status: 400, code: "invalid_request", message: err.message };
  if (err instanceof Anthropic.APIConnectionError) return { status: 502, code: "upstream_error", message: "Sem conexão com a API." };
  if (err instanceof Anthropic.APIError) return { status: 502, code: "upstream_error", message: err.message };
  return { status: 500, code: "upstream_error", message: String((err && err.message) || err) };
}

function openStream(system, messages, voz) {
  const params = {
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: voz ? "low" : "medium" },
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
  };
  if (useFallbacks) {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default";
  }
  return client.beta.messages.stream(params);
}

async function chat(req, res) {
  let body;
  try { body = JSON.parse(await readBody(req)); } catch { return json(res, 400, { code: "invalid_request", message: "Pedido inválido." }); }
  if (!client) return json(res, 503, { code: "no_key", message: "Configure ANTHROPIC_API_KEY no arquivo .env." });

  const system = typeof body.system === "string" ? body.system : "";
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content }));
  if (!system || !messages.length || messages[0].role !== "user") return json(res, 400, { code: "invalid_request", message: "Conversa inválida." });

  let started = false;
  let stream = null;
  res.on("close", () => { if (!res.writableEnded && stream) stream.abort(); });

  for (let attempt = 0; attempt < 2; attempt++) {
    stream = openStream(system, messages, Boolean(body.voz || body.rapido));
    try {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          if (!started) {
            started = true;
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
          }
          res.write(event.delta.text);
        }
      }
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") {
        if (!started) return json(res, 422, { code: "refused", message: "O modelo recusou este pedido." });
        res.write("\n\n(Não consigo continuar esta resposta.)");
      }
      if (!started) return json(res, 502, { code: "empty_completion", message: "Resposta vazia." });
      return res.end();
    } catch (err) {
      if (res.destroyed) return;
      // Conta sem acesso ao parâmetro de fallback: tenta de novo sem ele.
      if (!started && useFallbacks && err instanceof Anthropic.BadRequestError && /fallback/i.test(err.message)) {
        useFallbacks = false;
        continue;
      }
      const m = mapError(err);
      console.error(`[erro ${m.status}] ${m.message}`);
      if (!started) return json(res, m.status, { code: m.code, message: m.message });
      return res.destroy();
    }
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}`);
  try {
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      const page = await readFile(path.join(here, "o-socio.html"), "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(montarPagina(page));
    }
    if (req.method === "GET" && url.pathname === "/api/status") return json(res, 200, { ok: true, key: hasKey, model: MODEL });
    if (req.method === "POST" && url.pathname === "/api/chat") return await chat(req, res);
    // Uma nova janela do iniciar.bat pede para esta versão antiga fechar.
    if (req.method === "POST" && url.pathname === "/api/encerrar" && req.headers["x-socio"] === "encerrar") {
      json(res, 200, { ok: true });
      console.log("\n  Outra janela do O Sócio foi aberta. Esta será fechada.");
      return setTimeout(() => process.exit(0), 200);
    }
    res.writeHead(404).end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) json(res, 500, { code: "upstream_error", message: "Erro no servidor local." });
    else res.destroy();
  }
});

let tentouLiberar = false;
server.on("error", async (err) => {
  if (err.code !== "EADDRINUSE") throw err;
  if (!tentouLiberar) {
    tentouLiberar = true;
    try {
      const st = await fetch(`http://${HOST}:${PORT}/api/status`).then((r) => r.json());
      if (st && st.ok) {
        console.log("  Uma janela antiga do O Sócio estava aberta. Substituindo…");
        await fetch(`http://${HOST}:${PORT}/api/encerrar`, { method: "POST", headers: { "x-socio": "encerrar" } }).catch(() => {});
        await new Promise((r) => setTimeout(r, 800));
        return server.listen(PORT, HOST);
      }
    } catch { /* não é o O Sócio */ }
  }
  console.error(`\n  A porta ${PORT} está ocupada por outro programa.`);
  console.error("  Feche as outras janelas pretas do O Sócio (ou reinicie o computador) e tente de novo.\n");
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}`;
  console.log(`\n  O Sócio rodando em ${url}`);
  console.log(hasKey ? `  IA: ${MODEL} (chave carregada do .env)` : "  Sem chave no .env: o protótipo abre em modo demonstração.");
  console.log("  Para encerrar, feche esta janela.\n");
  if (process.argv.includes("--abrir") && process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  }
});
