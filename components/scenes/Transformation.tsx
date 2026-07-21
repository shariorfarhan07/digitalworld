"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    index: "01",
    title: "Where brands stall",
    copy: "A dated website. Scattered content. Marketing that shouts but never converts. Most businesses don’t have a quality problem — they have a coherence problem.",
  },
  {
    index: "02",
    title: "What changes",
    copy: "One roadmap. Identity, website, content and marketing designed as a single system, each part reinforcing the next instead of competing for budget.",
  },
  {
    index: "03",
    title: "What it becomes",
    copy: "A brand that looks the part, ranks where it matters, converts visitors into clients — and keeps compounding after launch.",
  },
];

/** Pinned documentary chapters: a browser window assembles itself as you scroll. */
export default function Transformation() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const texts = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const states = gsap.utils.toArray<HTMLElement>("[data-state]");

      // chapters 2–3 ship hidden via the opacity-0 class; reduced-motion users
      // simply keep chapter one, unpinned
      if (reduced) return;

      gsap.set(texts.slice(1), { opacity: 0, y: 24 });
      gsap.set(states.slice(1), { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.8,
        },
      });

      for (let i = 1; i < chapters.length; i++) {
        tl.to(texts[i - 1], { opacity: 0, y: -24, duration: 0.35 }, i)
          .to(states[i - 1], { opacity: 0, duration: 0.45 }, i)
          .to(texts[i], { opacity: 1, y: 0, duration: 0.4 }, i + 0.15)
          .to(states[i], { opacity: 1, duration: 0.5 }, i + 0.15);
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" className="relative">
      <div ref={wrap} className="relative flex min-h-screen items-center overflow-hidden">
        <div className="ambient-glow left-1/3 top-1/4 h-[500px] w-[500px] bg-primary-container/10" />

        <div className="mx-auto grid w-full max-w-container grid-cols-1 items-center gap-14 px-5 py-24 md:px-16 lg:grid-cols-2">
          {/* chapter text */}
          <div className="relative min-h-[280px]">
            <span className="label-caps mb-8 block">The transformation</span>
            {chapters.map((c, i) => (
              <div
                key={i}
                data-chapter
                className={i === 0 ? "relative" : "absolute inset-x-0 top-12 opacity-0"}
              >
                <span className="font-body text-sm text-primary">{c.index}</span>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-headline text-on-surface md:text-5xl">
                  {c.title}
                </h2>
                <p className="mt-5 max-w-md font-body text-lg leading-relaxed text-on-surface-variant">
                  {c.copy}
                </p>
              </div>
            ))}
          </div>

          {/* assembling browser window */}
          <div className="glass relative aspect-[4/3] rounded-xl p-4 md:aspect-[16/11]">
            <div className="mb-3 flex items-center gap-1.5 px-1">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
            </div>

            <div className="relative h-[calc(100%-2.25rem)] overflow-hidden rounded-lg bg-surface-lowest">
              {/* state 1 — scattered */}
              <div data-state className="absolute inset-0 p-5 opacity-60">
                <div className="h-4 w-2/5 -rotate-1 rounded bg-white/10" />
                <div className="mt-6 h-16 w-3/5 rotate-1 rounded bg-white/[0.06]" />
                <div className="mt-4 h-3 w-1/2 -rotate-2 rounded bg-white/[0.08]" />
                <div className="mt-8 flex gap-3">
                  <div className="h-14 w-1/4 rotate-2 rounded bg-white/[0.05]" />
                  <div className="h-10 w-1/3 -rotate-1 rounded bg-white/[0.07]" />
                </div>
              </div>

              {/* state 2 — structured */}
              <div data-state className="absolute inset-0 p-5 opacity-0">
                <div className="h-4 w-1/3 rounded bg-white/15" />
                <div className="mt-5 h-20 w-full rounded bg-white/[0.07]" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="h-14 rounded bg-white/[0.06]" />
                  <div className="h-14 rounded bg-white/[0.06]" />
                  <div className="h-14 rounded bg-white/[0.06]" />
                </div>
                <div className="mt-4 h-3 w-2/3 rounded bg-white/10" />
              </div>

              {/* state 3 — polished */}
              <div data-state className="absolute inset-0 p-5 opacity-0">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-primary/50" />
                  <div className="h-7 w-24 rounded-md bg-electric-gradient" />
                </div>
                <div className="mt-5 h-6 w-4/5 rounded bg-white/20" />
                <div className="mt-2 h-6 w-3/5 rounded bg-white/20" />
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="glass h-16 rounded-md" />
                  <div className="glass h-16 rounded-md" />
                  <div className="glass h-16 rounded-md" />
                </div>
                <div className="mt-5 h-9 w-36 rounded-md bg-electric-gradient shadow-glow-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
