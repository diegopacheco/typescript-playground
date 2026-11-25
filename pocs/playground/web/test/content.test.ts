import { describe, expect, test } from "bun:test";
import { parseRunResult } from "../src/features/runner/types.ts";
import { splitDoc } from "../src/features/content/types.ts";

describe("doc splitting", () => {
  test("pulls code blocks out of doc html with their language and unescaped source", () => {
    const segs = splitDoc('<h1>T</h1>\n<pre class="code" data-lang="ts"><code>if (a &lt; b &amp;&amp; c) {}</code></pre>\n<p>end</p>');
    expect(segs).toEqual([
      { kind: "html", html: "<h1>T</h1>\n" },
      { kind: "code", lang: "ts", code: "if (a < b && c) {}" },
      { kind: "html", html: "\n<p>end</p>" },
    ]);
  });
});

describe("run result parsing", () => {
  test("rejects payloads that do not match the contract", () => {
    expect(() => parseRunResult({ stdout: "", stderr: "", exitCode: "0", durationMs: 1, timedOut: false, phase: "run" })).toThrow();
    expect(() => parseRunResult({ stdout: "", stderr: "", exitCode: 0, durationMs: 1, timedOut: false, phase: "boot" })).toThrow();
    expect(parseRunResult({ stdout: "a", stderr: "", exitCode: 0, durationMs: 1, timedOut: false, phase: "run" }).stdout).toBe("a");
  });
});
