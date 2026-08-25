import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/"
            className="hidden rounded-full px-3 py-1.5 text-foreground/60 transition hover:text-foreground sm:inline"
          >
            Deploy
          </Link>
          <Link
            href="/deployments"
            className="rounded-full bg-accent px-4 py-1.5 font-medium text-accent-foreground transition hover:opacity-90"
          >
            Deployments
          </Link>
        </nav>
      </div>
    </header>
  );
}
