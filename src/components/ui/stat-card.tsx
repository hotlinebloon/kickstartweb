import type { ReactNode } from "react";

export function StatCard({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: ReactNode;
}) {
  return (
    <article className="card stack-sm">
      <p className="eyebrow">{title}</p>
      <h2>{value}</h2>
      <p className="muted">{description}</p>
    </article>
  );
}
