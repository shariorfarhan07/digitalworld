"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "glass";
  className?: string;
  type?: "button" | "submit";
};

/** Button that gently leans toward the cursor, per the premium motion language. */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles = clsx(
    "inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-body text-base font-medium transition-shadow duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    variant === "primary" &&
      "bg-electric-gradient text-white shadow-glow-primary hover:shadow-glow-tertiary",
    variant === "glass" &&
      "glass border-white/20 text-on-surface hover:border-white/40",
    className
  );

  const inner = href ? (
    <a href={href} onClick={onClick} className={styles} data-cursor="hover">
      {children}
    </a>
  ) : (
    <button type={type} onClick={onClick} className={styles} data-cursor="hover">
      {children}
    </button>
  );

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="inline-block">
      <motion.div style={{ x: sx, y: sy }}>{inner}</motion.div>
    </div>
  );
}
