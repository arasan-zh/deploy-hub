import { DeployTabs } from "@/components/deploy-tabs";
import { HeroBackground } from "@/components/hero-background";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    n: "01",
    title: "Bring your code",
    body: "Drop a single HTML file, or hand us a git repo — Next.js, Astro, or anything else.",
  },
  {
    n: "02",
    title: "We build it",
    body: "Nixpacks, a static build, or your own Dockerfile — auto-detected, built, and started.",
  },
  {
    n: "03",
    title: "It's live",
    body: "A real HTTPS domain, issued and routed automatically. No config, no waiting.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <HeroBackground />
        <div className="relative mx-auto w-full max-w-3xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
          <Reveal>
            <p className="mb-4 text-center text-sm font-medium text-accent sm:text-left">
              Deploy Hub
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-center text-4xl font-semibold tracking-tight text-balance sm:text-left sm:text-6xl">
              Ship anything.
              <br />
              <span className="text-gradient">In one click.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-lg text-center text-lg text-foreground/60 sm:mx-0 sm:text-left">
              Upload a static page or point us at a repo. We build it, host it, and hand you a
              live HTTPS URL.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-10">
            <div className="glass-card rounded-3xl p-4 shadow-surface sm:p-6">
              <DeployTabs />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-left">
              How it works
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="text-center sm:text-left">
                  <span className="font-mono text-sm text-foreground/35">{step.n}</span>
                  <h3 className="mt-2 font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/55">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
