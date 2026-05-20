export function KickstartLogo() {
  return (
    <svg
      className="ks-logo-mark"
      viewBox="0 0 100 100"
      role="img"
      aria-label="Kickstart missing-piece asterisk logo"
    >
      <circle cx="50" cy="50" r="7" fill="var(--accent)" />

      <line
        x1="50"
        y1="50"
        x2="50"
        y2="18"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="82"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="18"
        y2="50"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="82"
        y2="50"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="27"
        y2="27"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="73"
        y2="73"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="27"
        y2="73"
        stroke="var(--accent)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      <circle cx="73" cy="27" r="6" fill="var(--surface)" />
      <circle
        cx="73"
        cy="27"
        r="6"
        fill="none"
        stroke="rgba(214, 45, 45, 0.25)"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
    </svg>
  );
}