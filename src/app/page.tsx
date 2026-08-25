import { DeployTabs } from "@/components/deploy-tabs";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 text-center sm:mb-10 sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Deploy your site in one click
        </h1>
        <p className="mt-2 text-black/60">
          Upload a single HTML file, or point us at a git repo — Next.js, Astro, or anything else.
        </p>
      </div>

      <DeployTabs />
    </div>
  );
}
