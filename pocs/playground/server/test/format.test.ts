import { describe, expect, test } from "bun:test";
import { AppError } from "../src/errors.ts";
import { formatCode } from "../src/format.ts";

describe("formatCode", () => {
  test("re-indents nested blocks by bracket depth so messy pasted code reads cleanly", () => {
    const messy = "function f(){\nif (true) {\n        return [\n1,\n2];\n    }\n}";
    expect(formatCode(messy)).toBe("function f(){\n  if (true) {\n    return [\n      1,\n      2];\n  }\n}\n");
  });

  test("indents case bodies one level deeper than the case label", () => {
    const src = 'switch (k) {\ncase "a":\nreturn 1;\ndefault:\nreturn 2;\n}';
    expect(formatCode(src)).toBe('switch (k) {\n  case "a":\n    return 1;\n  default:\n    return 2;\n}\n');
  });

  test("ignores brackets inside strings, comments, templates and regex so they never change indentation", () => {
    const src = 'const a = "{";\nconst b = `}${1}`;\nconst c = /[{]/;\n// {\nconst d = 1;';
    expect(formatCode(src)).toBe(src + "\n");
  });

  test("keeps multi-line template literal content byte for byte", () => {
    const src = "const s = `\n    keep   this\n`;";
    expect(formatCode(src)).toBe(src + "\n");
  });

  test("collapses runs of blank lines and trims trailing whitespace", () => {
    expect(formatCode("a();   \n\n\n\nb();\n\n")).toBe("a();\n\nb();\n");
  });

  test("indents method chains one level", () => {
    expect(formatCode("p\n.then(f)\n.catch(g);")).toBe("p\n  .then(f)\n  .catch(g);\n");
  });

  test("rejects unbalanced code as a bad request instead of producing garbage", () => {
    expect(() => formatCode("function f() {")).toThrow(AppError);
    expect(() => formatCode("}")).toThrow(/line 1/);
  });

  test("is idempotent", () => {
    const once = formatCode("class A {\nm() {\nreturn 1;\n}\n}");
    expect(formatCode(once)).toBe(once);
  });
});
