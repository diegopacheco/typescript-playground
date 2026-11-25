import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { AppError } from "./errors.ts";
import { renderMarkdown } from "./markdown.ts";

export type DocSummary = { readonly id: string; readonly title: string; readonly summary: string };
export type Doc = DocSummary & { readonly markdown: string };
export type DocView = { readonly id: string; readonly title: string; readonly html: string };
export type Sample = { readonly id: string; readonly title: string; readonly code: string };

export type Content = {
  readonly docs: readonly DocSummary[];
  readonly samples: readonly Sample[];
  doc(id: string): DocView;
};

type SampleEntry = { readonly id: string; readonly title: string };

function parseSampleIndex(raw: unknown): SampleEntry[] {
  if (!Array.isArray(raw)) throw new Error("samples.json must be an array");
  return raw.map((entry: unknown, i) => {
    if (typeof entry === "object" && entry !== null && "id" in entry && typeof entry.id === "string" && "title" in entry && typeof entry.title === "string") {
      return { id: entry.id, title: entry.title };
    }
    throw new Error(`samples.json entry ${i} needs a string id and title`);
  });
}

export function parseDoc(fileName: string, markdown: string): Doc {
  const base = fileName.replace(/\.md$/, "");
  const id = base.replace(/^\d+-/, "");
  const lines = markdown.split("\n").map((l) => l.trim());
  const titleAt = lines.findIndex((l) => l.startsWith("# "));
  const title = titleAt >= 0 ? (lines[titleAt] ?? "").slice(2) : id;
  const summary = (lines.slice(titleAt + 1).find((l) => l !== "") ?? "").replaceAll("`", "");
  return { id, title, summary, markdown };
}

export async function loadContent(dir: string): Promise<Content> {
  const docFiles = (await readdir(join(dir, "docs"))).filter((f) => f.endsWith(".md")).sort();
  const docs = await Promise.all(docFiles.map(async (f) => parseDoc(f, await readFile(join(dir, "docs", f), "utf8"))));
  const index = parseSampleIndex(JSON.parse(await readFile(join(dir, "samples.json"), "utf8")));
  const samples = await Promise.all(index.map(async (s) => ({ ...s, code: await readFile(join(dir, "samples", `${s.id}.ts`), "utf8") })));
  const rendered = new Map(docs.map((d) => [d.id, { id: d.id, title: d.title, html: renderMarkdown(d.markdown) }]));
  return {
    docs: docs.map(({ id, title, summary }) => ({ id, title, summary })),
    samples,
    doc(id) {
      const view = rendered.get(id);
      if (!view) throw new AppError("not_found", `doc "${id}" not found`);
      return view;
    },
  };
}

export function runnableBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/```ts\n([\s\S]*?)\n```/g)].map((m) => m[1] ?? "");
}
