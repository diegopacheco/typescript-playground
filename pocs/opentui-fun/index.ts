import { createCliRenderer, Box, Text, Select, TabSelect } from "@opentui/core"

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  useMouse: true,
})

const header = Box(
  { borderStyle: "double", padding: 1, justifyContent: "center", width: "100%" },
  Text({ content: "  OpenTUI Dashboard  ", fg: "#00FFAA", bold: true }),
)

const tabs = TabSelect({
  options: [
    { name: " Charts ", value: "charts" },
    { name: " Select ", value: "select" },
    { name: " Controls ", value: "controls" },
    { name: " About ", value: "about" },
  ],
  selectedBackgroundColor: "#00FFAA",
  selectedTextColor: "#000000",
})

const barData = [
  { label: "TypeScript", value: 92, color: "#3178C6" },
  { label: "Rust      ", value: 78, color: "#FF6B35" },
  { label: "Go        ", value: 65, color: "#00ADD8" },
  { label: "Python    ", value: 85, color: "#FFD43B" },
  { label: "Zig       ", value: 45, color: "#F7A41D" },
  { label: "Java      ", value: 70, color: "#ED8B00" },
]

const chartBars = barData.map((d) => {
  const barWidth = Math.floor(d.value / 2)
  const bar = "\u2588".repeat(barWidth)
  return Box(
    { flexDirection: "row", gap: 1, width: "100%" },
    Text({ content: d.label, fg: "#AAAAAA" }),
    Text({ content: bar, fg: d.color }),
    Text({ content: ` ${d.value}%`, fg: "#FFFFFF" }),
  )
})

const chartSection = Box(
  { borderStyle: "rounded", padding: 1, flexDirection: "column", gap: 0, width: "100%", title: " Language Popularity " },
  ...chartBars,
)

const select = Select({
  options: [
    { name: "Build Project", description: "Compile and bundle the application", value: "build" },
    { name: "Run Tests", description: "Execute the test suite", value: "test" },
    { name: "Deploy", description: "Deploy to production", value: "deploy" },
    { name: "Lint Code", description: "Check code quality", value: "lint" },
    { name: "Format Code", description: "Auto-format source files", value: "format" },
  ],
  selectedBackgroundColor: "#00FFAA",
  selectedTextColor: "#000000",
  showDescription: true,
  wrapSelection: true,
  focusable: true,
})

const selectSection = Box(
  { borderStyle: "rounded", padding: 1, flexDirection: "column", width: "100%", title: " Actions " },
  select,
)

const controlsSection = Box(
  { borderStyle: "rounded", padding: 1, flexDirection: "column", gap: 1, width: "100%", title: " Controls " },
  Box(
    { flexDirection: "row", gap: 1 },
    Text({ content: "VOL ", fg: "#AAAAAA" }),
    Text({ content: "\u2588".repeat(15) + "\u2591".repeat(10), fg: "#00FFAA" }),
    Text({ content: " 60%", fg: "#00FFAA" }),
  ),
  Box(
    { borderStyle: "rounded", padding: 1, flexDirection: "column", gap: 0, width: "100%", title: " System Stats " },
    Box(
      { flexDirection: "row", gap: 1 },
      Text({ content: "CPU ", fg: "#AAAAAA" }),
      Text({ content: "\u2588".repeat(18) + "\u2591".repeat(7), fg: "#FF6B6B" }),
      Text({ content: " 72%", fg: "#FF6B6B" }),
    ),
    Box(
      { flexDirection: "row", gap: 1 },
      Text({ content: "MEM ", fg: "#AAAAAA" }),
      Text({ content: "\u2588".repeat(12) + "\u2591".repeat(13), fg: "#61DAFB" }),
      Text({ content: " 48%", fg: "#61DAFB" }),
    ),
    Box(
      { flexDirection: "row", gap: 1 },
      Text({ content: "DSK ", fg: "#AAAAAA" }),
      Text({ content: "\u2588".repeat(21) + "\u2591".repeat(4), fg: "#F7DF1E" }),
      Text({ content: " 84%", fg: "#F7DF1E" }),
    ),
  ),
)

const aboutSection = Box(
  { borderStyle: "rounded", padding: 1, flexDirection: "column", gap: 1, width: "100%", title: " About " },
  Text({ content: "OpenTUI - Native Terminal UI", fg: "#00FFAA", bold: true }),
  Text({ content: "Core written in Zig with TypeScript bindings", fg: "#AAAAAA" }),
  Text({ content: "Yoga-powered CSS Flexbox layout engine", fg: "#AAAAAA" }),
  Text({ content: "Built-in tree-sitter syntax highlighting", fg: "#AAAAAA" }),
  Text({ content: "Keyboard + Mouse interaction support", fg: "#AAAAAA" }),
  Box(
    { flexDirection: "row", gap: 2, marginTop: 1 },
    Text({ content: "Runtime: Bun", fg: "#61DAFB" }),
    Text({ content: "Lang: TypeScript", fg: "#3178C6" }),
    Text({ content: "UI: OpenTUI", fg: "#F7A41D" }),
  ),
)

const footer = Box(
  { padding: 1, justifyContent: "center", width: "100%" },
  Text({ content: "Tab/Arrow keys to navigate | Enter to select | Ctrl+C to exit", fg: "#555555" }),
)

renderer.root.add(
  Box(
    { flexDirection: "column", gap: 1, padding: 1, width: "100%" },
    header,
    tabs,
    chartSection,
    selectSection,
    controlsSection,
    aboutSection,
    footer,
  ),
)
