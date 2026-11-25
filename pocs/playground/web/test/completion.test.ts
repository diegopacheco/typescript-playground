import { describe, expect, test } from "bun:test";
import { caretPosition, errorLines, indentFor, insertionFor, wordBeforeCaret } from "../src/editor/completion.ts";

describe("completion helpers", () => {
  test("finds the qualified word before the caret and where to replace from", () => {
    expect(wordBeforeCaret("await Promise.al", 16)).toEqual({ query: "Promise.al", replaceFrom: 14 });
    expect(wordBeforeCaret("x = con", 7)).toEqual({ query: "con", replaceFrom: 4 });
    expect(wordBeforeCaret("console.", 8)).toEqual({ query: "console.", replaceFrom: 8 });
  });

  test("calls get parentheses with the caret inside", () => {
    expect(insertionFor({ label: "all", kind: "method", detail: "" })).toEqual({ text: "all()", caretBack: 1 });
    expect(insertionFor({ label: "PI", kind: "const", detail: "" })).toEqual({ text: "PI", caretBack: 0 });
  });

  test("snippets put the caret at $0 and keep the current indentation on new lines", () => {
    const res = insertionFor({ label: "forof", kind: "snippet", detail: "", insert: "for (const item of $0) {\n}" }, "  ");
    expect(res.text).toBe("for (const item of ) {\n  }");
    expect(res.text.length - res.caretBack).toBe("for (const item of ".length);
  });

  test("indents one level after an opener or an arrow", () => {
    expect(indentFor("  if (a) {", 10)).toBe("    ");
    expect(indentFor("  const f = () =>", 17)).toBe("    ");
    expect(indentFor("  x();", 6)).toBe("  ");
  });

  test("caret position counts tabs to the next stop", () => {
    expect(caretPosition("a\n\tb", 4)).toEqual({ line: 1, col: 3 });
  });

  test("error lines come from both type checker and runtime stack traces", () => {
    expect([...errorLines("main.ts(4,6): error TS2540\nmain.ts(5,7): error\n at main.ts:9:3")]).toEqual([4, 5, 9]);
  });
});
