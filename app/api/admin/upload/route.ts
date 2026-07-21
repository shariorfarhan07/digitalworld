import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { randomBytes } from "crypto";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP or GIF images are allowed." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large (8 MB maximum)." },
      { status: 413 }
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });

  const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
