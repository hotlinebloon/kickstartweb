import type { ReactNode } from "react";

type BadgeTone = "default" | "accent" | "success" | "warning" | "danger" | "blue";
type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const className = tone === "default" ? "badge" : `badge ${tone}`;

  return <span className={className}>{children}</span>;
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: StatusTone;
}) {
  return (
    <span className={`status-badge ${tone}`}>
      <span aria-hidden="true" className="status-badge-symbol" />
      {children}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="progress" aria-label={`Progress ${safeValue}%`}>
      <span style={{ width: `${safeValue}%` }} />
    </div>
  );
}

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

export function WorkSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`work-surface ${className}`}>{children}</section>;
}

export function BlueprintEnvironment({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`blueprint-environment ${className}`}>{children}</section>;
}

export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="state-surface" role="status" aria-live="polite">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <p className="muted">{label}...</p>
    </div>
  );
}

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
      <div className="state-icon" aria-hidden="true">
        KS
      </div>
      <div className="stack-sm">
        <h2>{title}</h2>
        <p className="muted">{description}</p>
      </div>
      {action ? <div className="row">{action}</div> : null}
    </section>
  );
}
