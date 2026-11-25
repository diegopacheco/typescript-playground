import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { desktop } from "../desktop.ts";

export type Modal = "none" | "palette" | "help";

type Ui = {
  readonly modal: Modal;
  readonly setModal: (m: Modal) => void;
  readonly toast: string | null;
  readonly notify: (msg: string) => void;
  readonly zoom: number;
  readonly setZoom: (z: number) => void;
};

const UiContext = createContext<Ui | null>(null);

function applyZoom(z: number): void {
  if (desktop) desktop.setZoom(z);
  else document.documentElement.style.setProperty("zoom", String(z));
}

export function clampZoom(z: number): number {
  return Math.min(2, Math.max(0.6, Math.round(z * 10) / 10));
}

export function UiProvider({ children }: { readonly children: ReactNode }) {
  const [modal, setModal] = useState<Modal>("none");
  const [toast, setToast] = useState<string | null>(null);
  const [zoom, setZoomState] = useState(() => {
    const z = clampZoom(Number(localStorage.getItem("zoom") ?? "1") || 1);
    applyZoom(z);
    return z;
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);
  const setZoom = useCallback(
    (z: number) => {
      const next = clampZoom(z);
      localStorage.setItem("zoom", String(next));
      applyZoom(next);
      setZoomState(next);
      notify(`Zoom ${Math.round(next * 100)}%`);
    },
    [notify],
  );
  const value = useMemo(() => ({ modal, setModal, toast, notify, zoom, setZoom }), [modal, toast, notify, zoom, setZoom]);
  return <UiContext value={value}>{children}</UiContext>;
}

export function useUi(): Ui {
  const ui = use(UiContext);
  if (!ui) throw new Error("useUi needs UiProvider");
  return ui;
}
