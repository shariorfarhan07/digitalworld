"use client";

import { motion } from "framer-motion";
import AmbientVideo from "@/components/ui/AmbientVideo";
import MagneticButton from "@/components/ui/MagneticButton";
import StatCounter from "@/components/ui/StatCounter";
import GlassCard from "@/components/ui/GlassCard";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { easeOut } from "@/lib/motion";

const headline = ["Balancing", "ability", "and", "aesthetics", "to", "reflect", "your", "brand’s", "excellence."];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 md:pt-40">
      {/* deep-space shader ambience — reacts to the cursor, charcoal base with electric-blue/indigo glow */}
      <div className="absolute inset-0 -z-10">
        <ShaderBackground />
      </div>

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        {/* headline row — same composition as the reference: bold left, supporting right */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <h1 className="font-display text-[40px] font-extrabold leading-[1.15] tracking-headline text-on-surface md:text-7xl md:leading-[1.08] md:tracking-display lg:col-span-7">
            {headline.map((word, i) => (
              <span key={i}>
                <motion.span
                  className={
                    word === "aesthetics"
                      ? "text-gradient inline-block"
                      : "inline-block"
                  }
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: easeOut, delay: 0.15 + i * 0.07 }}
                >
                  {word}
                </motion.span>{" "}
              </span>
            ))}
          </h1>

          <motion.div
            className="flex flex-col justify-center gap-6 lg:col-span-4 lg:col-start-9"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.7 }}
          >
            <span className="label-caps">Digital Growth Studio</span>
            <p className="font-body text-lg leading-relaxed text-on-surface-variant">
              Brand identity, website design and build, content creation and
              digital marketing — handled through one clear growth roadmap,
              built to turn clicks into clients and brands into market leaders.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton href="#mockup">
                Register a Project
                <span aria-hidden="true">→</span>
              </MagneticButton>
              <MagneticButton href="#story" variant="glass">
                See Our Approach
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* media cards row — cinematic film + glass orb, pricing card overlapping */}
        <motion.div
          className="relative mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.9 }}
        >
          <div className="ghost-border relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[16/10]">
            <AmbientVideo src="/media/hero-loop.mp4" poster="/media/hero-poster.jpg" />
          </div>

          <div className="ghost-border relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-lowest md:aspect-[16/10]">
            <AmbientVideo src="/media/orb.mp4" poster="/media/orb.jpg" />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(16,19,26,0.9)]" />
          </div>

          {/* overlapping offer card, as in the reference */}
          <motion.div
            className="relative z-10 -mt-4 w-fit md:absolute md:-bottom-10 md:left-8 md:mt-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 1.4 }}
          >
            <GlassCard glow="primary" className="overflow-hidden bg-white/[0.07]">
              <div className="bg-electric-gradient px-6 py-2.5 text-center font-body text-sm font-medium text-white">
                82% off for early clients
              </div>
              <div className="flex flex-col items-center gap-1 px-8 py-5 text-center">
                <span className="font-body text-sm text-on-surface-variant">
                  Our growth package starts at
                </span>
                <span className="font-body text-base text-outline line-through">
                  $5,400
                </span>
                <span className="font-display text-4xl font-bold text-on-surface">
                  $997
                </span>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* stats strip */}
        <motion.div
          className="ghost-border mt-10 grid grid-cols-2 divide-white/10 rounded-xl bg-surface-low/60 md:mt-24 md:grid-cols-4 md:divide-x"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <StatCounter value={4} suffix="+" label="Years Experience" />
          <StatCounter value={6} suffix="+" label="Projects Delivered" />
          <StatCounter value={5} label="Core Service Pillars" />
          <StatCounter value="Bespoke" label="Growth Solutions" />
        </motion.div>
      </div>
    </section>
  );
}
