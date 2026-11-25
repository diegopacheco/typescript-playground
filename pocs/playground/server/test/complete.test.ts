import { describe, expect, test } from "bun:test";
import { buildCompleter } from "../src/complete.ts";

const completer = buildCompleter();
const labels = (prefix: string) => completer.query(prefix, 40).map((i) => i.label);

describe("completer", () => {
  test("suggests static members read from the live runtime", () => {
    expect(labels("Promise.al")).toEqual(expect.arrayContaining(["all", "allSettled"]));
    expect(labels("console.lo")).toContain("log");
    expect(completer.query("Math.P", 5)[0]).toMatchObject({ label: "PI", kind: "const" });
  });

  test("suggests instance methods with their owner types after an unknown receiver", () => {
    const map = completer.query("items.ma", 10).find((i) => i.label === "map");
    expect(map?.kind).toBe("method");
    expect(map?.detail).toContain("Array");
  });

  test("offers keywords, types, globals and snippets at the top level", () => {
    expect(labels("aw")).toContain("await");
    expect(labels("Parti")).toContain("Partial");
    expect(completer.query("Prom", 5).find((i) => i.label === "Promise")?.kind).toBe("class");
    expect(completer.query("fora", 5)[0]?.insert).toContain("for await");
  });

  test("ranks exact-case prefix matches first, then shorter labels", () => {
    expect(labels("con")[0]).toBe("const");
  });

  test("returns nothing for an empty prefix and honors the limit", () => {
    expect(labels("")).toEqual([]);
    expect(completer.query("a", 3)).toHaveLength(3);
  });

  test("ignores globals missing from the scope", () => {
    const small = buildCompleter({ console });
    expect(small.query("Promise.a", 5)).not.toContainEqual(expect.objectContaining({ label: "all" }));
    expect(small.size()).toBeLessThan(completer.size());
  });
});
