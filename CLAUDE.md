# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

iDigital World: a Next.js marketing site for a UK founder-led digital growth studio, plus a small SQLite-backed CMS (blog, testimonials, contact form) with an admin panel. `role.md` is the creative brief and `DESIGN.md` is the design system spec — read both before making visual changes. `ASSETS.md` documents the Google Flow/Veo3 prompts used to generate the video/image assets in `public/media/`.

**Hard rule from `role.md`:** never fabricate testimonials, metrics, clients, or case studies. Only real, admin-approved data is ever shown — e.g. the Testimonials section (`components/scenes/Testimonials.tsx`) renders `null` when there are zero published rows, rather than showing placeholder content.

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build             # production build
npm run start              # run a production build locally
npm run lint                # next lint
npx tsc --noEmit             # typecheck — there is no test suite in this repo, this is the main correctness check

npm run create-admin -- <username> <password>   # create/update an admin account
npm run create-admin -- --list                   # list admin accounts
npm run create-admin -- --delete <username>      # delete an admin account

./deploy.sh               # deploy latest origin/main to the production server (see Deployment below)
docker compose up --build  # run the app in Docker locally
```

There is no test framework configured (no Jest/Vitest/Playwright) — verification is done via `tsc --noEmit`, `npm run build`, and manual/scripted checks against the dev server.

## Architecture

**Stack:** Next.js 14 App Router + TypeScript + Tailwind, Framer Motion + GSAP (ScrollTrigger) + Lenis for the scroll-driven landing page, TipTap for the rich blog editor, better-sqlite3 for persistence. No ORM — raw SQL via prepared statements in `lib/db.ts`.

**Homepage (`app/page.tsx`)** is `force-dynamic` (it reads live DB data for Testimonials/BlogPreview) and composes many full-bleed "scene" components from `components/scenes/` in a specific narrative order (Hero → Manifesto → Transformation → Pillars → Methodology → Process → Founder → Mission → Authority → BlogPreview → Testimonials → Offer → Footer). Each scene is a self-contained section; shared visual primitives (glass cards, magnetic buttons, reveal-on-scroll wrapper, ambient looping video) live in `components/ui/`.

**Data layer (`lib/db.ts`):** a lazy singleton `getDb()` opens `data/idigital.db` (WAL mode), creates tables with `CREATE TABLE IF NOT EXISTS`, and runs a `migrate()` step for additive schema changes (e.g. adding `posts.cover_image` via `ALTER TABLE` if the column is missing) — there's no formal migration system, just idempotent guards run on every `getDb()` call. Also exposes `rateLimit(key, limit, windowSeconds)`, a sliding-window limiter backed by a `rate_limits` table, used by the contact form, admin login, and review-link submission endpoints.

**Auth (`lib/auth.ts`):** custom implementation, not NextAuth. Sessions are an HMAC-SHA256-signed cookie (`idw_admin`); `checkCredentials()` checks the `admins` DB table first, falling back to `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars if no DB account matches the given username (a DB account for a username fully shadows the env fallback for that username — a common source of "wrong password" confusion). Passwords are scrypt-hashed. `isAdmin()` is called directly in server components/route handlers to gate access — there's no middleware-based route protection.

**Admin panel (`app/admin/`):** each page checks `isAdmin()` and `redirect("/admin/login")` itself; all pages are `force-dynamic`. Covers mockup-request contacts, blog posts (with a TipTap rich editor and image upload, `app/admin/posts/RichEditor.tsx`), and testimonials (manual entry + one-time client review links).

**One-time review links:** `app/admin/testimonials` generates a token (`createReviewLink`); the client visits `/review/[token]`, and submitting the form there (`app/api/review/[token]/route.ts`) atomically consumes the token and inserts an *unpublished* testimonial for the admin to approve.

**API routes (`app/api/`):** `admin/*` routes require `isAdmin()`; public routes (`contact`, `review/[token]`) are IP-rate-limited via `lib/db.ts`'s `rateLimit()`. Image uploads (`admin/upload`) validate MIME type and size, then write to `public/uploads/`.

## Design system

Tokens in `tailwind.config.ts` encode a dark "Lumina" design language: `bg-surface` `#10131a`, primary `#adc6ff`/container `#4d8eff`, secondary `#c0c1ff`/container `#3131c0`, tertiary `#ddb7ff`/container `#b76dff`. Glassmorphism is a reusable `.glass` utility in `app/globals.css`. Display font is Bricolage Grotesque (`next/font/google`), body font is Geist (`geist` package). `id="..."` anchors on scene sections (`#story`, `#services`, `#process`, `#founder`, `#mockup`, etc.) are used both for in-page nav links and are load-bearing — don't rename them without updating `NavTray.tsx`/`Footer.tsx`.

## Deployment

Docker multi-stage build (`Dockerfile`) on `node:20-bookworm-slim` (not alpine — `better-sqlite3`'s native binding needs glibc/a full build toolchain). `next.config.mjs` sets `output: "standalone"` for a lean runtime image.

Production deploys go through **`./deploy.sh`**: it SSHes to the server, does `git fetch && git reset --hard origin/main` in `/root/digitalworld`, then `docker compose up -d --build`, then polls the site until it responds 200. This means **the server's working tree must never be hand-edited** — any direct changes made on the server (outside of `git push` + `./deploy.sh`) will be silently discarded on the next deploy. The workflow is always: commit + push locally, then run `./deploy.sh`.

The server's `.env` (used by `docker-compose.yml` for `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`SESSION_SECRET`) is intentionally untracked and can differ from the local `.env.local` — check both when debugging environment-specific login issues, and note that editing `.env` on the server requires `docker compose up -d --force-recreate` (or the deploy script) to actually take effect, since Compose only reads it at container creation.

**Note:** `data/idigital.db` (+ `-shm`/`-wal`) and everything under `public/uploads/` are currently committed to git, not gitignored. This is unusual (a live SQLite DB and user-uploaded files are normally excluded) but is the existing convention in this repo — be aware that local testing will dirty this binary file in `git status`, and avoid committing throwaway test data. In practice this hasn't caused data loss on deploy because `docker-compose.yml` mounts `data/` and `public/uploads/` as named Docker volumes (`idigital-data`, `idigital-uploads`), which persist independently of the image once created and are not reset by `git reset --hard` or image rebuilds.

## Known gotchas

- **Cookie `secure` flag must be derived from the actual request scheme** (`lib/auth.ts`'s `isSecureRequest()`), never from `NODE_ENV`. The Docker image always sets `NODE_ENV=production` even when served over plain HTTP (no reverse-proxy TLS), and browsers silently drop `Secure` cookies set over an insecure connection — this previously broke admin login on the server in a way that was invisible to `curl`-based testing (curl doesn't enforce the browser's Secure-cookie-over-HTTP rule).
- **GLSL shader source must be pure ASCII**, even inside `//` comments — a stray em dash silently broke shader compilation on some GPU drivers (see `components/ui/ShaderBackground.tsx`).
- Don't call `WEBGL_lose_context` in a WebGL component's cleanup if it can remount under React StrictMode (dev) — it permanently kills the canvas's ability to get a working context on the following remount, since StrictMode intentionally mounts→unmounts→remounts once in development.
- Headless-browser screenshots (puppeteer-core driving a locally installed Edge) are useful for measuring real layout/overflow, but have produced misleading visual artifacts (white flashes, elements missing) that don't reflect actual rendering. Prefer computed styles / DOM assertions / `readPixels` timing caveats over trusting a screenshot in isolation when something looks wrong.
