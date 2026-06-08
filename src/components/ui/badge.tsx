import type { ReactNode } from "react";

type BadgeTone = "default" | "accent" | "success" | "warning" | "danger" | "blue";

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
