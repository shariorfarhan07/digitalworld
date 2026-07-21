"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Post } from "@/lib/db";
import RichEditor from "./RichEditor";

const inputStyles =
  "w-full rounded-lg border border-white/10 bg-black px-4 py-3 font-body text-base text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/60 transition-colors duration-300";

type Draft = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
};

const empty: Draft = { id: 0, title: "", excerpt: "", content: "", cover_image: "", published: true };

export default function PostManager({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  async function uploadCover(file: File) {
    setCoverUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setDraft((d) => (d ? { ...d, cover_image: data.url } : d));
      } else {
        setError(data.error || "Cover image upload failed.");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setCoverUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDraft(null);
        router.refresh();
      } else {
        setError(data.error || "Could not save the post.");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      {!draft && (
        <button
          onClick={() => setDraft(empty)}
          className="self-start rounded-lg bg-electric-gradient px-6 py-3 font-body text-sm font-medium text-white shadow-glow-primary"
        >
          + New post
        </button>
      )}

      {draft && (
        <form onSubmit={save} className="glass flex flex-col gap-4 rounded-xl p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-on-surface">
            {draft.id ? "Edit post" : "New post"}
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="p-title" className="label-caps !text-xs">Title</label>
            <input
              id="p-title"
              required
              className={inputStyles}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="p-excerpt" className="label-caps !text-xs">
              Excerpt <span className="normal-case text-outline">(shown on the list page)</span>
            </label>
            <textarea
              id="p-excerpt"
              rows={2}
              className={inputStyles}
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="label-caps !text-xs">
              Cover image <span className="normal-case text-outline">(shown on the Journal list and at the top of the post)</span>
            </span>
            <div className="flex items-center gap-4">
              {draft.cover_image ? (
                <div className="ghost-border relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-surface-lowest">
                  <Image src={draft.cover_image} alt="" fill sizes="128px" className="object-cover" />
                </div>
              ) : (
                <div className="ghost-border flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-surface-lowest font-body text-xs text-outline">
                  No image
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={coverUploading}
                  onClick={() => coverInputRef.current?.click()}
                  className="glass rounded-lg px-4 py-2 font-body text-xs text-on-surface-variant hover:text-on-surface disabled:opacity-60"
                >
                  {coverUploading ? "Uploading…" : draft.cover_image ? "Replace image" : "Upload image"}
                </button>
                {draft.cover_image && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, cover_image: "" })}
                    className="font-body text-xs text-error hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCover(f);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="label-caps !text-xs">
              Content <span className="normal-case text-outline">(use the 🖼 button or drag &amp; drop to add images anywhere)</span>
            </span>
            <RichEditor
              key={draft.id}
              initialHtml={draft.content}
              onChange={(html) => setDraft((d) => (d ? { ...d, content: html } : d))}
            />
          </div>
          <label className="flex items-center gap-3 font-body text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              className="h-4 w-4 accent-[#4d8eff]"
            />
            Published
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
              {busy ? "Saving…" : "Save post"}
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

      <div className="glass overflow-x-auto rounded-xl">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="label-caps !text-xs px-6 py-4">Cover</th>
              <th className="label-caps !text-xs px-6 py-4">Title</th>
              <th className="label-caps !text-xs px-6 py-4">Status</th>
              <th className="label-caps !text-xs px-6 py-4">Created</th>
              <th className="label-caps !text-xs px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-6 py-4">
                  {p.cover_image ? (
                    <div className="ghost-border relative h-12 w-20 overflow-hidden rounded-md bg-surface-lowest">
                      <Image src={p.cover_image} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="ghost-border flex h-12 w-20 items-center justify-center rounded-md bg-surface-lowest font-body text-[10px] text-outline">
                      None
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-body text-sm font-medium text-on-surface">
                  {p.published ? (
                    <a href={`/blog/${p.slug}`} target="_blank" className="hover:text-primary">
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </td>
                <td className="px-6 py-4 font-body text-sm">
                  {p.published ? (
                    <span className="text-emerald-glow">Published</span>
                  ) : (
                    <span className="text-outline">Draft</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-body text-sm text-on-surface-variant">
                  {new Date(p.created_at + "Z").toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-body text-sm">
                  <button
                    onClick={() =>
                      setDraft({
                        id: p.id,
                        title: p.title,
                        excerpt: p.excerpt,
                        content: p.content,
                        cover_image: p.cover_image ?? "",
                        published: p.published === 1,
                      })
                    }
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id, p.title)}
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
