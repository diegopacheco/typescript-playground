import { createCliRenderer, BoxRenderable, TextRenderable, SelectRenderable, TabSelectRenderable } from "@opentui/core"

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
})

const root = renderer.root

const main = new BoxRenderable(renderer, {
  flexDirection: "column",
  gap: 1,
  padding: 1,
  width: "100%",
})
root.add(main)

const header = new BoxRenderable(renderer, {
  borderStyle: "double",
  border: true,
  padding: 1,
  justifyContent: "center",
  width: "100%",
})
const headerText = new TextRenderable(renderer, { content: "  OpenTUI Dashboard  " })
header.add(headerText)
main.add(header)

const tabs = new TabSelectRenderable(renderer, {
  options: [
    { name: " Charts ", value: "charts" },
    { name: " Select ", value: "select" },
    { name: " Stats  ", value: "stats" },
    { name: " About  ", value: "about" },
  ],
})
main.add(tabs)

const chartBox = new BoxRenderable(renderer, {
  borderStyle: "rounded",
  border: true,
  padding: 1,
  flexDirection: "column",
  width: "100%",
  title: " Language Popularity ",
})

const barData = [
  { label: "TypeScript", value: 92, color: "#3178C6" },
  { label: "Rust      ", value: 78, color: "#FF6B35" },
  { label: "Go        ", value: 65, color: "#00ADD8" },
  { label: "Python    ", value: 85, color: "#FFD43B" },
  { label: "Zig       ", value: 45, color: "#F7A41D" },
  { label: "Java      ", value: 70, color: "#ED8B00" },
]

for (const d of barData) {
  const row = new BoxRenderable(renderer, { flexDirection: "row", gap: 1, width: "100%" })
  const barWidth = Math.floor(d.value / 2)
  row.add(new TextRenderable(renderer, { content: d.label }))
  row.add(new TextRenderable(renderer, { content: "\u2588".repeat(barWidth) + " " + d.value + "%" }))
  chartBox.add(row)
}
main.add(chartBox)

const selectBox = new BoxRenderable(renderer, {
  borderStyle: "rounded",
  border: true,
  padding: 1,
  flexDirection: "column",
  width: "100%",
  title: " Actions ",
})
const select = new SelectRenderable(renderer, {
  options: [
    { name: "Build Project", description: "Compile and bundle the application", value: "build" },
    { name: "Run Tests", description: "Execute the test suite", value: "test" },
    { name: "Deploy", description: "Deploy to production", value: "deploy" },
    { name: "Lint Code", description: "Check code quality", value: "lint" },
    { name: "Format Code", description: "Auto-format source files", value: "format" },
  ],
  showDescription: true,
  wrapSelection: true,
})
selectBox.add(select)
main.add(selectBox)

const statsBox = new BoxRenderable(renderer, {
  borderStyle: "rounded",
  border: true,
  padding: 1,
  flexDirection: "column",
  width: "100%",
  title: " System Stats ",
})

const statsData = [
  { label: "CPU ", pct: 72, color: "#FF6B6B" },
  { label: "MEM ", pct: 48, color: "#61DAFB" },
  { label: "DSK ", pct: 84, color: "#F7DF1E" },
  { label: "NET ", pct: 31, color: "#00FFAA" },
]

for (const s of statsData) {
  const row = new BoxRenderable(renderer, { flexDirection: "row", gap: 1 })
  const filled = Math.floor(s.pct / 4)
  const empty = 25 - filled
  row.add(new TextRenderable(renderer, { content: s.label }))
  row.add(new TextRenderable(renderer, { content: "\u2588".repeat(filled) + "\u2591".repeat(empty) + " " + s.pct + "%" }))
  statsBox.add(row)
}
main.add(statsBox)

const aboutBox = new BoxRenderable(renderer, {
  borderStyle: "rounded",
  border: true,
  padding: 1,
  flexDirection: "column",
  gap: 1,
  width: "100%",
  title: " About ",
})
aboutBox.add(new TextRenderable(renderer, { content: "OpenTUI - Native Terminal UI" }))
aboutBox.add(new TextRenderable(renderer, { content: "Core written in Zig with TypeScript bindings" }))
aboutBox.add(new TextRenderable(renderer, { content: "Yoga-powered CSS Flexbox layout engine" }))
aboutBox.add(new TextRenderable(renderer, { content: "Built-in tree-sitter syntax highlighting" }))

const techRow = new BoxRenderable(renderer, { flexDirection: "row", gap: 2 })
techRow.add(new TextRenderable(renderer, { content: "Runtime: Bun" }))
techRow.add(new TextRenderable(renderer, { content: "Lang: TypeScript" }))
techRow.add(new TextRenderable(renderer, { content: "UI: OpenTUI" }))
aboutBox.add(techRow)
main.add(aboutBox)

const footer = new BoxRenderable(renderer, { padding: 1, justifyContent: "center", width: "100%" })
footer.add(new TextRenderable(renderer, { content: "Tab/Arrow keys to navigate | Enter to select | Ctrl+C to exit" }))
main.add(footer)
