import { NextResponse } from "next/server";
import { consumeReviewLink, getReviewLink, rateLimit } from "@/lib/db";
import { clientIp } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const ip = clientIp(req);
  if (!rateLimit(`review:${ip}`, 10, 24 * 60 * 60)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again tomorrow." },
      { status: 429 }
    );
  }

  const link = getReviewLink(params.token);
  if (!link) {
    return NextResponse.json({ error: "This link is invalid." }, { status: 404 });
  }
  if (link.used) {
    return NextResponse.json({ error: "This link has already been used." }, { status: 410 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const client_name = String(body.client_name ?? "").trim().slice(0, 120);
  const client_role = String(body.client_role ?? "").trim().slice(0, 120);
  const quote = String(body.quote ?? "").trim().slice(0, 1000);
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));

  if (!client_name || !quote || !rating) {
    return NextResponse.json(
      { error: "Please fill in your name, rating and review." },
      { status: 400 }
    );
  }

  const id = consumeReviewLink(params.token, { client_name, client_role, rating, quote });
  if (id === null) {
    return NextResponse.json({ error: "This link has already been used." }, { status: 410 });
  }

  return NextResponse.json({ ok: true });
}
