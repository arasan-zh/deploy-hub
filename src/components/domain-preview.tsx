"use client";

import { slugify } from "@/lib/naming";

const DOMAIN_SUFFIX = "ela.kazhugu.cloud";

export function DomainPreview({ name }: { name: string }) {
  const slug = slugify(name);
  return (
    <p className="px-1 text-xs text-foreground/40">
      Will deploy to{" "}
      <span className="font-mono text-foreground/60">
        {slug || "auto-generated-name"}.{DOMAIN_SUFFIX}
      </span>
    </p>
  );
}
