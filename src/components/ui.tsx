import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "success" | "warning" }) {
  return <span className={`badge ${tone !== "default" ? tone : ""}`}>{children}</span>;
}

export function Progress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress" aria-label={`${safeValue}%`}>
      <div style={{ width: `${safeValue}%` }} />
    </div>
  );
}

export function StatCard({ title, description, value }: { title: string; description: string; value: string | number }) {
  return (
    <div className="card">
      <div className="stack">
        <div>
          <h3>{title}</h3>
          <p className="muted" style={{ marginTop: 4 }}>{description}</p>
        </div>
        <p style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em" }}>{value}</p>
      </div>
    </div>
  );
}
