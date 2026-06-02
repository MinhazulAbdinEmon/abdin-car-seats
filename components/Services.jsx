"use client";

import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/site";

const services = [
  {
    t: "Leather Seat Upholstery",
    d: "Full re-trims in premium leather & Alcantara with custom quilting and piping.",
    icon: "M4 17c2-4 14-4 16 0M6 17v2h12v-2M7 11h10l1 6H6z",
  },
  {
    t: "Roof Lining",
    d: "Sagging headliners replaced with suede or leather for a flawless ceiling.",
    icon: "M3 7l9-4 9 4M3 7v4h18V7M5 11v6h14v-6",
  },
  {
    t: "Steering Wheel Wrapping",
    d: "Hand-stitched grips in perforated leather for control that feels bespoke.",
    icon: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 5a4 4 0 100 8 4 4 0 000-8zM12 3v5M5 18l3-3M19 18l-3-3",
  },
  {
    t: "Door Panel Customization",
    d: "Matching panels, inserts and ambient accents that tie the cabin together.",
    icon: "M5 4h11l3 3v13H5zM16 4v16M8 12h.01",
  },
  {
    t: "Dashboard Wrapping",
    d: "Leather-wrapped dashes and trims with precise seams and soft-touch finish.",
    icon: "M3 12a9 9 0 0118 0M3 12v4h18v-4M7 12v2M12 12v2M17 12v2",
  },
  {
    t: "Seat Repair & Restoration",
    d: "Bolster repairs, foam rebuilds and colour restoration that turn back time.",
    icon: "M4 17c2-4 14-4 16 0M7 11h10l1 6H6zM9 7l1.5-2h3L15 7",
  },
];

export default function Services() {
  return (
    <section id="services" className="section relative z-10 bg-ink/40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow text-gold/70">Services</p>
            <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">
              One workshop. <span className="text-gold-grad">Every</span> interior detail.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Request a quote
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/8 bg-graphite/60 p-7 transition-all duration-500 hover:border-gold/40 hover:bg-graphite">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-gold-light"
                >
                  <path d={s.icon} />
                </svg>
                <h3 className="display mt-6 text-xl text-cream">{s.t}</h3>
                <p className="mt-3 text-sm text-cream/60">{s.d}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold-light/0 transition-all duration-500 group-hover:text-gold-light">
                  Enquire →
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
