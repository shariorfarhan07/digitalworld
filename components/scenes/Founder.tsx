import Reveal from "@/components/ui/Reveal";

export default function Founder() {
  return (
    <section id="founder" className="relative overflow-hidden py-32 md:py-52">
      {/* CSS light rays — quiet, gallery-at-dusk register */}
      <div className="light-rays" aria-hidden="true" />
      <div className="ambient-glow bottom-0 right-0 h-[400px] w-[400px] bg-primary-container/10" />

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <div className="max-w-3xl">
          <Reveal>
            <span className="label-caps">Founder-led, on purpose</span>
          </Reveal>
          <Reveal delay={1}>
            <blockquote className="mt-8 font-display text-3xl font-semibold leading-[1.35] tracking-headline text-on-surface md:text-4xl">
              “When you work with iDigital World, you work with the person
              responsible for the outcome. No account managers. No hand-offs.
              No dilution.”
            </blockquote>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant">
              That’s the reason this studio stays deliberately small: fewer
              clients, deeper work, and a direct line to the founder from your
              first mockup to long after launch.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-10 font-body text-sm text-outline">
              Founder, iDigital World — United Kingdom
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
