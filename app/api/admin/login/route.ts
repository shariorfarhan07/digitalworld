import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/db";
import {
  checkCredentials,
  clientIp,
  createSessionToken,
  isSecureRequest,
  sessionCookie,
} from "@/lib/auth";

export const runtime = "nodejs";

// 10 attempts per 15 minutes per IP
const LIMIT = 10;
const WINDOW = 15 * 60;

export async function POST(req: Request) {
  const ip = clientIp(req);

  if (!rateLimit(`login:${ip}`, LIMIT, WINDOW)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(createSessionToken(), isSecureRequest(req)));
  return res;
}
