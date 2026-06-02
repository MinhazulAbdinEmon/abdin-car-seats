"use client";

import Reveal from "./Reveal";

/**
 * Feature / work gallery using the real uploaded photos.
 * Displayed at card size (~400–560px) so the source images (679–980px) stay
 * CRISP — the earlier blur came from stretching them full-screen.
 * Edit the `work` array to change images/captions.
 */
const work = [
  { img: "/images/car-seats.jpg", t: "Bespoke Car Seats", k: "Diamond-stitched leather & Alcantara" },
  { img: "/images/sofa.jpg", t: "Furniture Reupholstery", k: "Sofas & lounge, reborn" },
  { img: "/images/bed.jpg", t: "Padded Headboards", k: "Bespoke bedroom pieces" },
  { img: "/images/intro.jpg", t: "Signature Detailing", k: "Showroom-grade finish" },
];

export default function CraftFeatures() {
  return (
    <section id="gallery" className="section relative z-10 bg-ink/40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow text-gold/70">Our Work</p>
          <h2 className="display mx-auto mt-3 max-w-2xl text-4xl sm:text-5xl">
            Crafted, <span className="text-gold-grad">in every detail</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {work.map((w, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08}>
              <article className="group relative overflow-hidden rounded-3xl hairline">
                {/* aspect keeps images downscaled (crisp); object-position centers the subject */}
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={w.img}
                    alt={w.t}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                {/* legibility gradient + hover gold glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_120px_rgba(200,150,79,0.28)] transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="eyebrow text-gold-light/80">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display mt-2 text-2xl text-cream">{w.t}</h3>
                  <p className="mt-1 text-sm text-cream/65">{w.k}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-xs text-cream/40">
            Tip: replace these with 1600px+ photos for full-bleed sharpness.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
