"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Props = {
  value: number | string;
  suffix?: string;
  label: string;
};

export default function StatCounter({ value, suffix = "", label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const numeric = typeof value === "number";
  const [display, setDisplay] = useState(numeric ? 0 : value);

  useEffect(() => {
    if (!inView || !numeric) return;
    const target = value as number;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
        {display}
        {suffix}
      </span>
      <span className="label-caps">{label}</span>
    </div>
  );
}
