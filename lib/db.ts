import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  db = new Database(path.join(dir, "idigital.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT,
      about TEXT,
      ip TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT NOT NULL,
      hit_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_rate_limits ON rate_limits (key, hit_at);

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_role TEXT,
      rating INTEGER NOT NULL DEFAULT 5,
      quote TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS review_links (
      token TEXT PRIMARY KEY,
      label TEXT,
      used INTEGER NOT NULL DEFAULT 0,
      testimonial_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      used_at TEXT
    );
  `);

  migrate(db);
  seedPosts(db);
  return db;
}

function migrate(d: Database.Database) {
  const cols = d.prepare("PRAGMA table_info(posts)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "cover_image")) {
    d.exec("ALTER TABLE posts ADD COLUMN cover_image TEXT");
  }
}

/**
 * Sliding-window rate limiter backed by SQLite.
 * Returns true when the caller is within the limit (and records the hit).
 */
export function rateLimit(key: string, limit: number, windowSeconds: number): boolean {
  const d = getDb();
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  d.prepare("DELETE FROM rate_limits WHERE hit_at < ?").run(now - 24 * 3600);

  const { n } = d
    .prepare("SELECT COUNT(*) AS n FROM rate_limits WHERE key = ? AND hit_at >= ?")
    .get(key, windowStart) as { n: number };

  if (n >= limit) return false;

  d.prepare("INSERT INTO rate_limits (key, hit_at) VALUES (?, ?)").run(key, now);
  return true;
}

export type Admin = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

export function getAdminByUsername(username: string): Admin | undefined {
  return getDb()
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(username) as Admin | undefined;
}

export type Contact = {
  id: number;
  name: string;
  email: string;
  website: string | null;
  about: string | null;
  ip: string | null;
  created_at: string;
};

export function insertContact(c: {
  name: string;
  email: string;
  website?: string;
  about?: string;
  ip?: string;
}) {
  getDb()
    .prepare(
      "INSERT INTO contacts (name, email, website, about, ip) VALUES (?, ?, ?, ?, ?)"
    )
    .run(c.name, c.email, c.website ?? null, c.about ?? null, c.ip ?? null);
}

export function listContacts(): Contact[] {
  return getDb()
    .prepare("SELECT * FROM contacts ORDER BY id DESC")
    .all() as Contact[];
}

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published: number;
  created_at: string;
  updated_at: string;
};

export function listPublishedPosts(): Post[] {
  return getDb()
    .prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC")
    .all() as Post[];
}

export function listAllPosts(): Post[] {
  return getDb().prepare("SELECT * FROM posts ORDER BY created_at DESC").all() as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as
    | Post
    | undefined;
}

export function getPostById(id: number): Post | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Post
    | undefined;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function createPost(p: {
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  published: boolean;
}): number {
  let slug = slugify(p.title) || `post-${Date.now()}`;
  if (getPostBySlug(slug)) slug = `${slug}-${Date.now().toString(36)}`;
  const r = getDb()
    .prepare(
      "INSERT INTO posts (slug, title, excerpt, content, cover_image, published) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(slug, p.title, p.excerpt, p.content, p.cover_image ?? null, p.published ? 1 : 0);
  return Number(r.lastInsertRowid);
}

export function updatePost(
  id: number,
  p: { title: string; excerpt: string; content: string; cover_image?: string; published: boolean }
) {
  getDb()
    .prepare(
      "UPDATE posts SET title = ?, excerpt = ?, content = ?, cover_image = ?, published = ?, updated_at = datetime('now') WHERE id = ?"
    )
    .run(p.title, p.excerpt, p.content, p.cover_image ?? null, p.published ? 1 : 0, id);
}

export type Testimonial = {
  id: number;
  client_name: string;
  client_role: string | null;
  rating: number;
  quote: string;
  published: number;
  created_at: string;
};

export function listPublishedTestimonials(): Testimonial[] {
  return getDb()
    .prepare("SELECT * FROM testimonials WHERE published = 1 ORDER BY created_at DESC")
    .all() as Testimonial[];
}

export function listAllTestimonials(): Testimonial[] {
  return getDb()
    .prepare("SELECT * FROM testimonials ORDER BY created_at DESC")
    .all() as Testimonial[];
}

export function getTestimonialById(id: number): Testimonial | undefined {
  return getDb().prepare("SELECT * FROM testimonials WHERE id = ?").get(id) as
    | Testimonial
    | undefined;
}

export function createTestimonial(t: {
  client_name: string;
  client_role?: string;
  rating: number;
  quote: string;
  published?: boolean;
}): number {
  const r = getDb()
    .prepare(
      "INSERT INTO testimonials (client_name, client_role, rating, quote, published) VALUES (?, ?, ?, ?, ?)"
    )
    .run(t.client_name, t.client_role ?? null, t.rating, t.quote, t.published ? 1 : 0);
  return Number(r.lastInsertRowid);
}

export function updateTestimonial(
  id: number,
  t: { client_name: string; client_role?: string; rating: number; quote: string; published: boolean }
) {
  getDb()
    .prepare(
      "UPDATE testimonials SET client_name = ?, client_role = ?, rating = ?, quote = ?, published = ? WHERE id = ?"
    )
    .run(t.client_name, t.client_role ?? null, t.rating, t.quote, t.published ? 1 : 0, id);
}

export function setTestimonialPublished(id: number, published: boolean) {
  getDb().prepare("UPDATE testimonials SET published = ? WHERE id = ?").run(published ? 1 : 0, id);
}

export function deleteTestimonial(id: number) {
  getDb().prepare("DELETE FROM testimonials WHERE id = ?").run(id);
}

export type ReviewLink = {
  token: string;
  label: string | null;
  used: number;
  testimonial_id: number | null;
  created_at: string;
  used_at: string | null;
};

export function createReviewLink(label?: string): string {
  const token = randomBytes(24).toString("base64url");
  getDb()
    .prepare("INSERT INTO review_links (token, label) VALUES (?, ?)")
    .run(token, label ?? null);
  return token;
}

export function getReviewLink(token: string): ReviewLink | undefined {
  return getDb().prepare("SELECT * FROM review_links WHERE token = ?").get(token) as
    | ReviewLink
    | undefined;
}

export function listReviewLinks(): ReviewLink[] {
  return getDb().prepare("SELECT * FROM review_links ORDER BY created_at DESC").all() as ReviewLink[];
}

export function deleteReviewLink(token: string) {
  getDb().prepare("DELETE FROM review_links WHERE token = ? AND used = 0").run(token);
}

/**
 * Atomically claims a one-time review link and stores the client's submission
 * as an unpublished testimonial pending admin approval. Returns null if the
 * link doesn't exist or was already used.
 */
export function consumeReviewLink(
  token: string,
  t: { client_name: string; client_role?: string; rating: number; quote: string }
): number | null {
  const d = getDb();
  const claim = d
    .prepare("UPDATE review_links SET used = 1, used_at = datetime('now') WHERE token = ? AND used = 0")
    .run(token);
  if (claim.changes === 0) return null;

  const id = createTestimonial({ ...t, published: false });
  d.prepare("UPDATE review_links SET testimonial_id = ? WHERE token = ?").run(id, token);
  return id;
}

export function deletePost(id: number) {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}

function seedPosts(d: Database.Database) {
  const { n } = d.prepare("SELECT COUNT(*) AS n FROM posts").get() as { n: number };
  if (n > 0) return;

  const seed = [
    {
      title: "Why we give away homepage mockups",
      excerpt:
        "Most agencies ask you to trust a pitch deck. We'd rather you judge a real design for your own business — before you spend anything.",
      content: `Every agency says they do great work. From the outside, those claims all look identical — which is exactly why we stopped making them.

Instead, we design a homepage concept for your business first, for free. Not a template with your logo dropped in: a real design decision based on what you do, who your customers are, and what your current site fails to say.

Why work for free? Because it removes the riskiest part of hiring a studio — the leap of faith. You see the thinking, the craft and the direction before a single pound changes hands. If the mockup doesn't convince you, you keep it and we part as friends.

It also keeps us honest. A studio that has to prove itself on every enquiry can't coast on a portfolio from three years ago. The work has to be good today.

If you'd like to see what your homepage could be, request a mockup on our homepage. It costs you nothing but the form.`,
    },
    {
      title: "Five signs your website is costing you clients",
      excerpt:
        "A website rarely fails loudly. It fails quietly, one visitor at a time. Here are the warning signs we see most often.",
      content: `One: it loads slowly. Visitors decide whether to stay within seconds. If your site takes longer to appear than it takes to leave, they leave.

Two: it says what you do, but not what changes for the customer. "We provide bespoke solutions" tells a visitor nothing. "We help you win more clients" is a reason to keep reading.

Three: it looks dated next to your competitors. Fairly or not, visitors read design quality as business quality. A tired website quietly tells people your standards have slipped — even when the opposite is true.

Four: there is no single, obvious next step. If your homepage offers six equal links and no clear action, most people take none of them.

Five: it never changes. A site that hasn't been touched in years signals a business that has stopped moving. Search engines notice too.

None of these problems needs a big-agency budget to fix. They need coherence: design, message and marketing pulling in the same direction. That's the whole reason our studio works from one roadmap instead of a menu of services.`,
    },
    {
      title: "One roadmap beats four vendors",
      excerpt:
        "A brand designer, a web developer, a content writer and a marketer — each doing good work — can still produce a bad result. Here's why.",
      content: `Hire four specialists separately and you get four separate definitions of success. The designer optimises for beauty, the developer for cleanliness, the writer for voice, the marketer for clicks. Each invoice is justified. The whole still underperforms.

The problem isn't talent — it's the seams. The website launches before the brand settles. The content calendar ignores what the site can actually convert. The ad budget sends traffic to pages that were never designed for it.

A single roadmap closes the seams. Identity, website, content and marketing are planned as one system with one measure of success: does this turn attention into enquiries? Decisions stop being departmental and start being commercial.

This is also why founder-led matters. When one person is answerable for the outcome — not for a deliverable — there's nowhere for a weak link to hide.

It's a quieter way to work. Fewer hand-offs, fewer meetings about meetings, and a result that behaves like one brand rather than four projects stapled together.`,
    },
  ];

  const ins = d.prepare(
    "INSERT INTO posts (slug, title, excerpt, content, published) VALUES (?, ?, ?, ?, 1)"
  );
  for (const p of seed) {
    ins.run(
      p.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
      p.title,
      p.excerpt,
      p.content
    );
  }
}
