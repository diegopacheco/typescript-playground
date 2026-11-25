export type CompletionKind = "keyword" | "type" | "class" | "func" | "namespace" | "const" | "method" | "snippet";

export type CompletionItem = {
  readonly label: string;
  readonly kind: CompletionKind;
  readonly detail: string;
  readonly insert?: string;
};

export type Completer = {
  query(prefix: string, limit: number): CompletionItem[];
  size(): number;
};

const KEYWORDS = ["abstract", "as", "async", "await", "break", "case", "catch", "class", "const", "continue", "declare", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "from", "function", "get", "if", "implements", "import", "in", "infer", "instanceof", "interface", "keyof", "let", "namespace", "new", "null", "of", "private", "protected", "public", "readonly", "return", "satisfies", "set", "static", "super", "switch", "this", "throw", "true", "try", "type", "typeof", "undefined", "using", "var", "void", "while", "yield"] as const;

const TYPES = ["string", "number", "boolean", "bigint", "symbol", "unknown", "never", "object", "any", "Record", "Partial", "Required", "Readonly", "Pick", "Omit", "Exclude", "Extract", "NonNullable", "ReturnType", "Parameters", "Awaited", "InstanceType", "ReadonlyArray", "PromiseLike", "Iterable", "AsyncIterable", "IterableIterator", "AsyncGenerator", "Generator", "Uppercase", "Lowercase", "Capitalize"] as const;

const GLOBALS = ["console", "Math", "JSON", "Promise", "Array", "Object", "Number", "String", "Boolean", "Date", "Map", "Set", "WeakMap", "WeakSet", "WeakRef", "Symbol", "Reflect", "Proxy", "Intl", "BigInt", "Error", "TypeError", "RangeError", "AggregateError", "AbortController", "AbortSignal", "crypto", "performance", "structuredClone", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "queueMicrotask", "fetch", "ArrayBuffer", "Uint8Array", "TextEncoder", "TextDecoder", "URL", "URLSearchParams", "Iterator", "Atomics", "SharedArrayBuffer", "EventTarget", "Event"] as const;

const INSTANCE_OWNERS = { Array: Array.prototype, String: String.prototype, Promise: Promise.prototype, Map: Map.prototype, Set: Set.prototype, Number: Number.prototype, Date: Date.prototype } as const;

const SNIPPETS: readonly CompletionItem[] = [
  { label: "fori", kind: "snippet", detail: "for loop with index", insert: "for (let i = 0; i < $0; i++) {\n}" },
  { label: "forof", kind: "snippet", detail: "for...of loop", insert: "for (const item of $0) {\n}" },
  { label: "forawait", kind: "snippet", detail: "for await...of loop", insert: "for await (const item of $0) {\n}" },
  { label: "afn", kind: "snippet", detail: "async function", insert: "async function $0() {\n}" },
  { label: "arrow", kind: "snippet", detail: "arrow function", insert: "const fn = ($0) => {\n};" },
  { label: "trycatch", kind: "snippet", detail: "try / catch with unknown", insert: "try {\n  $0\n} catch (err: unknown) {\n  console.error(err);\n}" },
  { label: "sleep", kind: "snippet", detail: "promise based delay", insert: "const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));$0" },
  { label: "union", kind: "snippet", detail: "discriminated union", insert: 'type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; size: number };$0' },
  { label: "log", kind: "snippet", detail: "console.log", insert: "console.log($0);" },
];

const HIDDEN = new Set(["prototype", "length", "name", "caller", "arguments", "constructor"]);

function describe(value: unknown): { kind: CompletionKind; detail: string } {
  if (typeof value === "function") {
    const isClass = /^[A-Z]/.test(value.name) && typeof value.prototype === "object" && value.prototype !== null && Object.getOwnPropertyNames(value.prototype).length > 1;
    return isClass ? { kind: "class", detail: `class ${value.name}` } : { kind: "func", detail: `function(${value.length} args)` };
  }
  if (typeof value === "object" && value !== null) return { kind: "namespace", detail: "namespace" };
  return { kind: "const", detail: `${typeof value} ${String(value).slice(0, 24)}` };
}

function membersOf(owner: string, value: object): CompletionItem[] {
  return Object.getOwnPropertyNames(value)
    .filter((n) => !HIDDEN.has(n) && !n.startsWith("_"))
    .map((name) => {
      const d = describe(Reflect.get(value, name));
      return { label: name, kind: d.kind === "func" ? "method" : d.kind, detail: `${owner}.${name} ${d.detail}` };
    });
}

function instanceMembers(): CompletionItem[] {
  const owners = new Map<string, string[]>();
  for (const [owner, proto] of Object.entries(INSTANCE_OWNERS)) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (HIDDEN.has(name) || typeof name !== "string") continue;
      owners.set(name, [...(owners.get(name) ?? []), owner]);
    }
  }
  return [...owners].map(([label, list]) => ({ label, kind: "method", detail: list.join(", ") }));
}

function rank(items: readonly CompletionItem[], word: string, limit: number): CompletionItem[] {
  const lower = word.toLowerCase();
  return items
    .filter((it) => it.label.toLowerCase().startsWith(lower))
    .toSorted((a, b) => Number(!a.label.startsWith(word)) - Number(!b.label.startsWith(word)) || a.label.length - b.label.length || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function buildCompleter(scope: object = globalThis): Completer {
  const present = GLOBALS.filter((g) => Reflect.has(scope, g));
  const members = new Map<string, CompletionItem[]>();
  for (const name of present) {
    const value: unknown = Reflect.get(scope, name);
    if ((typeof value === "object" || typeof value === "function") && value !== null) members.set(name, membersOf(name, value));
  }
  const top: CompletionItem[] = [
    ...KEYWORDS.map((label): CompletionItem => ({ label, kind: "keyword", detail: "keyword" })),
    ...TYPES.map((label): CompletionItem => ({ label, kind: "type", detail: "type" })),
    ...present.map((label): CompletionItem => ({ label, ...describe(Reflect.get(scope, label)) })),
    ...SNIPPETS,
  ];
  const instance = instanceMembers();
  const total = top.length + instance.length + [...members.values()].reduce((n, m) => n + m.length, 0);
  return {
    query(prefix, limit) {
      const dot = prefix.lastIndexOf(".");
      if (dot < 0) return prefix === "" ? [] : rank(top, prefix, limit);
      const qualifier = prefix.slice(0, dot).split(".").pop() ?? "";
      return rank(members.get(qualifier) ?? instance, prefix.slice(dot + 1), limit);
    },
    size: () => total,
  };
}
