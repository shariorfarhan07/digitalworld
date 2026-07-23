"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** extra classes applied to the <video>/<img> element itself, e.g. for masking or blend modes */
  mediaClassName?: string;
  /** dim the video with an overlay, 0–1 */
  overlay?: number;
};

/**
 * Ambient looping background video: lazy, muted, pauses offscreen,
 * falls back to the poster (or nothing) under prefers-reduced-motion.
 */
export default function AmbientVideo({ src, poster, className, mediaClassName, overlay = 0 }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "120px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {reduced && poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className={clsx("h-full w-full object-cover", mediaClassName)} />
      ) : !reduced ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={clsx("h-full w-full object-cover", mediaClassName)}
        />
      ) : null}
      {overlay > 0 && (
        <div
          className="absolute inset-0"
          style={{ background: `rgba(16, 19, 26, ${overlay})` }}
        />
      )}
    </div>
  );
}
