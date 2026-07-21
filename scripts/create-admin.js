#!/usr/bin/env node
/**
 * Create (or update) an admin account for the iDigital World admin panel.
 *
 * Usage:
 *   node scripts/create-admin.js <username> <password>
 *   node scripts/create-admin.js --list          (show existing accounts)
 *   node scripts/create-admin.js --delete <username>
 *
 * Passwords are hashed with scrypt (never stored in plain text).
 * Accounts live in the same SQLite database as the site: data/idigital.db
 */

const path = require("path");
const fs = require("fs");
const { scryptSync, randomBytes } = require("crypto");
const Database = require("better-sqlite3");

const dir = path.join(process.cwd(), "data");
fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, "idigital.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const [, , a, b] = process.argv;

function usage() {
  console.log("Usage:");
  console.log("  node scripts/create-admin.js <username> <password>");
  console.log("  node scripts/create-admin.js --list");
  console.log("  node scripts/create-admin.js --delete <username>");
  process.exit(1);
}

if (a === "--list") {
  const rows = db.prepare("SELECT username, created_at FROM admins ORDER BY id").all();
  if (rows.length === 0) {
    console.log("No database admin accounts yet (the .env.local fallback still works).");
  } else {
    for (const r of rows) console.log(`- ${r.username}  (created ${r.created_at} UTC)`);
  }
  process.exit(0);
}

if (a === "--delete") {
  if (!b) usage();
  const r = db.prepare("DELETE FROM admins WHERE username = ?").run(b);
  console.log(r.changes ? `Deleted account "${b}".` : `No account named "${b}".`);
  process.exit(0);
}

const username = (a || "").trim();
const password = b || "";

if (!username || !password) usage();
if (username.length > 64) {
  console.error("Username must be 64 characters or fewer.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
const stored = `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;

const existing = db.prepare("SELECT id FROM admins WHERE username = ?").get(username);
if (existing) {
  db.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").run(stored, username);
  console.log(`Updated password for existing account "${username}".`);
} else {
  db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, stored);
  console.log(`Created admin account "${username}".`);
}
console.log("Sign in at /admin/login");
