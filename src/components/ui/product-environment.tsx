import type { ReactNode } from "react";

export function ProductEnvironment({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`product-environment ${className}`}>{children}</section>;
}
