import { NextResponse } from "next/server";
import { createReviewLink, deleteReviewLink } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Not authorised." }, { status: 401 });
}

export async function POST(req: Request) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const label = String(body.label ?? "").trim().slice(0, 120);

  const token = createReviewLink(label || undefined);
  return NextResponse.json({ ok: true, token });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return unauthorized();
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }
  deleteReviewLink(token);
  return NextResponse.json({ ok: true });
}
