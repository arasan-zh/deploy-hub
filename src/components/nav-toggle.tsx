"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const ITEMS = [
  { href: "/", label: "Deploy" },
  { href: "/deployments", label: "Deployments" },
] as const;

export function NavToggle() {
  const pathname = usePathname();

  return (
    <nav className="relative inline-flex items-center gap-1 rounded-full bg-surface-secondary p-1 text-sm">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative rounded-full px-4 py-1.5 font-medium transition-colors"
          >
            {active && (
              <motion.span
                layoutId="nav-toggle-active"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className={`relative z-10 ${active ? "text-accent-foreground" : "text-foreground/60"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
