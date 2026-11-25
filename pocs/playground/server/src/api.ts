import type { Completer } from "./complete.ts";
import type { Content } from "./content.ts";
import { AppError, statusFor } from "./errors.ts";
import { formatCode } from "./format.ts";
import { CORRELATION_HEADER, logger, withRequestContext } from "./logger.ts";
import type { Runner } from "./runner.ts";
import type { StaticFiles } from "./static.ts";

const MAX_BODY_BYTES = 256 * 1024;
const COMPLETION_LIMIT = 40;

export type Versions = { readonly typescript: string; readonly bun: string };

export type ApiDeps = {
  readonly runner: Runner;
  readonly completer: Completer;
  readonly content: Content;
  readonly versions: Versions;
  readonly statics?: StaticFiles;
  readonly newId?: () => string;
};

type Handler = (req: Request, url: URL, params: readonly string[]) => Promise<Response> | Response;
type Route = { readonly method: string; readonly pattern: RegExp; readonly handle: Handler };

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

async function readCode(req: Request): Promise<string> {
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) throw new AppError("bad_request", "request body is too large");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new AppError("bad_request", "request body must be JSON");
  }
  if (typeof body === "object" && body !== null && "code" in body && typeof body.code === "string") return body.code;
  throw new AppError("bad_request", 'body needs a string "code" field');
}

export function createApi(deps: ApiDeps): (req: Request) => Promise<Response> {
  const newId = deps.newId ?? (() => crypto.randomUUID());
  const routes: readonly Route[] = [
    {
      method: "GET",
      pattern: /^\/api\/health$/,
      handle: () =>
        json(200, {
          status: "ok",
          services: [
            { name: `TypeScript ${deps.versions.typescript} type checker`, status: "ready" },
            { name: `Bun ${deps.versions.bun} runtime`, status: "ready" },
            { name: "API server", status: "ready" },
            { name: `Completion index (${deps.completer.size()} symbols)`, status: "ready" },
            { name: `Docs (${deps.content.docs.length} topics)`, status: "ready" },
            { name: `Samples (${deps.content.samples.length} programs)`, status: "ready" },
          ],
        }),
    },
    {
      method: "POST",
      pattern: /^\/api\/run$/,
      handle: async (req) => {
        const result = await deps.runner.run(await readCode(req));
        logger.info("code run", { exitCode: result.exitCode, phase: result.phase, durationMs: result.durationMs, timedOut: result.timedOut });
        return json(200, result);
      },
    },
    { method: "POST", pattern: /^\/api\/format$/, handle: async (req) => json(200, { code: formatCode(await readCode(req)) }) },
    { method: "GET", pattern: /^\/api\/complete$/, handle: (_req, url) => json(200, deps.completer.query(url.searchParams.get("prefix") ?? "", COMPLETION_LIMIT)) },
    { method: "GET", pattern: /^\/api\/docs$/, handle: () => json(200, deps.content.docs) },
    { method: "GET", pattern: /^\/api\/docs\/([\w-]+)$/, handle: (_req, _url, [id]) => json(200, deps.content.doc(id ?? "")) },
    { method: "GET", pattern: /^\/api\/samples$/, handle: () => json(200, deps.content.samples) },
  ];

  async function dispatch(req: Request, url: URL): Promise<Response> {
    for (const route of routes) {
      const match = route.pattern.exec(url.pathname);
      if (match && route.method === req.method) return route.handle(req, url, match.slice(1));
    }
    if (url.pathname.startsWith("/api/")) throw new AppError("not_found", `no route for ${req.method} ${url.pathname}`);
    const file = req.method === "GET" ? await deps.statics?.serve(url.pathname) : null;
    if (!file) throw new AppError("not_found", "not found");
    return file;
  }

  return async (req) => {
    const url = new URL(req.url);
    const correlationId = req.headers.get(CORRELATION_HEADER) ?? newId();
    return withRequestContext({ correlationId, path: url.pathname, userId: "local" }, async () => {
      let res: Response;
      try {
        res = await dispatch(req, url);
      } catch (err: unknown) {
        const status = statusFor(err);
        if (status === 500) logger.error("request failed", { error: err instanceof Error ? err.message : String(err) });
        res = json(status, { error: status === 500 ? "internal error" : err instanceof Error ? err.message : "error" });
      }
      res.headers.set(CORRELATION_HEADER, correlationId);
      return res;
    });
  };
}
