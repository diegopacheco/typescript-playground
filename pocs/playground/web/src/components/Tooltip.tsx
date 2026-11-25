import { useEffect, useRef, useState } from "react";
import { shortcutById } from "../shortcuts.ts";

type Tip = { readonly label: string; readonly keys: readonly string[]; readonly x: number; readonly y: number };

export function Tooltip() {
  const [tip, setTip] = useState<Tip | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const hideTip = () => {
      clearTimeout(timer);
      setTip(null);
    };
    const onOver = (e: MouseEvent) => {
      hideTip();
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-sc],[data-tip]") : null;
      if (!el) return;
      timer = setTimeout(() => {
        const s = el.dataset.sc ? shortcutById(el.dataset.sc) : undefined;
        const r = el.getBoundingClientRect();
        setTip({ label: s?.desc ?? el.dataset.tip ?? "", keys: s?.keys ?? [], x: r.left + r.width / 2, y: r.bottom + 8 });
      }, 400);
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", hideTip);
    return () => {
      hideTip();
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", hideTip);
    };
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || !tip) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.left = `${Math.min(Math.max(6, tip.x - w / 2), window.innerWidth - w - 6)}px`;
    el.style.top = `${tip.y + h > window.innerHeight ? tip.y - h - 40 : tip.y}px`;
  }, [tip]);
  if (!tip) return null;
  return (
    <div className="tooltip" ref={ref} role="tooltip">
      {tip.label}
      {tip.keys.length > 0 && (
        <span className="keys">
          {tip.keys.map((k) => (
            <kbd key={k}>{k}</kbd>
          ))}
        </span>
      )}
    </div>
  );
}
