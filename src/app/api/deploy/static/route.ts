import { NextRequest, NextResponse } from "next/server";
import { createStaticDeployment, isNameTaken, friendlyDeployError } from "@/lib/coolify";
import { resolveName } from "@/lib/naming";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

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
  const name = resolveName(
    typeof nameInput === "string" ? nameInput : null,
    file.name.replace(/\.html?$/i, ""),
  );

  try {
    if (await isNameTaken(name)) {
      return NextResponse.json(
        { error: "That name is already taken. Try a different one." },
        { status: 409 },
      );
    }
    const { uuid, url } = await createStaticDeployment({ name, htmlContent });
    return NextResponse.json({ uuid, url, name }, { status: 201 });
  } catch (err) {
    const { message, status } = friendlyDeployError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
