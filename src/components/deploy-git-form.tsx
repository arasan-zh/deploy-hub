"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { DeployResult, type DeployResultData } from "./deploy-result";
import { DomainPreview } from "./domain-preview";

type BuildPack = "nixpacks" | "static" | "dockerfile";

const BUILD_PACKS: { value: BuildPack; label: string; hint: string }[] = [
  {
    value: "nixpacks",
    label: "Auto-detect (recommended)",
    hint: "Works for Next.js, Node, and most frameworks with a start command.",
  },
  {
    value: "static",
    label: "Static build",
    hint: "For Astro, Vite, or any framework that outputs a static folder.",
  },
  {
    value: "dockerfile",
    label: "Custom Dockerfile",
    hint: "Use the Dockerfile already in the repo.",
  },
];

export function DeployGitForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [name, setName] = useState("");
  const [buildPack, setBuildPack] = useState<BuildPack>("nixpacks");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [publishDirectory, setPublishDirectory] = useState("dist");
  const [dockerfileLocation, setDockerfileLocation] = useState("/Dockerfile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeployResultData | null>(null);

  if (result) {
    return <DeployResult result={result} onReset={() => setResult(null)} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setError("A git repository URL is required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/deploy/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          branch,
          name,
          buildPack,
          buildCommand,
          publishDirectory,
          dockerfileLocation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Deployment failed.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="https://github.com/you/your-repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        fullWidth
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          fullWidth
        />
        <Input
          placeholder="App name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </div>
      <DomainPreview
        name={name || repoUrl.replace(/\.git$/, "").split("/").filter(Boolean).pop() || ""}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/70">Build type</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {BUILD_PACKS.map((bp) => (
            <button
              key={bp.value}
              type="button"
              onClick={() => setBuildPack(bp.value)}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                buildPack === bp.value
                  ? "border-accent bg-accent-soft"
                  : "border-border hover:border-foreground/25"
              }`}
            >
              <div className="font-medium">{bp.label}</div>
              <div className="mt-0.5 text-xs text-foreground/50">{bp.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {buildPack === "static" && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Build command"
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            fullWidth
          />
          <Input
            placeholder="Publish directory"
            value={publishDirectory}
            onChange={(e) => setPublishDirectory(e.target.value)}
            fullWidth
          />
        </div>
      )}

      {buildPack === "dockerfile" && (
        <Input
          placeholder="Dockerfile path"
          value={dockerfileLocation}
          onChange={(e) => setDockerfileLocation(e.target.value)}
          fullWidth
        />
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" variant="primary" isDisabled={loading} fullWidth>
        {loading ? "Deploying…" : "Deploy from git"}
      </Button>
    </form>
  );
}
