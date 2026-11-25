import { list, record, str } from "../../parse.ts";

export type DocSummary = { readonly id: string; readonly title: string; readonly summary: string };
export type DocView = { readonly id: string; readonly title: string; readonly html: string };
export type Sample = { readonly id: string; readonly title: string; readonly code: string };

export function parseDocs(raw: unknown): DocSummary[] {
  return list(raw, "docs", (item) => {
    const o = record(item, "doc");
    return { id: str(o, "id"), title: str(o, "title"), summary: str(o, "summary") };
  });
}

export function parseDoc(raw: unknown): DocView {
  const o = record(raw, "doc");
  return { id: str(o, "id"), title: str(o, "title"), html: str(o, "html") };
}

export function parseSamples(raw: unknown): Sample[] {
  return list(raw, "samples", (item) => {
    const o = record(item, "sample");
    return { id: str(o, "id"), title: str(o, "title"), code: str(o, "code") };
  });
}

export type DocSegment = { readonly kind: "html"; readonly html: string } | { readonly kind: "code"; readonly lang: string; readonly code: string };

function unescape(s: string): string {
  return s.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
}

export function splitDoc(html: string): DocSegment[] {
  const out: DocSegment[] = [];
  const re = /<pre class="code" data-lang="([^"]*)"><code>([\s\S]*?)<\/code><\/pre>/g;
  let last = 0;
  for (const m of html.matchAll(re)) {
    if (m.index > last) out.push({ kind: "html", html: html.slice(last, m.index) });
    out.push({ kind: "code", lang: unescape(m[1] ?? "text"), code: unescape(m[2] ?? "") });
    last = m.index + m[0].length;
  }
  if (last < html.length) out.push({ kind: "html", html: html.slice(last) });
  return out;
}

export function isRunnable(lang: string): boolean {
  return lang === "ts";
}
