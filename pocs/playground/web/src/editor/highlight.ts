const KEYWORDS = new Set(["abstract", "as", "async", "await", "break", "case", "catch", "class", "const", "continue", "declare", "default", "delete", "do", "else", "enum", "export", "extends", "finally", "for", "from", "function", "get", "if", "implements", "import", "in", "infer", "instanceof", "interface", "is", "keyof", "let", "namespace", "new", "of", "private", "protected", "public", "readonly", "return", "satisfies", "set", "static", "super", "switch", "this", "throw", "try", "type", "typeof", "using", "var", "void", "while", "yield"]);
const TYPES = new Set(["string", "number", "boolean", "bigint", "symbol", "unknown", "never", "object", "any"]);
const CONSTS = new Set(["true", "false", "null", "undefined", "NaN", "Infinity"]);
const GLOBALS = new Set(["console", "Math", "JSON", "Promise", "Array", "Object", "Number", "String", "Boolean", "Date", "Map", "Set", "WeakMap", "Symbol", "Reflect", "Proxy", "Intl", "Error", "AbortController", "AbortSignal", "crypto", "performance", "structuredClone", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "queueMicrotask", "fetch"]);

export type TokenKind = "com" | "str" | "num" | "arrow" | "word" | "op" | "ws" | "pun" | "kw" | "ty" | "con" | "bi" | "fn" | "cls" | "id" | "prop";
export type Token = { readonly kind: TokenKind; readonly text: string };

const RULES: readonly (readonly [TokenKind, RegExp])[] = [
  ["com", /^\/\/[^\n]*/],
  ["com", /^\/\*[\s\S]*?(\*\/|$)/],
  ["str", /^"(\\.|[^"\\\n])*"?/],
  ["str", /^'(\\.|[^'\\\n])*'?/],
  ["str", /^`(\\[\s\S]|[^`\\])*`?/],
  ["num", /^(0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(\.\d*)?([eE][+-]?\d+)?|\.\d+)n?/],
  ["arrow", /^=>/],
  ["word", /^[A-Za-z_$][\w$]*/],
  ["op", /^(===|!==|==|!=|<=|>=|&&|\|\||\?\?|\?\.|\+\+|--|\.\.\.|[-+*/%&|^<>=!?:])/],
  ["ws", /^\s+/],
  ["pun", /^./],
];

export function escapeHTML(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function classify(word: string, after: string, prev: string): TokenKind {
  if (prev === ".") return after.startsWith("(") ? "fn" : "prop";
  if (KEYWORDS.has(word)) return "kw";
  if (TYPES.has(word)) return "ty";
  if (CONSTS.has(word)) return "con";
  if (GLOBALS.has(word)) return "bi";
  if (after.startsWith("(")) return "fn";
  if (/^[A-Z]/.test(word)) return "cls";
  return "id";
}

export function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let rest = src;
  let prev = "";
  while (rest.length > 0) {
    for (const [kind, re] of RULES) {
      const m = re.exec(rest);
      if (!m || m[0] === "") continue;
      const text = m[0];
      rest = rest.slice(text.length);
      tokens.push({ kind: kind === "word" ? classify(text, rest, prev) : kind, text });
      if (kind !== "ws") prev = text;
      break;
    }
  }
  return tokens;
}

const PLAIN: ReadonlySet<TokenKind> = new Set(["ws", "pun", "id"]);

export function highlight(src: string): string {
  return tokenize(src)
    .map((t) => (PLAIN.has(t.kind) ? escapeHTML(t.text) : `<span class="t-${t.kind}">${escapeHTML(t.text)}</span>`))
    .join("");
}
