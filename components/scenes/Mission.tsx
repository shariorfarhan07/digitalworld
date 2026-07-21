import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";

export default function Mission() {
  return (
    <section id="craft" className="relative overflow-hidden py-32 md:py-48">
      <div className="ambient-glow -right-40 top-10 h-[460px] w-[460px] bg-tertiary-container/10" />

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-1 -top-10 select-none whitespace-nowrap font-display text-[18vw] font-extrabold uppercase leading-none text-white/[0.04] md:-top-16"
          >
            Craftsmanship
          </span>
          <Reveal className="relative">
            <span className="label-caps">How we work</span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-headline text-on-surface md:text-6xl">
              The <span className="text-gradient italic">Mission</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <Reveal delay={1} className="lg:col-span-7">
            <p className="max-w-xl font-body text-lg leading-relaxed text-on-surface-variant">
              We&rsquo;re building against the template factory, not with it.
              iDigital World stays deliberately small so that every
              architectural and design decision can pass through the founder
              before it reaches you — not a junior handed the account, not
              outsourced execution, not a queue.
            </p>
            <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant">
              That&rsquo;s slower to scale and it&rsquo;s the point. Fewer
              clients, deeper work, and a studio that treats your project like
              it has to last.
            </p>
          </Reveal>

          <Reveal delay={2} className="lg:col-span-5">
            <GlassCard className="p-8 md:p-10">
              <span className="label-caps text-primary">The commitment</span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-on-surface">
                Every decision, reviewed personally.
              </h3>
              <p className="mt-4 font-body text-base leading-relaxed text-on-surface-variant">
                In an industry built on hand-offs, we kept the one thing that
                actually protects quality: a single person accountable for
                the outcome, start to finish.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="ghost-border rounded-xl p-5">
                  <p className="font-display text-lg font-semibold text-on-surface">
                    Founder-reviewed
                  </p>
                  <p className="mt-1 font-body text-xs text-outline">Every project, every decision</p>
                </div>
                <div className="ghost-border rounded-xl p-5">
                  <p className="font-display text-lg font-semibold text-on-surface">
                    One contact
                  </p>
                  <p className="mt-1 font-body text-xs text-outline">Mockup through to launch</p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
