"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const statement =
  "Most agencies sell services. We build momentum — one honest, measurable step at a time.";

/** A single editorial statement, revealed word by word as you scroll through it. */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative px-5 py-40 md:px-16 md:py-64" aria-label="Studio manifesto">
      <div ref={ref} className="mx-auto max-w-4xl">
        <p className="font-display text-3xl font-semibold leading-[1.35] tracking-headline text-on-surface md:text-5xl">
          {statement.split(" ").map((w, i) => (
            <span key={i}>
              <span data-word className="inline-block">
                {w}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
