import { useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "../icons.tsx";

export type PaletteEntry = { readonly icon: IconName; readonly label: string; readonly hint: string; readonly go: () => void };

export function filterEntries(entries: readonly PaletteEntry[], query: string): PaletteEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter((e) => q === "" || e.label.toLowerCase().includes(q) || e.hint.toLowerCase().includes(q));
}

type PaletteProps = { readonly entries: readonly PaletteEntry[]; readonly onClose: () => void };

export function Palette({ entries, onClose }: PaletteProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const items = filterEntries(entries, query);
  const active = Math.min(index, Math.max(0, items.length - 1));
  const choose = (entry: PaletteEntry | undefined) => {
    if (!entry) return;
    onClose();
    entry.go();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.max(1, items.length);
      setIndex((active + (e.key === "ArrowDown" ? 1 : -1) + n) % n);
    } else if (e.key === "Enter") choose(items[active]);
    else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (query !== "") setQuery("");
      else onClose();
    }
  };
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card palette-card" role="dialog" aria-label="Search">
        <div className="search-row">
          <Icon name="search" />
          <input
            autoFocus
            type="text"
            placeholder="Search tabs, docs, samples, actions..."
            aria-label="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <ul className="results">
          {items.length === 0 && <li className="empty">Nothing matches "{query}"</li>}
          {items.map((e, i) => (
            <li key={e.label + e.hint} className={i === active ? "active" : ""} ref={(el) => (i === active ? el?.scrollIntoView({ block: "nearest" }) : undefined)} onClick={() => choose(e)}>
              <Icon name={e.icon} />
              <span>{e.label}</span>
              <kbd>{e.hint}</kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
