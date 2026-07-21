"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

const inputStyles =
  "w-full rounded-lg border border-white/10 bg-black px-4 py-3.5 font-body text-base text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/60 transition-colors duration-300";

export default function Offer() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          website: f.get("website"),
          about: f.get("about"),
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

  return (
    <section id="mockup" className="relative overflow-hidden py-32 md:py-48">
      <div className="ambient-glow -right-40 top-1/4 h-[520px] w-[520px] bg-tertiary-container/15" />
      {/* orb accent, cropped off-canvas with a soft screen blend */}
      <div
        className="pointer-events-none absolute -right-48 bottom-10 hidden h-[420px] w-[420px] opacity-60 mix-blend-screen lg:block"
        aria-hidden="true"
      >
        <Image
          src="/media/orb.jpg"
          alt=""
          fill
          sizes="420px"
          className="rounded-full object-cover [mask-image:radial-gradient(circle,black_55%,transparent_72%)]"
        />
      </div>

      <div className="relative mx-auto grid max-w-container grid-cols-1 gap-16 px-5 md:px-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="label-caps">Start with proof, not promises</span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
              Get a free homepage mockup.
            </h2>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-on-surface-variant">
              Tell us about your business and we’ll design a homepage concept
              for it — free, no obligation. If you like what you see, our full
              growth package starts at{" "}
              <span className="text-outline line-through">$5,400</span>{" "}
              <span className="font-medium text-on-surface">$997</span> for
              early clients.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <ul className="mt-10 flex flex-col gap-4">
              {[
                "A real design for your business, not a template",
                "Delivered within days, yours to keep",
                "Reviewed with the founder on a short call — only if you want one",
              ].map((li) => (
                <li key={li} className="flex items-start gap-3 font-body text-base text-on-surface-variant">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-glow shadow-[0_0_10px_rgba(110,231,183,0.6)]"
                    aria-hidden="true"
                  />
                  {li}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <div className="glass rounded-2xl p-8 md:p-10">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-glow/15 text-2xl">
                  ✓
                </span>
                <h3 className="font-display text-2xl font-semibold text-on-surface">
                  Request received.
                </h3>
                <p className="max-w-xs font-body text-base text-on-surface-variant">
                  We’ll be in touch shortly to start on your free homepage
                  mockup.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="label-caps !text-xs">
                    Your name
                  </label>
                  <input id="name" name="name" required autoComplete="name" className={inputStyles} placeholder="Jane Smith" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="label-caps !text-xs">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" className={inputStyles} placeholder="jane@company.co.uk" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="website" className="label-caps !text-xs">
                    Current website <span className="normal-case text-outline">(if any)</span>
                  </label>
                  <input id="website" name="website" type="url" className={inputStyles} placeholder="https://" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="about" className="label-caps !text-xs">
                    About your business
                  </label>
                  <textarea id="about" name="about" rows={3} className={inputStyles} placeholder="What do you do, and who for?" />
                </div>
                {error && (
                  <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 font-body text-sm text-[#ffb4ab]">
                    {error}
                  </p>
                )}
                <MagneticButton type="submit" className="mt-2 w-full">
                  {busy ? "Sending…" : "Request my free mockup"}
                  <span aria-hidden="true">→</span>
                </MagneticButton>
                <p className="text-center font-body text-xs text-outline">
                  No obligation. No spam. Your details are only used to build
                  your mockup.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
