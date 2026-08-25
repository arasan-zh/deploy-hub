import { NextRequest, NextResponse } from "next/server";
import { getDeployment, deleteDeployment, CoolifyError } from "@/lib/coolify";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  try {
    const deployment = await getDeployment(uuid);
    return NextResponse.json({ deployment });
  } catch (err) {
    if (err instanceof CoolifyError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Could not load deployment." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  try {
    await deleteDeployment(uuid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof CoolifyError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Could not delete deployment." }, { status: 500 });
  }
}
