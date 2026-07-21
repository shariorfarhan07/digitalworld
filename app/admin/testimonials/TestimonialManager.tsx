"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReviewLink, Testimonial } from "@/lib/db";

const inputStyles =
  "w-full rounded-lg border border-white/10 bg-black px-4 py-3 font-body text-base text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/60 transition-colors duration-300";

type Draft = {
  id: number;
  client_name: string;
  client_role: string;
  rating: number;
  quote: string;
  published: boolean;
};

const emptyDraft: Draft = { id: 0, client_name: "", client_role: "", rating: 5, quote: "", published: true };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-primary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, n) => (
        <span key={n} aria-hidden="true" className={n < rating ? "" : "text-outline"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function TestimonialManager({
  testimonials,
  links,
}: {
  testimonials: Testimonial[];
  links: ReviewLink[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [linkLabel, setLinkLabel] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDraft(null);
        router.refresh();
      } else {
        setError(data.error || "Could not save the testimonial.");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(t: Testimonial) {
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, published: !t.published }),
    });
    router.refresh();
  }

  async function remove(id: number, name: string) {
    if (!window.confirm(`Delete the review from "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function generateLink(e: React.FormEvent) {
    e.preventDefault();
    if (linkBusy) return;
    setLinkBusy(true);
    setLinkError(null);
    setGeneratedUrl(null);
    setCopied(false);
    try {
      const res = await fetch("/api/admin/review-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: linkLabel }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        setGeneratedUrl(`${window.location.origin}/review/${data.token}`);
        setLinkLabel("");
        router.refresh();
      } else {
        setLinkError(data.error || "Could not generate a link.");
      }
    } catch {
      setLinkError("Could not reach the server.");
    } finally {
      setLinkBusy(false);
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the link is still visible to copy manually
    }
  }

  async function revokeLink(token: string) {
    if (!window.confirm("Revoke this unused link? It will stop working.")) return;
    const res = await fetch(`/api/admin/review-links?token=${encodeURIComponent(token)}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col gap-10">
      {/* generate a one-time client link */}
      <div className="glass flex flex-col gap-4 rounded-xl p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-on-surface">
          Generate a one-time review link
        </h2>
        <p className="font-body text-sm text-on-surface-variant">
          Send this link to a client. It works once — after they submit their
          review it stops working, and the review appears below for you to
          approve.
        </p>
        <form onSubmit={generateLink} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="link-label" className="label-caps !text-xs">
              Note for you <span className="normal-case text-outline">(optional, e.g. client name)</span>
            </label>
            <input
              id="link-label"
              className={inputStyles}
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder="Acme Co."
            />
          </div>
          <button
            type="submit"
            disabled={linkBusy}
            className="rounded-lg bg-electric-gradient px-6 py-3 font-body text-sm font-medium text-white disabled:opacity-60"
          >
            {linkBusy ? "Generating…" : "Generate link"}
          </button>
        </form>
        {linkError && (
          <p role="alert" className="rounded-lg border border-error/30 bg-error-container/20 px-4 py-3 font-body text-sm text-error">
            {linkError}
          </p>
        )}
        {generatedUrl && (
          <div className="ghost-border flex flex-col gap-2 rounded-lg bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <code className="break-all font-body text-sm text-on-surface">{generatedUrl}</code>
            <button
              type="button"
              onClick={() => copy(generatedUrl)}
              className="shrink-0 rounded-lg border border-white/10 px-4 py-2 font-body text-xs text-on-surface-variant hover:text-on-surface"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        )}
      </div>

      {/* pending / used links */}
      {links.length > 0 && (
        <div className="glass overflow-x-auto rounded-xl">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="label-caps !text-xs px-6 py-4">Note</th>
                <th className="label-caps !text-xs px-6 py-4">Status</th>
                <th className="label-caps !text-xs px-6 py-4">Created</th>
                <th className="label-caps !text-xs px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.token} className="border-b border-white/5 last:border-b-0">
                  <td className="px-6 py-4 font-body text-sm text-on-surface">
                    {l.label || <span className="text-outline">—</span>}
                  </td>
                  <td className="px-6 py-4 font-body text-sm">
                    {l.used ? (
                      <span className="text-outline">Used</span>
                    ) : (
                      <span className="text-emerald-glow">Pending</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-body text-sm text-on-surface-variant">
                    {new Date(l.created_at + "Z").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-body text-sm">
                    {!l.used && (
                      <>
                        <button
                          onClick={() => copy(`${window.location.origin}/review/${l.token}`)}
                          className="text-primary hover:underline"
                        >
                          Copy link
                        </button>
                        <button
                          onClick={() => revokeLink(l.token)}
                          className="ml-4 text-error hover:underline"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* manually add / edit a review */}
      {!draft && (
        <button
          onClick={() => setDraft(emptyDraft)}
          className="self-start rounded-lg bg-electric-gradient px-6 py-3 font-body text-sm font-medium text-white shadow-glow-primary"
        >
          + Add a review
        </button>
      )}

      {draft && (
        <form onSubmit={save} className="glass flex flex-col gap-4 rounded-xl p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-on-surface">
            {draft.id ? "Edit review" : "Add a review"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="t-name" className="label-caps !text-xs">Client name</label>
              <input
                id="t-name"
                required
                className={inputStyles}
                value={draft.client_name}
                onChange={(e) => setDraft({ ...draft, client_name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="t-role" className="label-caps !text-xs">
                Role / company <span className="normal-case text-outline">(optional)</span>
              </label>
              <input
                id="t-role"
                className={inputStyles}
                value={draft.client_role}
                onChange={(e) => setDraft({ ...draft, client_role: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="label-caps !text-xs">Rating</span>
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={draft.rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setDraft({ ...draft, rating: n })}
                  className={`text-2xl leading-none transition-colors ${
                    n <= draft.rating ? "text-primary" : "text-outline"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="t-quote" className="label-caps !text-xs">Review</label>
            <textarea
              id="t-quote"
              rows={4}
              required
              className={inputStyles}
              value={draft.quote}
              onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-3 font-body text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              className="h-4 w-4 accent-[#4d8eff]"
            />
            Visible on the site
          </label>
          {error && (
            <p role="alert" className="rounded-lg border border-error/30 bg-error-container/20 px-4 py-3 font-body text-sm text-error">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-electric-gradient px-6 py-3 font-body text-sm font-medium text-white disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save review"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="glass rounded-lg px-6 py-3 font-body text-sm text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* all testimonials */}
      <div className="glass overflow-x-auto rounded-xl">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="label-caps !text-xs px-6 py-4">Client</th>
              <th className="label-caps !text-xs px-6 py-4">Rating</th>
              <th className="label-caps !text-xs px-6 py-4">Review</th>
              <th className="label-caps !text-xs px-6 py-4">Visible</th>
              <th className="label-caps !text-xs px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center font-body text-sm text-on-surface-variant">
                  No reviews yet.
                </td>
              </tr>
            )}
            {testimonials.map((t) => (
              <tr key={t.id} className="border-b border-white/5 align-top last:border-b-0">
                <td className="px-6 py-4 font-body text-sm">
                  <p className="font-medium text-on-surface">{t.client_name}</p>
                  {t.client_role && <p className="text-xs text-outline">{t.client_role}</p>}
                </td>
                <td className="px-6 py-4 font-body text-sm">
                  <Stars rating={t.rating} />
                </td>
                <td className="max-w-[360px] px-6 py-4 font-body text-sm text-on-surface-variant">
                  {t.quote}
                </td>
                <td className="px-6 py-4 font-body text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={t.published === 1}
                      onChange={() => togglePublished(t)}
                      className="h-4 w-4 accent-[#4d8eff]"
                    />
                    {t.published ? (
                      <span className="text-emerald-glow">Live</span>
                    ) : (
                      <span className="text-outline">Hidden</span>
                    )}
                  </label>
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-body text-sm">
                  <button
                    onClick={() =>
                      setDraft({
                        id: t.id,
                        client_name: t.client_name,
                        client_role: t.client_role ?? "",
                        rating: t.rating,
                        quote: t.quote,
                        published: t.published === 1,
                      })
                    }
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(t.id, t.client_name)}
                    className="ml-4 text-error hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
