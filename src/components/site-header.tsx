import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/[.06] bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#131316] text-sm text-white">
            ▲
          </span>
          <span>Deploy Hub</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hidden text-black/60 hover:text-black sm:inline">
            Deploy
          </Link>
          <Link
            href="/deployments"
            className="rounded-full bg-[#131316] px-4 py-1.5 font-medium text-white transition hover:opacity-90"
          >
            My deployments
          </Link>
        </nav>
      </div>
    </header>
  );
}
