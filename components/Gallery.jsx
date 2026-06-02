"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";

const slides = [
  { img: "/images/car-seats.jpg", t: "Bespoke Seats", k: "Diamond quilt · contrast piping" },
  { img: "/images/sofa.jpg", t: "Soft Furnishing", k: "Sofa & lounge upholstery" },
  { img: "/images/bed.jpg", t: "Headboards", k: "Bespoke padded headboards" },
  { img: "/images/intro.jpg", t: "Signature Finish", k: "Showroom-grade detailing" },
  { img: "/images/car-seats.jpg", t: "Full Re-trim", k: "Complete cabin transformation" },
];

export default function Gallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [maxX, setMaxX] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, maxX]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxX(-(track.scrollWidth - window.innerWidth + 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative z-10 h-[320vh] bg-graphite/40">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-8 px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow text-gold/70">Gallery</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              A drive through our <span className="text-gold-grad">work</span>.
            </h2>
          </Reveal>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-6 sm:px-10 will-change-transform">
          {slides.map((s, i) => (
            <article
              key={i}
              className="group relative h-[62vh] w-[78vw] shrink-0 overflow-hidden rounded-3xl sm:w-[52vw] lg:w-[40vw]"
            >
              <img
                src={s.img}
                alt={s.t}
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              {/* hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 shadow-[inset_0_0_120px_rgba(200,150,79,0.35)]" />
              <div className="absolute bottom-7 left-7 right-7">
                <p className="eyebrow text-gold-light/80">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-2 text-2xl text-cream sm:text-3xl">{s.t}</h3>
                <p className="mt-1 text-sm text-cream/60">{s.k}</p>
              </div>
            </article>
          ))}
        </motion.div>

        <p className="mt-8 px-6 text-xs uppercase tracking-[0.3em] text-cream/35 sm:px-10">
          Scroll to explore →
        </p>
      </div>
    </section>
  );
}
