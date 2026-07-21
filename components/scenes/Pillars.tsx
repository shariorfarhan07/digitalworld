"use client";

import AmbientVideo from "@/components/ui/AmbientVideo";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

const pillars = [
  {
    title: "Brand Identity",
    copy: "A visual language your market remembers — logo, palette, voice and the discipline to use them consistently.",
  },
  {
    title: "Website Design & Build",
    copy: "Fast, premium, conversion-focused sites engineered to look the part and earn trust in the first second.",
  },
  {
    title: "Content Creation",
    copy: "Content that answers real questions from real buyers, written to rank and to convert — not to fill a calendar.",
  },
  {
    title: "Digital Marketing",
    copy: "Channels chosen for return, not fashion. Every pound is traceable to pipeline.",
  },
  {
    title: "One Growth Roadmap",
    copy: "The pillar that holds the rest: a single, honest plan connecting brand, site, content and marketing to business outcomes.",
  },
];

export default function Pillars() {
  return (
    <section id="services" className="relative overflow-hidden py-32 md:py-48">
      <AmbientVideo src="/media/glass-panels.mp4" className="opacity-35" overlay={0.55} />

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <Reveal>
          <span className="label-caps">What supports the story</span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
            Five pillars. One system.
          </h2>
          <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant">
            We don’t sell services à la carte. Each pillar exists to serve the
            roadmap — remove one and the system weakens.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i}>
              <GlassCard
                glow="primary"
                className="group h-full p-8"
              >
                <span className="font-body text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-headline text-on-surface">
                  {p.title}
                </h3>
                <p className="mt-4 font-body text-base leading-relaxed text-on-surface-variant">
                  {p.copy}
                </p>
              </GlassCard>
            </Reveal>
          ))}

          <Reveal delay={5}>
            <a
              href="#mockup"
              data-cursor="hover"
              className="glass flex h-full min-h-[220px] flex-col items-start justify-between rounded-xl border-primary/30 p-8 transition-all duration-500 hover:border-primary/60 hover:shadow-glow-primary"
            >
              <span className="label-caps text-primary">Start here</span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-headline text-on-surface">
                  See it before you spend
                </h3>
                <p className="mt-3 font-body text-base text-on-surface-variant">
                  Get a free homepage mockup for your business →
                </p>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
