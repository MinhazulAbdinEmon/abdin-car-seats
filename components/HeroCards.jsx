"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * digitalists.at-style content cards that rise from the BOTTOM of the pinned
 * hero as you scroll. The hero's sticky stage already provides the pin + the
 * scrubbing/scaling car visual — this layer just adds the staggered UI reveal,
 * scrubbed to scroll progress via GSAP ScrollTrigger (no extra pin).
 *
 * ── EASY TWEAKS ──────────────────────────────────────────────
 *  • CARD TEXT ............ edit the `cards` array below
 *  • WHEN CARDS APPEAR .... the position number (0.45) on the tl.to() = % of
 *                           hero scroll where they start rising
 *  • RISE DISTANCE/SCALE .. the gsap.set y:120 / scale:0.96 (start state)
 *  • STAGGER SPEED ........ `stagger` value
 *  • SCROLL LENGTH ........ controlled by the hero section height (h-[230vh])
 * ─────────────────────────────────────────────────────────────
 */
const cards = [
  { t: "Premium Seat Upholstery", d: "Full leather & Alcantara re-trims." },
  { t: "Custom Stitching", d: "Diamond quilting · contrast piping." },
  { t: "Leather Restoration", d: "Cracked & faded brought back to new." },
];

export default function HeroCards() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(".hc-card");
      if (reduced) {
        gsap.set(els, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap.set(els, { autoAlpha: 0, y: 120, scale: 0.96 }); // ← start state (rise distance/scale)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#top",          // the hero section
          start: "top top",
          end: "bottom bottom",     // full hero scroll → SCROLL LENGTH = hero height
          scrub: 1,                 // smooth scrub
        },
      });
      // cards begin rising at ~45% of the hero scroll, one after another
      tl.to(
        els,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.14, ease: "power2.out" },
        0.45 // ← WHEN CARDS APPEAR (0..1 of hero scroll)
      );
    }, ref);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-4 sm:px-6"
    >
      <div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c, i) => (
          <div key={i} className="hc-card glass pointer-events-auto rounded-2xl p-4 sm:p-5">
            <p className="display text-sm text-cream">{c.t}</p>
            <p className="mt-1 text-xs text-cream/60">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
