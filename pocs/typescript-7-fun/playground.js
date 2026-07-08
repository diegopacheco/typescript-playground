const features = [
  { ic: "⚡", title: "Native Go port", text: "The whole toolset was rewritten in Go, keeping the original structure and logic so results stay compatible with TypeScript 6." },
  { ic: "🚀", title: "8–12x faster builds", text: "Native code speed plus new optimizations typically yield 8x to 12x speedups on full builds, and over 13x on real projects." },
  { ic: "🧵", title: "Shared-memory multithreading", text: "Parsing, checking and emitting run in parallel. Tune it with --checkers and --builders, or force one thread with --singleThreaded." },
  { ic: "🛰️", title: "New language server (LSP)", text: "A rebuilt LSP-based server cut failing language-server commands by over 80% and server crashes by over 60% versus 6.0." },
  { ic: "🤝", title: "Runs side-by-side with 6.0", text: "The package re-exports the 6.0 API. Keep old tooling working with an npm alias: typescript@npm:@typescript/typescript6." },
  { ic: "📦", title: "Same install, next tag", text: "Install with npm install -D typescript, or ride nightly builds from the standard package via typescript@next." },
];

const examples = [
  {
    id: "generics",
    label: "Generics",
    file: "generics.ts",
    code: `interface Box<T> {
  value: T;
  map<U>(fn: (v: T) => U): Box<U>;
}

function box<T>(value: T): Box<T> {
  return {
    value,
    map: (fn) => box(fn(value)),
  };
}

const doubled = box(21).map((n) => n * 2);
const shouted = box("typescript 7").map((s) => s.toUpperCase());

console.log("number box:", doubled.value);
console.log("string box:", shouted.value);`,
  },
  {
    id: "satisfies",
    label: "satisfies",
    file: "satisfies.ts",
    code: `type Route = { path: string; method: "GET" | "POST" };

const routes = {
  home: { path: "/", method: "GET" },
  login: { path: "/login", method: "POST" },
} satisfies Record<string, Route>;

console.log("home method:", routes.home.method);
console.log("login path:", routes.login.path);
console.log("keys:", Object.keys(routes).join(", "));`,
  },
  {
    id: "narrowing",
    label: "Narrowing",
    file: "narrowing.ts",
    code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side * shape.side;
  }
}

console.log("circle:", area({ kind: "circle", radius: 2 }).toFixed(2));
console.log("square:", area({ kind: "square", side: 3 }));`,
  },
  {
    id: "template",
    label: "Template types",
    file: "template.ts",
    code: `type Lang = "ts" | "js";
type FileName<T extends Lang> = \`main.\${T}\`;

const files: FileName<Lang>[] = ["main.ts", "main.js"];

type Greeting = \`Hello, \${string}!\`;
const hi: Greeting = "Hello, TypeScript 7!";

console.log("files:", files.join(" · "));
console.log(hi);`,
  },
  {
    id: "resources",
    label: "using",
    file: "using.ts",
    code: `class Timer implements Disposable {
  private start = Date.now();
  constructor(private name: string) {}
  [Symbol.dispose]() {
    console.log(\`\${this.name} took \${Date.now() - this.start}ms\`);
  }
}

function work() {
  using t = new Timer("work");
  let sum = 0;
  for (let i = 0; i < 1_000_000; i++) sum += i;
  console.log("sum:", sum);
}

work();`,
  },
  {
    id: "const-param",
    label: "const params",
    file: "const-param.ts",
    code: `function asTuple<const T extends readonly unknown[]>(...items: T): T {
  return items;
}

const point = asTuple(10, 20, "origin");
console.log("tuple:", JSON.stringify(point));

const colors = asTuple("red", "green", "blue");
console.log("first color:", colors[0]);
console.log("count:", colors.length);`,
  },
];

const explanations = {
  generics: [
    "<code>Box&lt;T&gt;</code> is a generic interface; <code>T</code> is a placeholder type filled in each time the box is used.",
    "<code>map&lt;U&gt;</code> adds a second type parameter, so mapping can turn a <code>Box&lt;T&gt;</code> into a <code>Box&lt;U&gt;</code> of a different type.",
    "<code>box(21)</code> infers <code>Box&lt;number&gt;</code>, and <code>box(\"typescript 7\")</code> infers <code>Box&lt;string&gt;</code> with no annotations.",
    "The element type flows through <code>.map()</code> automatically, so <code>doubled.value</code> is a number and <code>shouted.value</code> is a string.",
  ],
  satisfies: [
    "<code>satisfies Record&lt;string, Route&gt;</code> checks every entry matches <code>Route</code> without widening the values.",
    "Because the type is only checked, not applied, <code>routes.home.method</code> keeps its literal type <code>\"GET\"</code> instead of becoming <code>string</code>.",
    "You get validation and precise autocomplete at the same time.",
  ],
  narrowing: [
    "<code>Shape</code> is a discriminated union: each member shares the <code>kind</code> field as its tag.",
    "Switching on <code>shape.kind</code> narrows each branch to a single variant.",
    "Inside <code>case \"circle\"</code> only <code>radius</code> exists; inside <code>case \"square\"</code> only <code>side</code> does.",
    "If a new variant is added and a branch is missing, the compiler flags the unhandled case.",
  ],
  template: [
    "Template literal types build string types out of other types.",
    "<code>FileName&lt;T&gt;</code> expands to <code>`main.${T}`</code>, so only <code>\"main.ts\"</code> and <code>\"main.js\"</code> are valid.",
    "<code>Greeting</code> accepts any string shaped like <code>`Hello, ${string}!`</code>, checked at compile time.",
  ],
  resources: [
    "<code>using</code> declares a resource that is released when the block ends.",
    "<code>Timer</code> implements <code>Disposable</code> through its <code>[Symbol.dispose]()</code> method.",
    "When <code>work()</code> returns, <code>[Symbol.dispose]</code> runs automatically and logs how long the loop took.",
    "No manual cleanup or <code>try/finally</code> is needed.",
  ],
  "const-param": [
    "A <code>const</code> type parameter tells the compiler to infer the narrowest literal types.",
    "<code>asTuple(10, 20, \"origin\")</code> is typed as the readonly tuple <code>[10, 20, \"origin\"]</code>, not <code>(number | string)[]</code>.",
    "It preserves exact shapes at the call site without writing <code>as const</code> every time.",
  ],
};

const grid = document.getElementById("feature-grid");
grid.innerHTML = features
  .map((f) => `<div class="card"><div class="ic">${f.ic}</div><h3>${f.title}</h3><p>${f.text}</p></div>`)
  .join("");

const tabs = document.getElementById("tabs");
const codeEl = document.getElementById("code");
const fileEl = document.getElementById("file-name");
const outEl = document.getElementById("output");
const runBtn = document.getElementById("run-btn");
const hlEl = document.getElementById("highlight");
const gutterEl = document.getElementById("gutter");
const explainEl = document.getElementById("explain");
let active = 0;

const TOKEN = /(\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|infer|in|instanceof|interface|is|keyof|let|namespace|new|of|override|package|private|protected|public|readonly|return|satisfies|set|static|super|switch|this|throw|try|typeof|type|unique|using|var|void|while|with|yield)\b)|(\b(?:any|bigint|boolean|never|number|object|string|symbol|unknown)\b)|(\b(?:true|false|null|undefined|NaN|Infinity)\b)|(\b(?:0x[0-9a-fA-F]+|\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?)\b)|[A-Za-z_$][\w$]*(?=\s*\()/g;

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function hlChunk(chunk) {
  return escapeHtml(chunk).replace(TOKEN, (m, kw, typ, lit, num) => {
    const cls = kw ? "kw" : typ ? "typ" : lit ? "lit" : num ? "num" : "fn";
    return `<span class="${cls}">${m}</span>`;
  });
}

function highlight(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  let code = "";
  const flush = () => { if (code) { out += hlChunk(code); code = ""; } };
  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];
    if (c === "/" && c2 === "/") {
      flush();
      let j = src.indexOf("\n", i);
      if (j === -1) j = n;
      out += `<span class="cm">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
    } else if (c === "/" && c2 === "*") {
      flush();
      let j = src.indexOf("*/", i + 2);
      j = j === -1 ? n : j + 2;
      out += `<span class="cm">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
    } else if (c === '"' || c === "'" || c === "`") {
      flush();
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === c) { j++; break; }
        j++;
      }
      out += `<span class="str">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
    } else {
      code += c;
      i++;
    }
  }
  flush();
  return out;
}

function updateGutter() {
  const count = codeEl.value.split("\n").length;
  let s = "";
  for (let i = 1; i <= count; i++) s += i + "\n";
  gutterEl.textContent = s;
}

function updateHighlight() {
  hlEl.innerHTML = highlight(codeEl.value);
  updateGutter();
}

function renderTabs() {
  tabs.innerHTML = examples
    .map((e, i) => `<button class="tab ${i === active ? "active" : ""}" data-i="${i}">${e.label}</button>`)
    .join("");
  tabs.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      active = Number(btn.dataset.i);
      loadExample();
    });
  });
}

function loadExample() {
  renderTabs();
  codeEl.value = examples[active].code;
  fileEl.textContent = examples[active].file;
  outEl.innerHTML = '<span class="hint">Press Run to see the output…</span>';
  const e = examples[active];
  explainEl.innerHTML =
    `<h3>${e.label}</h3><ul>` +
    explanations[e.id].map((x) => `<li>${x}</li>`).join("") +
    "</ul>";
  updateHighlight();
}

function run() {
  outEl.innerHTML = "";
  const lines = [];
  const push = (cls, args) => {
    const text = args
      .map((a) => (typeof a === "object" && a !== null ? JSON.stringify(a) : String(a)))
      .join(" ");
    lines.push(`<span class="${cls}">${escapeHtml(text)}</span>`);
  };
  const sandbox = {
    log: (...a) => push("log", a),
    error: (...a) => push("err", a),
    warn: (...a) => push("log", a),
    info: (...a) => push("log", a),
  };

  try {
    const js = ts.transpileModule(codeEl.value, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.None,
      },
    }).outputText;
    const fn = new Function("console", js);
    fn(sandbox);
    if (lines.length === 0) push("ok", ["(ran with no output)"]);
  } catch (e) {
    push("err", ["Error: " + (e && e.message ? e.message : e)]);
  }
  outEl.innerHTML = lines.join("\n");
}

runBtn.addEventListener("click", run);
document.getElementById("clear-btn").addEventListener("click", () => {
  outEl.innerHTML = '<span class="hint">Press Run to see the output…</span>';
});
codeEl.addEventListener("input", updateHighlight);
codeEl.addEventListener("scroll", () => {
  hlEl.scrollTop = codeEl.scrollTop;
  hlEl.scrollLeft = codeEl.scrollLeft;
  gutterEl.scrollTop = codeEl.scrollTop;
});
codeEl.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const s = codeEl.selectionStart;
    const end = codeEl.selectionEnd;
    codeEl.value = codeEl.value.slice(0, s) + "  " + codeEl.value.slice(end);
    codeEl.selectionStart = codeEl.selectionEnd = s + 2;
    updateHighlight();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run();
});

loadExample();
