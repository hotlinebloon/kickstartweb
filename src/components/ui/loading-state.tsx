export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="state-surface" role="status" aria-live="polite">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <p className="muted">{label}...</p>
    </div>
  );
}
