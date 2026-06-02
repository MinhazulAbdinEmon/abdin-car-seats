"use client";

import { site, whatsappLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt={site.brand} className="h-12 w-12 object-contain" />
              <div>
                <p className="display text-lg text-cream">{site.brand}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{site.tagline}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-cream/55">
              Luxury automotive upholstery & custom interiors. Handcrafted comfort, elegance and identity —
              for every drive.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="eyebrow text-cream/40">Explore</p>
              <ul className="mt-4 space-y-3 text-sm text-cream/65">
                <li><a className="hover:text-gold-light" href="#craft">Craft</a></li>
                <li><a className="hover:text-gold-light" href="#transform">Transformations</a></li>
                <li><a className="hover:text-gold-light" href="#services">Services</a></li>
                <li><a className="hover:text-gold-light" href="#gallery">Gallery</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-cream/40">Contact</p>
              <ul className="mt-4 space-y-3 text-sm text-cream/65">
                <li><a className="hover:text-gold-light" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a className="hover:text-gold-light" href={`tel:${site.phone.replace(/\s+/g, "")}`}>{site.phone}</a></li>
                <li><a className="hover:text-gold-light" href={`mailto:${site.email}`}>{site.email}</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-cream/40">Social</p>
              <ul className="mt-4 space-y-3 text-sm text-cream/65">
                <li><a className="hover:text-gold-light" href={site.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a className="hover:text-gold-light" href={site.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a className="hover:text-gold-light" href={site.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/6 pt-7 text-xs text-cream/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.brand}. All rights reserved.</p>
          <p>Crafted with precision · Luxury Upholstery Redefined</p>
        </div>
      </div>
    </footer>
  );
}
