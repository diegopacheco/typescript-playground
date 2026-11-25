export const INDENT = "  ";
const CARET = "$0";

export type Completion = { readonly label: string; readonly kind: string; readonly detail: string; readonly insert?: string };

export function wordBeforeCaret(text: string, caret: number): { query: string; replaceFrom: number } {
  const m = /([A-Za-z_$][\w$]*\.)?([A-Za-z_$][\w$]*)?$/.exec(text.slice(0, caret));
  const qualifier = m?.[1] ?? "";
  const word = m?.[2] ?? "";
  return { query: qualifier + word, replaceFrom: caret - word.length };
}

export function insertionFor(item: Completion, indent = ""): { text: string; caretBack: number } {
  if (item.insert !== undefined) {
    const text = item.insert.replaceAll("\n", "\n" + indent);
    const at = text.indexOf(CARET);
    if (at < 0) return { text, caretBack: 0 };
    const clean = text.replace(CARET, "");
    return { text: clean, caretBack: clean.length - at };
  }
  if (item.kind === "func" || item.kind === "method") return { text: item.label + "()", caretBack: 1 };
  return { text: item.label, caretBack: 0 };
}

export function caretPosition(text: string, caret: number, tabSize = 2): { line: number; col: number } {
  const lines = text.slice(0, caret).split("\n");
  const last = lines[lines.length - 1] ?? "";
  let col = 0;
  for (const ch of last) col += ch === "\t" ? tabSize - (col % tabSize) : 1;
  return { line: lines.length - 1, col };
}

export function lineIndent(text: string, caret: number): string {
  const start = text.lastIndexOf("\n", caret - 1) + 1;
  return /^[\t ]*/.exec(text.slice(start, caret))?.[0] ?? "";
}

export function indentFor(text: string, caret: number): string {
  const start = text.lastIndexOf("\n", caret - 1) + 1;
  const line = text.slice(start, caret);
  const base = lineIndent(text, caret);
  return /[{([]\s*$|=>\s*$/.test(line) ? base + INDENT : base;
}

export function errorLines(stderr: string): Set<number> {
  return new Set([...stderr.matchAll(/main\.ts(?:\((\d+),\d+\)|:(\d+):\d+)/g)].map((m) => Number(m[1] ?? m[2])));
}
