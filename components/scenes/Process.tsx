"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AmbientVideo from "@/components/ui/AmbientVideo";
import Reveal from "@/components/ui/Reveal";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Free homepage mockup",
    copy: "You see our work applied to your business before spending a penny. No deck, no pitch — a real design.",
  },
  {
    title: "One clear roadmap",
    copy: "Fixed scope, clear pricing, honest timelines. You know exactly what happens, when, and what it costs.",
  },
  {
    title: "Build & launch",
    copy: "Brand, website and content built as one system, reviewed with you at every stage — you speak to the people doing the work.",
  },
  {
    title: "Grow & compound",
    copy: "Marketing and content that keep earning after launch, measured against outcomes, not activity.",
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const line = el.querySelector<SVGLineElement>("[data-line]");
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="relative overflow-hidden py-32 md:py-48">
      <AmbientVideo src="/media/blueprint.mp4" className="opacity-25" overlay={0.4} />

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <Reveal>
          <span className="label-caps">Transparency, by design</span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
            No surprises. Ever.
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-20 max-w-3xl">
          {/* scroll-drawn spine */}
          <div
            data-line
            className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-primary-container via-secondary-container to-tertiary-container md:left-[19px]"
          />

          <ol className="flex flex-col gap-16">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i} className="relative flex gap-8 md:gap-10">
                  <span className="glass relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-body text-sm font-medium text-primary md:h-10 md:w-10">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-headline text-on-surface">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-lg font-body text-lg leading-relaxed text-on-surface-variant">
                      {s.copy}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
