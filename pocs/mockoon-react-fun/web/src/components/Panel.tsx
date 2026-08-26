import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  note?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export const Panel = ({ title, note, actions, children }: PanelProps) => (
  <section className="panel">
    <header className="panel__head">
      <h2 className="panel__title">{title}</h2>
      {actions ?? (note ? <span className="panel__note">{note}</span> : null)}
    </header>
    {children}
  </section>
);
