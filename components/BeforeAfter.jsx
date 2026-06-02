"use client";

import { useRef, useState, useCallback } from "react";
import Reveal from "./Reveal";

/**
 * Rearview-mirror framed before/after.
 * "Before" is the same hero image rendered tired & desaturated; drag the
 * chrome handle to wipe in the restored luxury "after".
 */
export default function BeforeAfter() {
  const [pos, setPos] = useState(55);
  const ref = useRef(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(98, Math.max(2, p)));
  }, []);

  const onDown = (e) => {
    dragging.current = true;
    setFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  };
  const onUp = () => (dragging.current = false);

  return (
    <section id="transform" className="section relative z-10 bg-graphite/40">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <p className="eyebrow text-gold/70">Transformations</p>
          <h2 className="display mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">
            Through the mirror, a <span className="text-gold-grad">complete rebirth</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/65">
            Worn, cracked and faded interiors restored to showroom — and beyond. Drag to reveal a real
            transformation.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* mirror housing */}
          <div className="mx-auto mt-12 max-w-4xl rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/[0.02] p-3 shadow-glass">
            <div
              ref={ref}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={onDown}
              onTouchMove={onMove}
              onTouchEnd={onUp}
              className="relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-[2rem]"
            >
              {/* AFTER (full colour) */}
              <img
                src="/images/car-seats.jpg"
                alt="After — restored luxury interior"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <span className="absolute right-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-xs tracking-wide text-gold-light backdrop-blur">
                After
              </span>

              {/* BEFORE (clipped via clip-path, desaturated) */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              >
                <img
                  src="/images/car-seats.jpg"
                  alt="Before — worn interior"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "grayscale(0.85) brightness(0.6) contrast(1.1) sepia(0.2)" }}
                  draggable={false}
                />
                <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-xs tracking-wide text-cream/70 backdrop-blur">
                  Before
                </span>
              </div>

              {/* handle */}
              <div
                className="absolute top-0 z-10 h-full w-px bg-gold-light/80"
                style={{ left: `${pos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-grad text-ink shadow-goldglow">
                  <span className="text-xs">◄ ►</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
            {[
              ["Full strip-down", "Every panel removed & assessed"],
              ["Rebuild", "New foam, frames & premium hides"],
              ["Finish", "Detailed, sealed & delivered"],
            ].map(([t, d]) => (
              <div key={t} className="glass rounded-2xl p-5 text-left">
                <p className="display text-sm text-gold-light">{t}</p>
                <p className="mt-1 text-xs text-cream/55">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
