import { dirname, join, resolve } from "node:path";

export type Config = {
  readonly host: string;
  readonly port: number;
  readonly runTimeoutMs: number;
  readonly maxOutputBytes: number;
  readonly webDir: string;
  readonly contentDir: string;
  readonly tscPath: string;
  readonly bunPath: string;
};

type Env = Readonly<Record<string, string | undefined>>;

function number(env: Env, name: string, fallback?: number): number {
  const raw = env[name];
  if (raw === undefined || raw === "") {
    if (fallback === undefined) throw new Error(`${name} is required`);
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer, got "${raw}"`);
  return value;
}

export function tscPath(): string {
  return join(dirname(Bun.resolveSync("typescript/package.json", import.meta.dir)), "lib", "tsc.js");
}

export function loadConfig(env: Env = Bun.env): Config {
  const serverDir = resolve(import.meta.dir, "..");
  return {
    host: env.HOST ?? "127.0.0.1",
    port: number(env, "PORT"),
    runTimeoutMs: number(env, "RUN_TIMEOUT_MS", 10_000),
    maxOutputBytes: number(env, "MAX_OUTPUT_BYTES", 64 * 1024),
    webDir: resolve(serverDir, "..", "web", "dist"),
    contentDir: join(serverDir, "content"),
    tscPath: tscPath(),
    bunPath: process.execPath,
  };
}
