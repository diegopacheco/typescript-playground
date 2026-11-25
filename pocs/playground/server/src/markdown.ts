const BOLD = /\*\*([^*]+)\*\*/g;
const ITALIC = /(^|[^*])\*([^*\s][^*]*)\*/g;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const ORDERED = /^\d+\.\s+/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const CALLOUTS = ["TIP", "WARNING", "NOTE", "INFO"] as const;

export function escapeHTML(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function inline(s: string): string {
  const parts = s.split("`");
  return parts
    .map((p, i) => {
      if (i % 2 === 1 && i < parts.length - 1) return `<code>${escapeHTML(p)}</code>`;
      const prefix = i % 2 === 1 ? "`" : "";
      return (
        prefix +
        escapeHTML(p)
          .replace(LINK, '<a href="$2" target="_blank" rel="noopener">$1</a>')
          .replace(BOLD, "<strong>$1</strong>")
          .replace(ITALIC, "$1<em>$2</em>")
      );
    })
    .join("");
}

function isBlockStart(t: string): boolean {
  return t === "" || t.startsWith("#") || t.startsWith("```") || t.startsWith(">") || t.startsWith("|") || t.startsWith("- ") || t.startsWith("* ") || ORDERED.test(t);
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function isSeparator(row: readonly string[]): boolean {
  return row.every((c) => c.replace(/[-: ]/g, "") === "");
}

export function renderMarkdown(src: string): string {
  const lines = src.replaceAll("\r\n", "\n").split("\n");
  const out: string[] = [];
  let pos = 0;
  const at = (i: number) => (lines[i] ?? "").trim();
  const collect = (keep: (t: string) => boolean): string[] => {
    const body: string[] = [];
    while (pos < lines.length && keep(at(pos))) body.push(at(pos++));
    return body;
  };
  const list = (tag: "ul" | "ol", strip: (t: string) => string | null) => {
    const items: string[] = [];
    for (let text = strip(at(pos)); pos < lines.length && text !== null; text = strip(at(++pos))) items.push(`<li>${inline(text)}</li>`);
    out.push(`<${tag}>\n${items.join("\n")}\n</${tag}>`);
  };
  while (pos < lines.length) {
    const t = at(pos);
    const heading = HEADING.exec(t);
    if (t === "") pos++;
    else if (t.startsWith("```")) {
      const lang = t.slice(3).trim() || "text";
      pos++;
      const body: string[] = [];
      while (pos < lines.length && !at(pos).startsWith("```")) body.push(lines[pos++] ?? "");
      pos++;
      out.push(`<pre class="code" data-lang="${escapeHTML(lang)}"><code>${escapeHTML(body.join("\n"))}</code></pre>`);
    } else if (heading) {
      const level = heading[1]?.length ?? 1;
      const text = heading[2] ?? "";
      out.push(`<h${level} id="${slug(text)}">${inline(text)}</h${level}>`);
      pos++;
    } else if (t === "---") {
      out.push("<hr>");
      pos++;
    } else if (t.startsWith(">")) {
      const body = collect((l) => l.startsWith(">")).map((l) => l.slice(1).trim());
      const first = body[0] ?? "";
      const kind = CALLOUTS.find((k) => first.startsWith(`[!${k}]`));
      if (kind) body[0] = first.slice(kind.length + 3).trim();
      out.push(`<blockquote class="callout ${(kind ?? "NOTE").toLowerCase()}"><p>${inline(body.join(" ").trim())}</p></blockquote>`);
    } else if (t.startsWith("|")) {
      const rows = collect((l) => l.startsWith("|")).map(cells);
      const html = rows
        .filter((row, i) => !(i === 1 && isSeparator(row)))
        .map((row, i) => {
          const tag = i === 0 ? "th" : "td";
          return `<tr>${row.map((c) => `<${tag}>${inline(c)}</${tag}>`).join("")}</tr>`;
        });
      out.push(`<table>\n${html.join("\n")}\n</table>`);
    } else if (t.startsWith("- ") || t.startsWith("* ")) {
      list("ul", (l) => (l.startsWith("- ") || l.startsWith("* ") ? l.slice(2) : null));
    } else if (ORDERED.test(t)) {
      list("ol", (l) => (ORDERED.test(l) ? l.replace(ORDERED, "") : null));
    } else {
      const body = [at(pos++), ...collect((l) => !isBlockStart(l))];
      out.push(`<p>${inline(body.join(" "))}</p>`);
    }
  }
  return out.join("\n") + "\n";
}
