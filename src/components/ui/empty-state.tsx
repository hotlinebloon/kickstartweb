import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="state-surface">
      <div className="stack-sm">
        <h2>{title}</h2>
        <p className="muted">{description}</p>
      </div>
      {action ? <div className="row">{action}</div> : null}
    </section>
  );
}
