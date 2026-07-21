import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";

export default function Methodology() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <Reveal className="text-center">
          <span className="label-caps">Methodology</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
            The Unified Growth System.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant">
            Four phases, planned as one connected system — not four
            disconnected vendors handing off work at the edges.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-4 md:auto-rows-[280px]">
          <Reveal delay={1} className="md:col-span-2">
            <GlassCard glow="primary" className="flex h-full flex-col justify-between p-8">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-4xl text-primary" aria-hidden="true">
                  language
                </span>
                <div className="text-right">
                  <p className="label-caps !text-xs">Phase 01</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-on-surface">
                    Website
                  </h3>
                </div>
              </div>
              <p className="max-w-md font-body text-base leading-relaxed text-on-surface-variant">
                The core of your digital authority — optimised for speed,
                conversion and a cinematic user experience.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={2} className="md:col-span-2">
            <GlassCard glow="secondary" className="flex h-full flex-col justify-between p-8">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-4xl text-secondary" aria-hidden="true">
                  auto_awesome
                </span>
                <div className="text-right">
                  <p className="label-caps !text-xs">Phase 02</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-on-surface">
                    Identity
                  </h3>
                </div>
              </div>
              <p className="max-w-md font-body text-base leading-relaxed text-on-surface-variant">
                A visual language that communicates premium quality before a
                single word is read.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={3} className="md:col-span-1">
            <GlassCard glow="tertiary" className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-tertiary" aria-hidden="true">
                query_stats
              </span>
              <h3 className="font-display text-2xl font-semibold text-on-surface">SEO</h3>
              <p className="font-body text-sm text-on-surface-variant">Sustainable visibility</p>
            </GlassCard>
          </Reveal>

          <Reveal delay={4} className="md:col-span-3">
            <GlassCard className="group relative flex h-full flex-col justify-end overflow-hidden p-8">
              <span
                className="material-symbols-outlined pointer-events-none absolute right-8 top-8 text-6xl text-primary opacity-20 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              >
                hub
              </span>
              <div className="relative">
                <p className="label-caps !text-xs">Phase 03</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-on-surface">
                  The Ecosystem
                </h3>
                <p className="mt-3 max-w-lg font-body text-base leading-relaxed text-on-surface-variant">
                  Everything working together as a single, high-output
                  engine. No silos. No friction. Just growth.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
