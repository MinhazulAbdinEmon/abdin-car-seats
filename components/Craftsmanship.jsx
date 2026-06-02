"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";

const cards = [
  {
    t: "Handcrafted Precision",
    d: "Every panel is cut, shaped and stitched by hand — millimetre-accurate seams that hold their line for years.",
  },
  {
    t: "Premium Materials",
    d: "Full-grain leathers, Alcantara and breathable foams selected for touch, durability and a scent of quality.",
  },
  {
    t: "Custom Design",
    d: "Diamond quilting, contrast piping, embroidered logos — your interior, configured to your identity.",
  },
  {
    t: "Durable Luxury Finish",
    d: "UV-stable, wear-resistant finishes engineered to survive daily driving while ageing beautifully.",
  },
];

export default function Craftsmanship() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section id="craft" ref={ref} className="section relative z-10 bg-ink/40">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
        {/* macro image */}
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl hairline">
            <motion.img
              src="/images/car-seats.jpg"
              alt="Macro leather stitching detail"
              style={{ y: imgY, scale: imgScale }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="eyebrow text-gold-light/80">Detail 01</p>
              <p className="display mt-2 text-2xl text-cream">Diamond-stitched leather</p>
            </div>
          </div>
          {/* floating chrome chip */}
          <div className="glass absolute -right-4 -top-4 hidden rounded-2xl px-5 py-4 sm:block animate-floaty">
            <p className="text-3xl font-semibold text-gold-light">15+</p>
            <p className="text-xs text-cream/60">years of craft</p>
          </div>
        </Reveal>

        {/* copy + cards */}
        <div>
          <Reveal>
            <p className="eyebrow text-gold/70">The Craft</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Obsessed with the <span className="text-gold-grad">details</span> you feel.
            </h2>
            <p className="mt-5 max-w-lg text-cream/65">
              Macro-level care, applied at every touchpoint. From the grain of the hide to the tension of a
              single thread, our interiors are built to be experienced — not just seen.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {cards.map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="glass h-full rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1">
                  <div className="mb-4 h-9 w-9 rounded-full bg-gold-grad text-center text-sm font-bold leading-9 text-ink">
                    {i + 1}
                  </div>
                  <h3 className="display text-lg text-cream">{c.t}</h3>
                  <p className="mt-2 text-sm text-cream/60">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
