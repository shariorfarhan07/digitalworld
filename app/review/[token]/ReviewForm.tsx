"use client";

import { useState } from "react";

const inputStyles =
  "w-full rounded-lg border border-white/10 bg-black px-4 py-3.5 font-body text-base text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/60 transition-colors duration-300";

export default function ReviewForm({ token }: { token: string }) {
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/review/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: f.get("client_name"),
          client_role: f.get("client_role"),
          quote: f.get("quote"),
          rating,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setSent(true);
      else setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-glow/15 text-2xl">
          ✓
        </span>
        <h1 className="font-display text-2xl font-semibold text-on-surface">Thank you.</h1>
        <p className="max-w-xs font-body text-base text-on-surface-variant">
          Your review has been submitted. We may feature it on our site.
        </p>
      </div>
    );
  }

  return (
    <>
      <span className="label-caps">Share your experience</span>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-headline text-on-surface md:text-3xl">
        Leave a review
      </h1>
      <form className="mt-8 flex flex-col gap-5" onSubmit={submit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="client_name" className="label-caps !text-xs">
            Your name
          </label>
          <input
            id="client_name"
            name="client_name"
            required
            autoComplete="name"
            className={inputStyles}
            placeholder="Jane Smith"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="client_role" className="label-caps !text-xs">
            Role / company <span className="normal-case text-outline">(optional)</span>
          </label>
          <input
            id="client_role"
            name="client_role"
            className={inputStyles}
            placeholder="Founder, Acme Co."
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-caps !text-xs">Rating</span>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`text-2xl leading-none transition-colors ${
                  n <= rating ? "text-primary" : "text-outline"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="quote" className="label-caps !text-xs">
            Your review
          </label>
          <textarea
            id="quote"
            name="quote"
            rows={5}
            required
            className={inputStyles}
            placeholder="Tell us about working with us…"
          />
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 font-body text-sm text-[#ffb4ab]"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-electric-gradient px-6 py-3.5 font-body text-base font-medium text-white shadow-glow-primary disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </>
  );
}
