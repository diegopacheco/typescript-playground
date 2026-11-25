import { bool, num, record, str } from "../../parse.ts";

export type Phase = "typecheck" | "run";

export type RunResult = {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
  readonly durationMs: number;
  readonly timedOut: boolean;
  readonly phase: Phase;
};

export function parseRunResult(raw: unknown): RunResult {
  const o = record(raw, "run result");
  const phase = str(o, "phase");
  if (phase !== "typecheck" && phase !== "run") throw new Error(`unknown phase ${phase}`);
  return { stdout: str(o, "stdout"), stderr: str(o, "stderr"), exitCode: num(o, "exitCode"), durationMs: num(o, "durationMs"), timedOut: bool(o, "timedOut"), phase };
}

export function parseFormatted(raw: unknown): string {
  return str(record(raw, "format"), "code");
}
