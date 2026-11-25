import { describe, expect, test } from "bun:test";
import { tscPath } from "../src/config.ts";
import { AppError } from "../src/errors.ts";
import { createRunner } from "../src/runner.ts";

const runner = createRunner({ bunPath: process.execPath, tscPath: tscPath(), timeoutMs: 4000, maxOutputBytes: 2048 });

describe("runner", () => {
  test("type checks then runs, returning stdout and exit 0", async () => {
    const res = await runner.run('const n: number = 41;\nconsole.log(n + 1);');
    expect(res).toMatchObject({ stdout: "42\n", exitCode: 0, phase: "run", timedOut: false });
  });

  test("type errors stop the run and report main.ts line and column so the gutter can mark them", async () => {
    const res = await runner.run('console.log("before");\nconst n: number = "x";');
    expect(res.phase).toBe("typecheck");
    expect(res.exitCode).not.toBe(0);
    expect(res.stdout).toBe("");
    expect(res.stderr).toContain("main.ts(2,7): error TS2322");
    expect(res.stderr).not.toContain("tsplay-");
  });

  test("returns the program's real exit code and runtime errors", async () => {
    const res = await runner.run('throw new Error("boom");');
    expect(res.phase).toBe("run");
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain("boom");
  });

  test("kills programs that run past the timeout", async () => {
    const fast = createRunner({ bunPath: process.execPath, tscPath: tscPath(), timeoutMs: 1500, maxOutputBytes: 2048 });
    const res = await fast.run("setInterval(() => {}, 1000);");
    expect(res.timedOut).toBe(true);
    expect(res.exitCode).toBe(-1);
    expect(res.stderr).toContain("timeout after 1.5s");
  });

  test("caps output floods so memory stays bounded", async () => {
    const res = await runner.run('for (let i = 0; i < 5000; i++) console.log("line " + i);');
    expect(res.stdout).toContain("[output truncated]");
    expect(res.stdout.length).toBeLessThan(2200);
  });

  test("rejects empty code as a bad request", async () => {
    expect(runner.run("   ")).rejects.toBeInstanceOf(AppError);
  });
});
