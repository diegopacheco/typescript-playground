import { AppError } from "./errors.ts";

const INDENT = "  ";
const OPENERS = "{([";
const CLOSERS = "})]";
const REGEX_PREFIX = /[(,=:[!&|?{};+\-*%<>~^]$|^$|\breturn$|\btypeof$/;

type Frame = { kind: "code" } | { kind: "template" } | { kind: "interp"; open: number };
type Mode = "code" | "single" | "double" | "regex" | "line-comment" | "block-comment";

type ScanState = { stack: Frame[]; mode: Mode; depth: number };

function top(state: ScanState): Frame {
  const frame = state.stack[state.stack.length - 1];
  if (!frame) throw new Error("scanner stack is empty");
  return frame;
}

function scanLine(line: string, state: ScanState, lineNo: number): void {
  for (let i = 0; i < line.length; i++) {
    const ch = line[i] ?? "";
    const next = line[i + 1] ?? "";
    const frame = top(state);
    if (state.mode === "block-comment") {
      if (ch === "*" && next === "/") {
        state.mode = "code";
        i++;
      }
      continue;
    }
    if (state.mode === "single" || state.mode === "double" || state.mode === "regex") {
      const end = state.mode === "single" ? "'" : state.mode === "double" ? '"' : "/";
      if (ch === "\\") i++;
      else if (ch === end) state.mode = "code";
      continue;
    }
    if (frame.kind === "template") {
      if (ch === "\\") i++;
      else if (ch === "`") state.stack.pop();
      else if (ch === "$" && next === "{") {
        state.stack.push({ kind: "interp", open: 0 });
        i++;
      }
      continue;
    }
    if (ch === "/" && next === "/") break;
    if (ch === "/" && next === "*") {
      state.mode = "block-comment";
      i++;
      continue;
    }
    if (ch === "'") state.mode = "single";
    else if (ch === '"') state.mode = "double";
    else if (ch === "`") state.stack.push({ kind: "template" });
    else if (ch === "/" && REGEX_PREFIX.test(line.slice(0, i).trimEnd())) state.mode = "regex";
    else if (frame.kind === "interp" && ch === "}" && frame.open === 0) state.stack.pop();
    else if (OPENERS.includes(ch)) {
      state.depth++;
      if (frame.kind === "interp") frame.open++;
    } else if (CLOSERS.includes(ch)) {
      state.depth--;
      if (frame.kind === "interp") frame.open--;
      if (state.depth < 0) throw new AppError("bad_request", `unbalanced "${ch}" at line ${lineNo}`);
    }
  }
  if (state.mode === "single" || state.mode === "double" || state.mode === "regex") state.mode = "code";
}

function leadingClosers(trimmed: string): number {
  let n = 0;
  while (n < trimmed.length && CLOSERS.includes(trimmed[n] ?? "")) n++;
  return n;
}

export function formatCode(code: string): string {
  const state: ScanState = { stack: [{ kind: "code" }], mode: "code", depth: 0 };
  const caseDepths: number[] = [];
  const out: string[] = [];
  const lines = code.replaceAll("\r\n", "\n").split("\n");
  lines.forEach((line, index) => {
    const verbatim = top(state).kind === "template" || state.mode === "block-comment";
    if (verbatim) {
      out.push(line);
      scanLine(line, state, index + 1);
      return;
    }
    const trimmed = line.trim();
    if (trimmed === "") {
      if (out.length > 0 && out[out.length - 1] !== "") out.push("");
      return;
    }
    const level = Math.max(0, state.depth - leadingClosers(trimmed));
    while (caseDepths.length > 0 && (caseDepths[caseDepths.length - 1] ?? 0) > level) caseDepths.pop();
    const isCase = /^(case\b.*|default\s*):/.test(trimmed);
    const caseExtra = caseDepths.filter((d) => d < level || (d === level && !isCase)).length;
    const chain = trimmed.startsWith(".") && !trimmed.startsWith("...") ? 1 : 0;
    out.push(INDENT.repeat(level + caseExtra + chain) + trimmed);
    if (isCase && caseDepths[caseDepths.length - 1] !== level) caseDepths.push(level);
    scanLine(line, state, index + 1);
  });
  if (state.depth !== 0) throw new AppError("bad_request", `unbalanced brackets: ${state.depth} left open`);
  if (top(state).kind !== "code") throw new AppError("bad_request", "unterminated template literal");
  while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return out.join("\n") + "\n";
}
