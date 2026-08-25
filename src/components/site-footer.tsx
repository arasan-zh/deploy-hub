export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-foreground/40 sm:flex-row sm:px-6">
        <span>Deploy Hub</span>
        <span>Every deploy lands on a real HTTPS domain, automatically.</span>
      </div>
    </footer>
  );
}
