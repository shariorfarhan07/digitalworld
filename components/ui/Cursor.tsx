"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Soft glow dot trailing the pointer. Desktop, fine-pointer, motion-safe only. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 400, damping: 40, mass: 0.6 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setActive(!!t?.closest("[data-cursor='hover'], a, button"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-4 -mt-4 h-8 w-8 rounded-full border border-primary/40"
        animate={{ scale: active ? 1.8 : 1, opacity: active ? 0.9 : 0.5 }}
        transition={{ duration: 0.25 }}
      />
      <div className="absolute left-0 top-0 -ml-0.5 -mt-0.5 h-1 w-1 rounded-full bg-primary" />
    </motion.div>
  );
}
