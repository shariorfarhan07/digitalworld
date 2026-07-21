"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inputStyles =
  "w-full rounded-lg border border-white/10 bg-black px-4 py-3.5 font-body text-base text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/60 transition-colors duration-300";

export default function AdminLogin() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: f.get("username"),
          password: f.get("password"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
        setBusy(false);
      }
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/brand/logo-primary-light.svg"
            alt="iDigital World"
            width={160}
            height={38}
            className="h-9 w-auto"
            priority
          />
        </div>
        <form onSubmit={submit} className="glass flex flex-col gap-5 rounded-2xl p-8">
          <h1 className="text-center font-display text-2xl font-semibold text-on-surface">
            Admin sign in
          </h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="label-caps !text-xs">
              Username
            </label>
            <input id="username" name="username" required autoComplete="username" className={inputStyles} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="label-caps !text-xs">
              Password
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className={inputStyles} />
          </div>
          {error && (
            <p role="alert" className="rounded-lg border border-error/30 bg-error-container/20 px-4 py-3 font-body text-sm text-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-electric-gradient px-7 py-3.5 font-body text-base font-medium text-white shadow-glow-primary disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
