import { describe, expect, test } from "bun:test";
import { createApi } from "../src/api.ts";
import { buildCompleter } from "../src/complete.ts";
import type { Content } from "../src/content.ts";
import { AppError } from "../src/errors.ts";
import type { Runner } from "../src/runner.ts";

const content: Content = {
  docs: [{ id: "promises", title: "Promises", summary: "s" }],
  samples: [{ id: "hello", title: "Hello", code: "console.log(1);" }],
  doc(id) {
    if (id !== "promises") throw new AppError("not_found", "nope");
    return { id, title: "Promises", html: "<p>x</p>" };
  },
};

const fakeRunner: Runner = {
  async run(code) {
    if (code === "") throw new AppError("bad_request", "code is empty");
    if (code === "crash") throw new Error("disk full");
    return { stdout: "ok\n", stderr: "", exitCode: 0, durationMs: 5, timedOut: false, phase: "run" };
  },
};

const handle = createApi({ runner: fakeRunner, completer: buildCompleter(), content, versions: { typescript: "7.0.2", bun: "1.4.4" }, newId: () => "fixed-id" });
const call = (path: string, init?: RequestInit) => handle(new Request("http://localhost" + path, init));
const post = (path: string, body: string) => call(path, { method: "POST", body });

describe("api", () => {
  test("health lists every service the desktop boot screen shows", async () => {
    const body: unknown = await (await call("/api/health")).json();
    expect(body).toMatchObject({ status: "ok" });
    for (const name of ["TypeScript 7.0.2 type checker", "Bun 1.4.4 runtime", "Docs (1 topics)", "Samples (1 programs)"]) expect(JSON.stringify(body)).toContain(name);
  });

  test("run returns the runner result", async () => {
    const res = await post("/api/run", JSON.stringify({ code: "console.log(1)" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ stdout: "ok\n", exitCode: 0 });
  });

  test("maps errors to status codes in one place", async () => {
    expect((await post("/api/run", "not json")).status).toBe(400);
    expect((await post("/api/run", JSON.stringify({ code: 1 }))).status).toBe(400);
    expect((await post("/api/run", JSON.stringify({ code: "" }))).status).toBe(400);
    expect((await call("/api/docs/missing")).status).toBe(404);
    expect((await call("/api/nope")).status).toBe(404);
    const crash = await post("/api/run", JSON.stringify({ code: "crash" }));
    expect(crash.status).toBe(500);
    expect(await crash.json()).toEqual({ error: "internal error" });
  });

  test("format returns formatted code, or 400 for unbalanced code", async () => {
    expect(await (await post("/api/format", JSON.stringify({ code: "if (a) {\nb();\n}" }))).json()).toEqual({ code: "if (a) {\n  b();\n}\n" });
    expect((await post("/api/format", JSON.stringify({ code: "{" }))).status).toBe(400);
  });

  test("rejects oversized bodies", async () => {
    expect((await post("/api/run", JSON.stringify({ code: "x".repeat(300 * 1024) }))).status).toBe(400);
  });

  test("echoes or creates the correlation id so logs can be followed", async () => {
    expect((await call("/api/docs")).headers.get("X-Correlation-Id")).toBe("fixed-id");
    expect((await call("/api/docs", { headers: { "X-Correlation-Id": "abc" } })).headers.get("X-Correlation-Id")).toBe("abc");
  });

  test("completion, docs and samples", async () => {
    expect(await (await call("/api/complete?prefix=Promise.ra")).json()).toContainEqual(expect.objectContaining({ label: "race" }));
    expect(await (await call("/api/docs/promises")).json()).toEqual({ id: "promises", title: "Promises", html: "<p>x</p>" });
    expect(await (await call("/api/samples")).json()).toHaveLength(1);
  });
});
