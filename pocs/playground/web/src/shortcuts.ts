import type { IconName } from "./icons.tsx";

export const TABS = [
  { id: "playground", title: "Playground", icon: "play", key: "1", path: "/" },
  { id: "docs", title: "Docs", icon: "book", key: "2", path: "/docs" },
  { id: "samples", title: "Samples", icon: "code", key: "3", path: "/samples" },
] as const satisfies readonly { id: string; title: string; icon: IconName; key: string; path: string }[];

export type Tab = (typeof TABS)[number];
export type TabId = Tab["id"];

export const ACTIONS = ["palette", "help", "run", "format", "clear", "fullscreen", "zoomIn", "zoomOut", "zoomReset", "screenshot"] as const;
export type ActionId = (typeof ACTIONS)[number];
export type Command = ActionId | `tab-${TabId}`;

type GroupId = "nav" | "editor" | "window" | "panels";

export type Group = { readonly id: GroupId; readonly title: string; readonly icon: IconName; readonly color: string };

export const GROUPS: readonly Group[] = [
  { id: "nav", title: "Navigation", icon: "search", color: "#2563eb" },
  { id: "editor", title: "Editor", icon: "editor", color: "#059669" },
  { id: "window", title: "Window", icon: "window", color: "#7c3aed" },
  { id: "panels", title: "Panels", icon: "layers", color: "#ea580c" },
];

export type Shortcut = { readonly id: string; readonly group: GroupId; readonly keys: readonly string[]; readonly desc: string; readonly icon: IconName };

export const SHORTCUTS: readonly Shortcut[] = [
  { id: "palette", group: "nav", keys: ["⌘", "K"], desc: "Search anything", icon: "search" },
  { id: "help", group: "nav", keys: ["⌘", "/"], desc: "Show all shortcuts", icon: "keyboard" },
  ...TABS.map((t): Shortcut => ({ id: `tab-${t.id}`, group: "nav", keys: ["⌘", t.key], desc: `Go to ${t.title}`, icon: t.icon })),
  { id: "run", group: "editor", keys: ["⌘", "Enter"], desc: "Type check and run", icon: "play" },
  { id: "format", group: "editor", keys: ["⇧", "⌘", "F"], desc: "Format code", icon: "format" },
  { id: "complete", group: "editor", keys: ["⌃", "Space"], desc: "Open auto-complete", icon: "code" },
  { id: "accept", group: "editor", keys: ["Tab"], desc: "Accept completion", icon: "code" },
  { id: "clear", group: "editor", keys: ["⌘", "L"], desc: "Clear output", icon: "trash" },
  { id: "copy", group: "editor", keys: ["⌘", "C"], desc: "Copy", icon: "copy" },
  { id: "cut", group: "editor", keys: ["⌘", "X"], desc: "Cut", icon: "cut" },
  { id: "paste", group: "editor", keys: ["⌘", "V"], desc: "Paste", icon: "paste" },
  { id: "fullscreen", group: "window", keys: ["⇧", "⌘", "Enter"], desc: "Toggle full screen", icon: "fullscreen" },
  { id: "zoomIn", group: "window", keys: ["⌘", "+"], desc: "Zoom in", icon: "zoomIn" },
  { id: "zoomOut", group: "window", keys: ["⌘", "-"], desc: "Zoom out", icon: "zoomOut" },
  { id: "zoomReset", group: "window", keys: ["⌘", "0"], desc: "Reset zoom", icon: "zoomReset" },
  { id: "screenshot", group: "window", keys: ["⌘", "P"], desc: "Capture screenshot", icon: "camera" },
  { id: "expand", group: "panels", keys: ["Click"], desc: "Expand or collapse a panel", icon: "expand" },
  { id: "collapse", group: "panels", keys: ["Esc"], desc: "Collapse expanded panel", icon: "collapse" },
  { id: "hide", group: "panels", keys: ["Click"], desc: "Hide panel to the side", icon: "hide" },
];

export function shortcutById(id: string): Shortcut | undefined {
  return SHORTCUTS.find((s) => s.id === id);
}

export function keysLabel(s: Shortcut): string {
  return s.keys.join(" ");
}

export type ShortcutGroup = { readonly group: Group; readonly items: readonly Shortcut[] };

export function filterShortcuts(query: string): ShortcutGroup[] {
  const q = query.trim().toLowerCase();
  return GROUPS.map((group) => {
    const all = SHORTCUTS.filter((s) => s.group === group.id);
    if (q === "" || group.title.toLowerCase().includes(q)) return { group, items: all };
    return { group, items: all.filter((s) => s.desc.toLowerCase().includes(q) || keysLabel(s).toLowerCase().includes(q)) };
  }).filter((g) => g.items.length > 0);
}

export type KeyPress = { readonly key: string; readonly metaKey: boolean; readonly ctrlKey: boolean; readonly shiftKey: boolean };

const PLAIN: Readonly<Record<string, ActionId>> = { k: "palette", "/": "help", l: "clear", p: "screenshot", "=": "zoomIn", "+": "zoomIn", "-": "zoomOut", "0": "zoomReset", enter: "run" };
const SHIFTED: Readonly<Record<string, ActionId>> = { f: "format", enter: "fullscreen", "+": "zoomIn", "=": "zoomIn" };

export function commandForKey(e: KeyPress): Command | null {
  if (!e.metaKey && !e.ctrlKey) return null;
  const k = e.key.toLowerCase();
  const tab = TABS.find((t) => t.key === k);
  if (tab && !e.shiftKey) return `tab-${tab.id}`;
  return (e.shiftKey ? SHIFTED[k] : PLAIN[k]) ?? null;
}

export function pressFor(s: Shortcut): KeyPress {
  const last = s.keys[s.keys.length - 1] ?? "";
  return { key: last === "Enter" ? "Enter" : last.toLowerCase(), metaKey: s.keys.includes("⌘"), ctrlKey: s.keys.includes("⌃"), shiftKey: s.keys.includes("⇧") };
}
