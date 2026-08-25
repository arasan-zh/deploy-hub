import { NextRequest, NextResponse } from "next/server";
import { createGitDeployment, CoolifyError, type BuildPack } from "@/lib/coolify";

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "app"
  );
}

const VALID_BUILD_PACKS: BuildPack[] = ["nixpacks", "static", "dockerfile"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.repoUrl !== "string" || !body.repoUrl.trim()) {
    return NextResponse.json({ error: "A git repository URL is required." }, { status: 400 });
  }

  let repoHost: string;
  try {
    repoHost = new URL(body.repoUrl).hostname;
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }
  if (!repoHost) {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  const buildPack: BuildPack = VALID_BUILD_PACKS.includes(body.buildPack)
    ? body.buildPack
    : "nixpacks";

  const branch = typeof body.branch === "string" && body.branch.trim() ? body.branch.trim() : "main";
  const repoName = body.repoUrl.replace(/\.git$/, "").split("/").filter(Boolean).pop() ?? "app";
  const name = `${slugify(typeof body.name === "string" && body.name ? body.name : repoName)}-${Math.random().toString(36).slice(2, 7)}`;

  try {
    const { uuid, url } = await createGitDeployment({
      name,
      repoUrl: body.repoUrl.trim(),
      branch,
      buildPack,
      buildCommand: typeof body.buildCommand === "string" ? body.buildCommand : undefined,
      publishDirectory: typeof body.publishDirectory === "string" ? body.publishDirectory : undefined,
      dockerfileLocation: typeof body.dockerfileLocation === "string" ? body.dockerfileLocation : undefined,
    });
    return NextResponse.json({ uuid, url, name }, { status: 201 });
  } catch (err) {
    if (err instanceof CoolifyError) {
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status: err.status },
      );
    }
    return NextResponse.json({ error: "Deployment failed." }, { status: 500 });
  }
}
