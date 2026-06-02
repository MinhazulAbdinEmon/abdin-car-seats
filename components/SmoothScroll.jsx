"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wraps the app in Lenis inertia smooth-scrolling.
 * Exposes window.__lenis so other components (e.g. the 3D hero)
 * can read the unified scroll position.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Respect reduced-motion users — skip the smoothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // continuous interpolation → buttery, slightly-weighted glide
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      touchMultiplier: 1.5,
      syncTouch: false,
    });

    window.__lenis = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return children;
}
