import { useState, type KeyboardEvent } from "react";
import { Icon } from "../icons.tsx";
import { filterShortcuts, SHORTCUTS } from "../shortcuts.ts";

export function Help({ onClose }: { readonly onClose: () => void }) {
  const [query, setQuery] = useState("");
  const groups = filterShortcuts(query);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    e.stopPropagation();
    if (query !== "") setQuery("");
    else onClose();
  };
  return (
    <div className="modal help-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card help-card" role="dialog" aria-label="Keyboard shortcuts">
        <div className="search-row">
          <Icon name="keyboard" />
          <input autoFocus type="text" placeholder="Filter shortcuts..." aria-label="Filter shortcuts" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} />
          <span className="count">
            {total} of {SHORTCUTS.length} shortcuts
          </span>
        </div>
        <div className="groups">
          {groups.length === 0 && <p className="empty">No shortcut matches "{query}"</p>}
          {groups.map(({ group, items }) => (
            <section key={group.id} className="sc-group" style={Object.fromEntries([["--c", group.color]])}>
              <h3>
                <Icon name={group.icon} />
                {group.title}
              </h3>
              {items.map((s) => (
                <div key={s.id} className="sc-row">
                  <Icon name={s.icon} size={16} />
                  <span>{s.desc}</span>
                  <span className="keys">
                    {s.keys.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
