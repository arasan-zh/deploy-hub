import { DeploymentsList } from "@/components/deployments-list";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "Deployments" };

export default function DeploymentsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <Reveal className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Public deployments
        </h1>
        <p className="mt-2 text-foreground/55">
          Everything currently live under <code className="font-mono">*.ela.kazhugu.cloud</code>.
        </p>
      </Reveal>

      <DeploymentsList />
    </div>
  );
}
