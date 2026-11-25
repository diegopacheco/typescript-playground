import { describe, expect, test } from "bun:test";
import { inline, renderMarkdown, slug } from "../src/markdown.ts";

describe("renderMarkdown", () => {
  test("escapes HTML so doc text can never inject markup", () => {
    expect(inline("<script>")).toBe("&lt;script&gt;");
    expect(renderMarkdown("```ts\nconst a = 1 < 2;\n```")).toContain("1 &lt; 2");
  });

  test("tags code fences with their language so the UI knows which blocks are runnable", () => {
    expect(renderMarkdown("```ts\nx\n```")).toContain('<pre class="code" data-lang="ts">');
    expect(renderMarkdown("```\nx\n```")).toContain('data-lang="text"');
  });

  test("turns typed blockquotes into callouts and defaults to note", () => {
    expect(renderMarkdown("> [!WARNING] careful")).toBe('<blockquote class="callout warning"><p>careful</p></blockquote>\n');
    expect(renderMarkdown("> plain")).toContain("callout note");
  });

  test("renders tables and skips the separator row", () => {
    const html = renderMarkdown("| A | B |\n|---|---|\n| 1 | `x` |");
    expect(html).toContain("<tr><th>A</th><th>B</th></tr>");
    expect(html).toContain("<tr><td>1</td><td><code>x</code></td></tr>");
    expect(html).not.toContain("---");
  });

  test("renders lists, headings with anchors and inline styles", () => {
    const html = renderMarkdown("## Async / Await\n\n- **bold** and *it*\n- [link](https://x.dev)\n\n1. one\n2. two");
    expect(html).toContain('<h2 id="async-await">');
    expect(html).toContain("<li><strong>bold</strong> and <em>it</em></li>");
    expect(html).toContain('<a href="https://x.dev" target="_blank" rel="noopener">link</a>');
    expect(html).toContain("<ol>");
  });

  test("joins wrapped paragraph lines", () => {
    expect(renderMarkdown("one\ntwo")).toBe("<p>one two</p>\n");
  });

  test("slug", () => {
    expect(slug(" Promise.all & race! ")).toBe("promise-all-race");
  });
});
