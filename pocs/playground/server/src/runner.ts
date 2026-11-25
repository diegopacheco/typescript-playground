import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { capture } from "./capture.ts";
import { AppError } from "./errors.ts";

export type Phase = "typecheck" | "run";

export type RunResult = {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
  readonly durationMs: number;
  readonly timedOut: boolean;
  readonly phase: Phase;
};

export type Runner = { run(code: string): Promise<RunResult> };

export type RunnerOptions = {
  readonly bunPath: string;
  readonly tscPath: string;
  readonly timeoutMs: number;
  readonly maxOutputBytes: number;
  readonly now?: () => number;
};

export const PROGRAM_TSCONFIG = {
  compilerOptions: {
    strict: true,
    noEmit: true,
    target: "esnext",
    module: "esnext",
    moduleDetection: "force",
    lib: ["esnext", "dom"],
    skipLibCheck: true,
    types: [],
  },
  files: ["main.ts"],
} as const;

type Exec = { readonly stdout: string; readonly stderr: string; readonly exitCode: number; readonly timedOut: boolean };

async function exec(cmd: readonly string[], dir: string, deadline: number, now: () => number, maxOutputBytes: number): Promise<Exec> {
  const proc = Bun.spawn([...cmd], {
    cwd: dir,
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    proc.kill("SIGKILL");
  }, Math.max(0, deadline - now()));
  const [stdout, stderr, exitCode] = await Promise.all([capture(proc.stdout, maxOutputBytes), capture(proc.stderr, maxOutputBytes), proc.exited]);
  clearTimeout(timer);
  return { stdout: stdout.text, stderr: stderr.text, exitCode: timedOut ? -1 : exitCode, timedOut };
}

export function createRunner(opts: RunnerOptions): Runner {
  const now = opts.now ?? (() => performance.now());
  return {
    async run(code) {
      if (code.trim() === "") throw new AppError("bad_request", "code is empty");
      const dir = await mkdtemp(join(tmpdir(), "tsplay-"));
      try {
        await writeFile(join(dir, "main.ts"), code, { mode: 0o600 });
        await writeFile(join(dir, "tsconfig.json"), JSON.stringify(PROGRAM_TSCONFIG), { mode: 0o600 });
        const start = now();
        const deadline = start + opts.timeoutMs;
        const scrub = (s: string) => s.replaceAll(dir + "/", "");
        const finish = (r: Exec, phase: Phase): RunResult => ({
          stdout: phase === "typecheck" ? "" : scrub(r.stdout),
          stderr: scrub(phase === "typecheck" ? r.stdout + r.stderr : r.stderr) + (r.timedOut ? `\nprogram killed: timeout after ${opts.timeoutMs / 1000}s\n` : ""),
          exitCode: r.exitCode,
          durationMs: Math.round(now() - start),
          timedOut: r.timedOut,
          phase,
        });
        const check = await exec([opts.bunPath, opts.tscPath, "-p", ".", "--pretty", "false"], dir, deadline, now, opts.maxOutputBytes);
        if (check.exitCode !== 0) return finish(check, "typecheck");
        return finish(await exec([opts.bunPath, "main.ts"], dir, deadline, now, opts.maxOutputBytes), "run");
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    },
  };
}
