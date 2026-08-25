export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || ""
  );
}

function randomName(): string {
  return `site-${Math.random().toString(36).slice(2, 8)}`;
}

/** Uses the exact name the user gave (slugified), only falling back to a random one when nothing usable was provided. */
export function resolveName(input: string | null | undefined, fallback: string): string {
  const fromInput = input ? slugify(input) : "";
  if (fromInput) return fromInput;
  const fromFallback = slugify(fallback);
  return fromFallback || randomName();
}
