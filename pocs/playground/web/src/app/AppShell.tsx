import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Help } from "../components/Help.tsx";
import { Palette, type PaletteEntry } from "../components/Palette.tsx";
import { Tooltip } from "../components/Tooltip.tsx";
import { desktop } from "../desktop.ts";
import { useDocs, useSamples } from "../features/content/hooks.ts";
import { Icon } from "../icons.tsx";
import { DockTabs } from "../panels/DockTabs.tsx";
import { ACTIONS, commandForKey, keysLabel, shortcutById, TABS, type ActionId, type Command, type TabId } from "../shortcuts.ts";
import { usePlayground } from "./playground.tsx";
import { useUi } from "./ui.tsx";

export function tabForPath(pathname: string): TabId {
  return TABS.find((t) => t.path !== "/" && pathname.startsWith(t.path))?.id ?? "playground";
}

export function AppShell() {
  const ui = useUi();
  const playground = usePlayground();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const docs = useDocs().data ?? [];
  const samples = useSamples().data ?? [];
  const tab = tabForPath(pathname);

  const actions: Readonly<Record<ActionId, () => void>> = {
    palette: () => ui.setModal("palette"),
    help: () => ui.setModal("help"),
    run: playground.run,
    format: playground.format,
    clear: playground.clear,
    fullscreen: () => {
      if (desktop) void desktop.toggleFullscreen();
      else if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen();
    },
    zoomIn: () => ui.setZoom(ui.zoom + 0.1),
    zoomOut: () => ui.setZoom(ui.zoom - 0.1),
    zoomReset: () => ui.setZoom(1),
    screenshot: () => {
      if (!desktop) return ui.notify("Screenshots are available in the desktop app");
      void desktop.screenshot().then((file) => ui.notify(`Saved ${file}`));
    },
  };

  const exec = (cmd: Command) => {
    const target = TABS.find((t) => `tab-${t.id}` === cmd);
    if (target) {
      ui.setModal("none");
      void navigate({ to: target.path });
      return;
    }
    if (cmd !== "palette" && cmd !== "help") ui.setModal("none");
    const action = ACTIONS.find((a) => a === cmd);
    if (action) actions[action]();
  };
  const execRef = useRef(exec);
  execRef.current = exec;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmd = commandForKey(e);
      if (!cmd) return;
      e.preventDefault();
      execRef.current(cmd);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-desktop", desktop !== null);
  }, []);

  const entries: PaletteEntry[] = [
    ...TABS.map((t): PaletteEntry => ({ icon: t.icon, label: t.title, hint: `Tab · ⌘ ${t.key}`, go: () => void navigate({ to: t.path }) })),
    ...docs.map((d): PaletteEntry => ({ icon: "book", label: d.title, hint: "Doc", go: () => void navigate({ to: "/docs/$docId", params: { docId: d.id } }) })),
    ...samples.map((s): PaletteEntry => ({ icon: "code", label: s.title, hint: "Sample", go: () => void navigate({ to: "/samples/$sampleId", params: { sampleId: s.id } }) })),
    ...samples.map((s): PaletteEntry => ({ icon: "play", label: `Run sample: ${s.title}`, hint: "Action", go: () => playground.load(s.code, true) })),
    ...ACTIONS.filter((a) => a !== "palette").flatMap((a): PaletteEntry[] => {
      const s = shortcutById(a);
      return s ? [{ icon: s.icon, label: s.desc, hint: keysLabel(s), go: () => exec(a) }] : [];
    }),
  ];

  return (
    <>
      <header
        className="titlebar"
        onDoubleClick={(e) => {
          if (desktop && e.target instanceof Element && !e.target.closest("button,a")) void desktop.toggleMaximize();
        }}
      >
        <div className="brand">
          <img src="/logo.svg" alt="" width={26} height={26} />
          <span>TypeScript Playground</span>
        </div>
        <nav className="tabs" role="tablist">
          {TABS.map((t) => (
            <Link key={t.id} to={t.path} className="tab" role="tab" aria-selected={tab === t.id} data-sc={`tab-${t.id}`}>
              <Icon name={t.icon} />
              <span>{t.title}</span>
            </Link>
          ))}
        </nav>
        <div className="actions">
          <button className="icon-btn" data-sc="palette" aria-label="Search" onClick={() => exec("palette")}>
            <Icon name="search" />
          </button>
          <button className="icon-btn" data-sc="help" aria-label="Shortcuts" onClick={() => exec("help")}>
            <Icon name="keyboard" />
          </button>
        </div>
      </header>
      <DockTabs view={tab} />
      <main>
        <Outlet />
      </main>
      {ui.modal === "palette" && <Palette entries={entries} onClose={() => ui.setModal("none")} />}
      {ui.modal === "help" && <Help onClose={() => ui.setModal("none")} />}
      <Tooltip />
      {ui.toast && <div className="toast">{ui.toast}</div>}
    </>
  );
}
