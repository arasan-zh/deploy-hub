import { NextResponse } from "next/server";
import { listDeployments } from "@/lib/coolify";

export async function GET() {
  try {
    const deployments = await listDeployments();
    deployments.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ deployments });
  } catch {
    return NextResponse.json({ error: "Could not load deployments." }, { status: 500 });
  }
}
