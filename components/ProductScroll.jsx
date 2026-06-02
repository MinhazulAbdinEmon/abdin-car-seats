"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whatsappLink } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hydroflow-style pinned product scroll section.
 * The car visual stays centered & prominent while the section is pinned; as you
 * scroll it subtly scales / lifts / rotates, and minimal glass UI panels reveal
 * one-by-one. Scrubbed to scroll progress (not plain fade-ins).
 *
 * ── EASY TWEAKS ───────────────────────────────────────────────
 *  • SCROLL LENGTH ............ change END below ("+=200%" = 2 screens of scroll)
 *  • VISUAL MOVEMENT/SCALE .... see the ".ps-visual" tween (scale / yPercent / rotation)
 *  • UI REVEAL TIMING ......... the position numbers (0..1) at the end of each tween
 *  • TEXT CONTENT ............. edit the JSX panels further down
 *  • MOBILE BEHAVIOR .......... panels reposition via the md: classes; reduced-motion
 *                               and very small screens skip the pin entirely
 * ──────────────────────────────────────────────────────────────
 */
const END = "+=200%"; // ← total pinned scroll distance

export default function ProductScroll() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep GSAP ScrollTrigger in sync with Lenis smooth scroll (if present)
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      // Reduced-motion: just show everything, no pin/scrub
      if (reduced) {
        gsap.set(".ps-label, .ps-panel, .ps-cta", { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      // start hidden
      gsap.set(".ps-label", { autoAlpha: 0, y: 24 });
      gsap.set(".ps-panel", { autoAlpha: 0, y: 60, scale: 0.96 });
      gsap.set(".ps-cta", { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: END,          // ← SCROLL LENGTH
          scrub: 1,          // ← smooth scrub (higher = laggier/softer)
          pin: true,
          anticipatePin: 1,
        },
      });

      // MAIN VISUAL: subtle scale-down + lift + tiny rotate across the whole scroll
      tl.to(".ps-visual", { scale: 0.82, yPercent: -6, rotation: -1.5, duration: 1 }, 0);

      // UI REVEALS (numbers = scroll progress 0..1)
      tl.to(".ps-label", { autoAlpha: 1, y: 0, duration: 0.12 }, 0.12); // ~12%
      tl.to(
        ".ps-panel",
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, stagger: 0.16 }, // staggered panels
        0.4 // ~40% → first panel, then ~56%, ~72%
      );
      tl.to(".ps-cta", { autoAlpha: 1, y: 0, duration: 0.14 }, 0.85); // ~85%
    }, root);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert(); // kills timeline + ScrollTrigger + restores styles
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <section ref={root} id="showcase" className="relative z-10 bg-ink">
      <div className="relative h-screen w-full overflow-hidden">
        {/* eyebrow + headline (top) */}
        <div className="absolute left-1/2 top-[10%] z-20 -translate-x-1/2 px-4 text-center">
          <div className="ps-label">
            <p className="eyebrow text-gold/70">In Motion</p>
            <h2 className="display mt-3 text-3xl text-cream sm:text-5xl">
              Engineered for <span className="text-gold-grad">luxury</span>
            </h2>
          </div>
        </div>

        {/* MAIN VISUAL (centered) — muted autoplay loop video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            className="ps-visual w-[90%] max-w-3xl rounded-[2rem] border border-white/5 object-contain shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
            src="/video/exploded.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>

        {/* ── UI PANELS (edit text here) ───────────────────────────
            Each panel: a positioning wrapper (CSS transform for centering)
            + an inner ".ps-panel" that GSAP animates (so transforms don't clash). */}

        {/* Panel 1 — desktop: left-center · mobile: lower-bottom */}
        <div className="absolute bottom-[20%] left-1/2 z-20 w-[86%] max-w-xs -translate-x-1/2 md:bottom-auto md:left-6 md:top-1/2 md:w-64 md:-translate-x-0 md:-translate-y-1/2">
          <div className="ps-panel glass rounded-2xl p-5">
            <p className="display text-base text-cream">Premium Seat Upholstery</p>
            <p className="mt-1 text-xs text-cream/60">Full leather &amp; Alcantara re-trims.</p>
          </div>
        </div>

        {/* Panel 2 — desktop: right-center · mobile: bottom */}
        <div className="absolute bottom-[6%] left-1/2 z-20 w-[86%] max-w-xs -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:w-64 md:-translate-x-0 md:-translate-y-1/2">
          <div className="ps-panel glass rounded-2xl p-5">
            <p className="display text-base text-cream">Custom Stitching</p>
            <p className="mt-1 text-xs text-cream/60">Diamond quilting · contrast piping.</p>
          </div>
        </div>

        {/* Panel 3 — desktop: upper-left · hidden on small screens to stay clean */}
        <div className="absolute left-8 top-[26%] z-20 hidden w-60 lg:block">
          <div className="ps-panel glass rounded-2xl p-5">
            <p className="display text-base text-cream">Leather Restoration</p>
            <p className="mt-1 text-xs text-cream/60">Cracked &amp; faded brought back to new.</p>
          </div>
        </div>

        {/* CTA (bottom-center on desktop, top on mobile) */}
        <div className="absolute left-1/2 top-[22%] z-20 -translate-x-1/2 md:top-auto md:bottom-[7%]">
          <div className="ps-cta">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Start your interior
            </a>
          </div>
        </div>

        {/* soft top/bottom fades so the pinned section blends with neighbours */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>
    </section>
  );
}
