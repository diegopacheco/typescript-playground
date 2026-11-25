import { Icon } from "../icons.tsx";
import type { Side } from "./layout.ts";
import { usePanels } from "./PanelsProvider.tsx";

export function DockTabs({ view }: { readonly view: string }) {
  const { hidden, restorePanel } = usePanels();
  const sides: readonly Side[] = ["left", "right"];
  return (
    <>
      {sides.map((side) => (
        <div key={side} className={`dock dock-${side}`}>
          {hidden
            .filter((h) => h.side === side && h.view === view)
            .map((h) => (
              <button key={h.id} className="dock-tab" data-tip={`Restore ${h.title}`} aria-label={`Restore ${h.title}`} onClick={() => restorePanel(h.id)}>
                <Icon name={side === "left" ? "arrowRight" : "arrowLeft"} size={14} />
                <span>{h.title}</span>
              </button>
            ))}
        </div>
      ))}
    </>
  );
}
