import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";

const promises = [
  {
    title: "No invented proof",
    copy: "You’ll find no fabricated testimonials, inflated metrics or borrowed logos here. What we show is what we’ve done.",
  },
  {
    title: "Proof before payment",
    copy: "The free homepage mockup exists so you can judge the craft on your own business — before any commitment.",
  },
  {
    title: "Honest pricing",
    copy: "One growth package, one clear price: $997 to start, down from $5,400 for early clients. What it includes is agreed in writing.",
  },
];

export default function Authority() {
  return (
    <section className="relative py-32 md:py-44">
      <div className="mx-auto max-w-container px-5 md:px-16">
        <Reveal>
          <span className="label-caps">Why trust us</span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
            Trust is built, not claimed.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal key={p.title} delay={i}>
              <GlassCard glow="secondary" className="h-full p-8">
                <span
                  className="mb-5 block h-1.5 w-10 rounded-full bg-emerald-glow/70 shadow-[0_0_16px_rgba(110,231,183,0.4)]"
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl font-semibold tracking-headline text-on-surface">
                  {p.title}
                </h3>
                <p className="mt-3 font-body text-base leading-relaxed text-on-surface-variant">
                  {p.copy}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
