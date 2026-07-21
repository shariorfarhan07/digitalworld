import { NextResponse } from "next/server";
import { insertContact, rateLimit } from "@/lib/db";
import { clientIp } from "@/lib/auth";

export const runtime = "nodejs";

// 5 submissions per day per IP
const LIMIT = 5;
const WINDOW = 24 * 60 * 60;

export async function POST(req: Request) {
  const ip = clientIp(req);

  if (!rateLimit(`contact:${ip}`, LIMIT, WINDOW)) {
    return NextResponse.json(
      { error: "Daily limit reached. Please try again tomorrow." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const website = String(body.website ?? "").trim().slice(0, 300);
  const about = String(body.about ?? "").trim().slice(0, 3000);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email address." },
      { status: 400 }
    );
  }

  insertContact({ name, email, website, about, ip });
  return NextResponse.json({ ok: true });
}
