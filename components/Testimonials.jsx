"use client";

import Reveal from "./Reveal";

const quotes = [
  {
    q: "They rebuilt my Range Rover's interior better than factory. The stitching, the smell, the feel — pure Maybach energy.",
    n: "Khalid R.",
    r: "Range Rover Vogue",
  },
  {
    q: "Brought in a tired 10-year-old cabin and drove out with something that belongs in a showroom. Unreal craftsmanship.",
    n: "Sara M.",
    r: "Mercedes C-Class",
  },
  {
    q: "Custom diamond-stitched seats and a wrapped steering wheel. Every detail was exactly what we discussed.",
    n: "Daniel V.",
    r: "BMW M4",
  },
];

export default function Testimonials() {
  return (
    <section className="section relative z-10 overflow-hidden bg-ink">
      {/* blurred luxury interior backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <img src="/images/car-seats.jpg" alt="" className="h-full w-full object-cover opacity-25 blur-2xl scale-110" />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="eyebrow text-gold/70">Clients</p>
          <h2 className="display mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
            Trusted by drivers who <span className="text-gold-grad">notice the difference</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.1}>
              <figure className="glass h-full rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-2">
                <div className="mb-5 text-gold-light">
                  {"★★★★★".split("").map((s, k) => (
                    <span key={k}>{s}</span>
                  ))}
                </div>
                <blockquote className="text-cream/85">“{c.q}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-grad text-sm font-bold text-ink">
                    {c.n[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-cream">{c.n}</span>
                    <span className="block text-xs text-cream/55">{c.r}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
