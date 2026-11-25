import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { hide, parseHidden, restore, type HiddenPanel } from "./layout.ts";

const STORE = "hiddenPanels";

type Panels = {
  readonly hidden: readonly HiddenPanel[];
  readonly expanded: string | null;
  readonly toggleExpand: (id: string) => void;
  readonly hidePanel: (entry: HiddenPanel) => void;
  readonly restorePanel: (id: string) => void;
};

const PanelsContext = createContext<Panels | null>(null);

export function PanelsProvider({ children }: { readonly children: ReactNode }) {
  const [hidden, setHidden] = useState(() => parseHidden(localStorage.getItem(STORE)));
  const [expanded, setExpanded] = useState<string | null>(null);

  const save = useCallback((next: HiddenPanel[]) => {
    localStorage.setItem(STORE, JSON.stringify(next));
    setHidden(next);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-expanded", expanded !== null);
  }, [expanded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded !== null && !document.querySelector(".modal")) setExpanded(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded]);

  const value = useMemo(
    (): Panels => ({
      hidden,
      expanded,
      toggleExpand: (id) => setExpanded((cur) => (cur === id ? null : id)),
      hidePanel: (entry) => {
        setExpanded((cur) => (cur === entry.id ? null : cur));
        save(hide(hidden, entry));
      },
      restorePanel: (id) => save(restore(hidden, id)),
    }),
    [hidden, expanded, save],
  );
  return <PanelsContext value={value}>{children}</PanelsContext>;
}

export function usePanels(): Panels {
  const p = use(PanelsContext);
  if (!p) throw new Error("usePanels needs PanelsProvider");
  return p;
}
