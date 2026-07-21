"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/db";
import GlassCard from "@/components/ui/GlassCard";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-primary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, n) => (
        <span key={n} aria-hidden="true" className={n < rating ? "" : "text-outline"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const next = Math.min(Math.max(active + dir, 0), testimonials.length - 1);
      scrollToIndex(next);
    },
    [active, scrollToIndex, testimonials.length]
  );

  // keep the active dot/index in sync with manual scroll (touch/drag/trackpad)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[];
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActive(closest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // gentle autoplay, paused on hover/focus and skipped for reduced motion
  useEffect(() => {
    if (testimonials.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track = trackRef.current;
    if (!track) return;

    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);

    const id = setInterval(() => {
      if (paused) return;
      setActive((current) => {
        const next = (current + 1) % testimonials.length;
        scrollToIndex(next);
        return next;
      });
    }, 6000);

    return () => {
      clearInterval(id);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", resume);
    };
  }, [scrollToIndex, testimonials.length]);

  return (
    <div className="relative mt-16">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc(33.333%-1.1rem)]"
          >
            <GlassCard className="flex h-full flex-col gap-5 p-7">
              <Stars rating={t.rating} />
              <p className="flex-1 font-body text-base leading-relaxed text-on-surface-variant">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-body text-sm font-medium text-on-surface">{t.client_name}</p>
                {t.client_role && <p className="font-body text-xs text-outline">{t.client_role}</p>}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous review"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-on-surface transition-opacity duration-300 hover:border-white/20 disabled:opacity-30"
          >
            ←
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to review ${i + 1} of ${testimonials.length}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? "w-6 bg-electric-gradient" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            disabled={active === testimonials.length - 1}
            aria-label="Next review"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-on-surface transition-opacity duration-300 hover:border-white/20 disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
