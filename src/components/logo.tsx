export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="url(#deployhub-logo-gradient)" />
      <path
        d="M16 8.5L22.5 19.5H9.5L16 8.5Z"
        fill="white"
        fillOpacity="0.95"
      />
      <rect x="13.25" y="21.5" width="5.5" height="2" rx="1" fill="white" fillOpacity="0.95" />
      <defs>
        <linearGradient id="deployhub-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <LogoMark />
      <span>Deploy Hub</span>
    </span>
  );
}
