"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// muted + playsInline are required for autoplay on phones.
// With reduced motion, the video stays on its first frame.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
    } else {
      // Autoplay can still be blocked (battery saver): the first frame stays
      video.play().catch(() => {});
    }
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      src="/videos/hero.mp4"
      muted
      loop
      playsInline
      preload="auto"
      aria-label="A tin of XAY red tea"
      className="absolute inset-0 size-full object-cover"
    />
  );
}
