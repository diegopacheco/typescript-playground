import { describe, expect, test } from "bun:test";
import { highlight, tokenize } from "../src/editor/highlight.ts";

const kinds = (src: string) => tokenize(src).filter((t) => t.kind !== "ws").map((t) => [t.text, t.kind]);

describe("highlight", () => {
  test("classifies TypeScript words so types, keywords and calls get distinct colors", () => {
    expect(kinds("const n: number = Math.max(1, 2n);")).toEqual([
      ["const", "kw"], ["n", "id"], [":", "op"], ["number", "ty"], ["=", "op"], ["Math", "bi"], [".", "pun"], ["max", "fn"], ["(", "pun"], ["1", "num"], [",", "pun"], ["2n", "num"], [")", "pun"], [";", "pun"],
    ]);
  });

  test("gives the arrow its own token so async callbacks stand out", () => {
    expect(kinds("(x) => x")).toContainEqual(["=>", "arrow"]);
  });

  test("keeps template literals, comments and strings whole even with code-like content", () => {
    expect(kinds("`a ${b} // c`")).toEqual([["`a ${b} // c`", "str"]]);
    expect(kinds("// const x")).toEqual([["// const x", "com"]]);
    expect(kinds("'it\\'s'")).toEqual([["'it\\'s'", "str"]]);
  });

  test("marks capitalized names as classes and members after a dot as properties", () => {
    expect(kinds("new Stack<T>()")).toContainEqual(["Stack", "cls"]);
    expect(kinds("task.kind")).toContainEqual(["kind", "prop"]);
  });

  test("escapes HTML so code can never inject markup into the editor", () => {
    expect(highlight("a < b && '<img>'")).not.toContain("<img>");
    expect(highlight("a < b")).toContain("&lt;");
  });

  test("round-trips the source text exactly, or the overlay would drift from the textarea", () => {
    const src = "type A<T> = { readonly x: T };\nconst f = async () => { await 1; };\n";
    expect(tokenize(src).map((t) => t.text).join("")).toBe(src);
  });
});
