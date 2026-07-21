"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import MagneticButton from "./MagneticButton";

const links = [
  { href: "#story", label: "Story" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#founder", label: "Founder" },
  { href: "/blog", label: "Journal" },
];

export default function NavTray() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-5 pt-4 md:px-8"
    >
      <nav
        className={clsx(
          "glass flex w-full max-w-container items-center justify-between rounded-xl px-5 py-3 transition-all duration-500 md:px-7",
          condensed ? "bg-white/[0.08] shadow-glow-primary" : "bg-white/[0.04]"
        )}
        aria-label="Main navigation"
      >
        <a href="#top" className="flex items-center" data-cursor="hover">
          <Image
            src="/brand/logo-primary-light.svg"
            alt="iDigital World"
            width={150}
            height={36}
            priority
            className="h-8 w-auto md:h-9"
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-body text-sm text-on-surface-variant transition-colors duration-300 hover:text-on-surface"
                data-cursor="hover"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <MagneticButton href="#mockup" className="!px-5 !py-2.5 !text-sm">
            Get a Free Mockup
          </MagneticButton>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="relative block h-3 w-5">
            <span
              className={clsx(
                "absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300",
                open && "top-1.5 rotate-45"
              )}
            />
            <span
              className={clsx(
                "absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300",
                open && "bottom-1.5 -rotate-45"
              )}
            />
          </span>
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass absolute inset-x-5 top-[76px] rounded-xl p-6 md:hidden"
        >
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-body text-base text-on-surface"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#mockup"
                className="font-body text-base font-medium text-primary"
                onClick={() => setOpen(false)}
              >
                Get a Free Mockup →
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
