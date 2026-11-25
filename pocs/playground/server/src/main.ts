import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createApi } from "./api.ts";
import { buildCompleter } from "./complete.ts";
import { loadConfig } from "./config.ts";
import { loadContent } from "./content.ts";
import { logger } from "./logger.ts";
import { createRunner } from "./runner.ts";
import { staticFiles } from "./static.ts";

async function typescriptVersion(tscPath: string): Promise<string> {
  const pkg: unknown = JSON.parse(await readFile(join(dirname(dirname(tscPath)), "package.json"), "utf8"));
  if (typeof pkg === "object" && pkg !== null && "version" in pkg && typeof pkg.version === "string") return pkg.version;
  throw new Error("cannot read the typescript version");
}

async function start(): Promise<void> {
  const config = loadConfig();
  const content = await loadContent(config.contentDir);
  const completer = buildCompleter();
  const handle = createApi({
    runner: createRunner({ bunPath: config.bunPath, tscPath: config.tscPath, timeoutMs: config.runTimeoutMs, maxOutputBytes: config.maxOutputBytes }),
    completer,
    content,
    versions: { typescript: await typescriptVersion(config.tscPath), bun: Bun.version },
    statics: staticFiles(config.webDir),
  });
  const server = Bun.serve({ hostname: config.host, port: config.port, fetch: handle, idleTimeout: 30 });
  logger.info("listening", { url: `http://${config.host}:${server.port}`, symbols: completer.size(), docs: content.docs.length, samples: content.samples.length });
  const stop = () => {
    logger.info("shutting down");
    void server.stop().then(() => process.exit(0));
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

start().catch((err: unknown) => {
  logger.error("server failed to start", { error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
