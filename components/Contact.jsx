"use client";

import Reveal from "./Reveal";
import { site, whatsappLink } from "@/lib/site";
import { LocationTag } from "@/components/ui/location-tag";

export default function Contact() {
  return (
    <section id="contact" className="section relative z-10 bg-graphite/40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-gold/70">Contact</p>
              <h2 className="display mt-4 text-4xl sm:text-6xl">
                Let’s craft your <span className="text-gold-grad">interior</span>.
              </h2>
              <p className="mt-5 max-w-md text-cream/65">
                Tell us about your vehicle and the look you want. We’ll guide you through materials,
                stitching and finishes — and give you an honest quote.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  Chat on WhatsApp
                </a>
                <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="btn btn-ghost">
                  Call {site.phone}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-12 grid gap-6 sm:grid-cols-2">
                {[
                  ["Phone", site.phone],
                  ["Email", site.email],
                  ["Location", site.location],
                  ["Hours", "Sat–Thu · 9:00 – 20:00"],
                ].map(([k, v]) => (
                  <div key={k} className="border-l border-gold/30 pl-4">
                    <dt className="eyebrow text-cream/45">{k}</dt>
                    <dd className="mt-1 text-cream/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* map */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl hairline shadow-glass">
              <iframe
                title="Abdin Auto Seats Upholstery location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=16&output=embed`}
                className="h-[28rem] w-full grayscale-[0.3] contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* live location tag (shadcn/ui) floating over the map */}
              <div className="absolute left-4 top-4 z-10">
                <LocationTag city="Ajman" country="UAE" timezone="GST" />
              </div>
            </div>
            <a
              href={site.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold-light hover:text-gold-light/80"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Get directions →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
