import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { tscPath } from "../src/config.ts";
import { loadContent, runnableBlocks } from "../src/content.ts";
import { createRunner } from "../src/runner.ts";

const dir = join(import.meta.dir, "..", "content");
const content = await loadContent(dir);
const runner = createRunner({ bunPath: process.execPath, tscPath: tscPath(), timeoutMs: 8000, maxOutputBytes: 64 * 1024 });

describe("content", () => {
  test("loads every doc with a title, a summary and rendered html", () => {
    expect(content.docs.length).toBe(11);
    for (const d of content.docs) {
      expect(d.title).not.toBe("");
      expect(d.summary).not.toBe("");
      expect(content.doc(d.id).html).toContain("<h1");
    }
  });

  test("loads the samples in the order of samples.json", () => {
    expect(content.samples.length).toBe(13);
    expect(content.samples[0]?.id).toBe("hello");
  });

  for (const s of content.samples) {
    test(`sample ${s.id} type checks and exits 0, so a broken sample fails the build`, async () => {
      const res = await runner.run(s.code);
      expect(res.stderr).toBe("");
      expect(res.exitCode).toBe(0);
    }, 15000);
  }

  for (const d of content.docs) {
    test(`every ts block in doc ${d.id} runs, because each gets a Run in Playground button`, async () => {
      const markdown = await Bun.file(join(dir, "docs", (await Array.fromAsync(new Bun.Glob(`*-${d.id}.md`).scan(join(dir, "docs"))))[0] ?? "")).text();
      const blocks = runnableBlocks(markdown);
      expect(blocks.length).toBeGreaterThan(0);
      for (const code of blocks) {
        const res = await runner.run(code);
        expect({ code, stderr: res.stderr, exitCode: res.exitCode }).toEqual({ code, stderr: "", exitCode: 0 });
      }
    }, 60000);
  }
});
