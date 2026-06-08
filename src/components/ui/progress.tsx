export function Progress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={`Progress ${safeValue}%`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <span style={{ width: `${safeValue}%` }} />
    </div>
  );
}
