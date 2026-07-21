import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAdminByUsername } from "./db";

const COOKIE = "idw_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.SESSION_SECRET || "dev-only-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const payload = `admin.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const expiry = Number(payload.split(".")[1]);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

export function isAdmin(): boolean {
  return verifySessionToken(cookies().get(COOKIE)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export function clearedSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}

/** Verifies a password against a "scrypt$<salt>$<hash>" string (see scripts/create-admin.js). */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  try {
    const salt = Buffer.from(parts[1], "base64url");
    const expected = Buffer.from(parts[2], "base64url");
    const actual = scryptSync(password, salt, expected.length);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  // database accounts first (created via: node scripts/create-admin.js <user> <pass>)
  const account = getAdminByUsername(username);
  if (account) return verifyPassword(password, account.password_hash);

  // fallback: the env-configured admin from .env.local
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || "";
  if (!p) return false;
  const ub = Buffer.from(username.padEnd(64).slice(0, 64));
  const ue = Buffer.from(u.padEnd(64).slice(0, 64));
  const pb = Buffer.from(password.padEnd(64).slice(0, 64));
  const pe = Buffer.from(p.padEnd(64).slice(0, 64));
  const okU = timingSafeEqual(ub, ue);
  const okP = timingSafeEqual(pb, pe);
  return okU && okP && username === u && password === p;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}
