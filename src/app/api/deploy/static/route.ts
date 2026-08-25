import { NextRequest, NextResponse } from "next/server";
import { createStaticDeployment, CoolifyError } from "@/lib/coolify";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "site"
  );
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const nameInput = form.get("name");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".html") && file.type !== "text/html") {
    return NextResponse.json(
      { error: "Only a single .html file is supported." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Max size is 2MB." },
      { status: 400 },
    );
  }

  const htmlContent = await file.text();
  const name = `${slugify(typeof nameInput === "string" && nameInput ? nameInput : file.name.replace(/\.html?$/i, ""))}-${Math.random().toString(36).slice(2, 7)}`;

  try {
    const { uuid, url } = await createStaticDeployment({ name, htmlContent });
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
