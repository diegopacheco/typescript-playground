import { useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "../icons.tsx";
import { dockSide, type Side } from "./layout.ts";
import { usePanels } from "./PanelsProvider.tsx";

type PanelProps = {
  readonly id: string;
  readonly title: string;
  readonly view: string;
  readonly icon?: IconName;
  readonly heading?: ReactNode;
  readonly narrow?: boolean;
  readonly toolbar?: ReactNode;
  readonly children: ReactNode;
};

export function Panel({ id, title, view, icon, heading, narrow, toolbar, children }: PanelProps) {
  const { hidden, expanded, toggleExpand, hidePanel } = usePanels();
  const [sliding, setSliding] = useState<Side | null>(null);
  const ref = useRef<HTMLElement>(null);
  if (hidden.some((h) => h.id === id)) return null;
  const isExpanded = expanded === id;
  const onHide = () => {
    const rect = ref.current?.getBoundingClientRect();
    const side = rect ? dockSide(rect, window.innerWidth) : "right";
    setSliding(side);
    setTimeout(() => {
      setSliding(null);
      hidePanel({ id, side, title, view });
    }, 200);
  };
  const classes = ["panel", narrow ? "narrow" : "", isExpanded ? "expanded" : "", sliding ? `sliding-${sliding}` : ""].filter(Boolean).join(" ");
  const expandTip = isExpanded ? "Collapse panel" : "Expand panel";
  return (
    <section ref={ref} className={classes} data-panel={id}>
      <div className="panel-head">
        <h2>
          {icon && <Icon name={icon} />}
          {heading ?? title}
        </h2>
        {toolbar && <div className="toolbar">{toolbar}</div>}
        <div className="panel-tools">
          <button className="icon-btn" data-tip={isExpanded ? "Collapse panel  Esc" : expandTip} aria-label={expandTip} onClick={() => toggleExpand(id)}>
            <Icon name={isExpanded ? "collapse" : "expand"} size={16} />
          </button>
          <button className="icon-btn" data-tip="Hide panel" aria-label="Hide panel" onClick={onHide}>
            <Icon name="hide" size={16} />
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}
