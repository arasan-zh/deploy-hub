import { NextRequest, NextResponse } from "next/server";
import { createGitDeployment, isNameTaken, friendlyDeployError, type BuildPack } from "@/lib/coolify";
import { resolveName } from "@/lib/naming";

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
  const name = resolveName(typeof body.name === "string" ? body.name : null, repoName);

  try {
    if (await isNameTaken(name)) {
      return NextResponse.json(
        { error: "That name is already taken. Try a different one." },
        { status: 409 },
      );
    }
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
    const { message, status } = friendlyDeployError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
