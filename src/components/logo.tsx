"use client";

import { motion } from "framer-motion";

/** Base mark — static, used anywhere motion isn't appropriate (favicon-adjacent contexts, print). */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="url(#deployhub-logo-gradient)" />
      <path d="M16 8.5L22.5 19.5H9.5L16 8.5Z" fill="white" fillOpacity="0.95" />
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

/** Interactive mark — subtle lift + rotate on hover, tap feedback. Used wherever the logo is a link/button. */
export function LogoMarkInteractive({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ rotate: -6, scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="inline-flex"
    >
      <LogoMark className={className} />
    </motion.div>
  );
}

/** Animated mark — used as the branded loader while a deploy is building/starting. */
export function LogoLoader({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="absolute inset-[-6px] rounded-2xl"
        style={{
          background: "conic-gradient(from 0deg, var(--accent), var(--accent-2), transparent 60%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-background">
          <LogoMark className="h-[78%] w-[78%]" />
        </div>
      </motion.div>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <LogoMarkInteractive />
      <span>Deploy Hub</span>
    </span>
  );
}
