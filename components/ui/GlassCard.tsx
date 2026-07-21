"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: "primary" | "secondary" | "tertiary" | "none";
};

export default function GlassCard({ children, className, glow = "none" }: Props) {
  return (
    <div
      className={clsx(
        "glass rounded-xl transition-all duration-500",
        glow === "primary" && "hover:shadow-glow-primary",
        glow === "secondary" && "hover:shadow-glow-secondary",
        glow === "tertiary" && "hover:shadow-glow-tertiary",
        glow !== "none" && "hover:border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
}
