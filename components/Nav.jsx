"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { site, whatsappLink } from "@/lib/site";
import WhatsAppGlowButton from "@/components/WhatsAppGlowButton";

const links = [
  { label: "Craft", href: "#craft" },
  { label: "Transformations", href: "#transform" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -10, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
        scrolled ? "py-3 backdrop-blur-xl bg-ink/55 border-b border-white/5" : "py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <button onClick={() => go("#top")} className="flex items-center gap-3">
          <img src="/images/logo.png" alt={site.brand} className="h-10 w-10 object-contain" />
          <span className="hidden sm:block">
            <span className="display block text-sm tracking-wide text-cream">{site.brand}</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-gold/70">
              {site.tagline}
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-sm text-cream/70 transition-colors hover:text-gold-light"
            >
              {l.label}
            </button>
          ))}
        </div>

        <WhatsAppGlowButton className="hidden md:inline-flex" />

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span className={`h-px w-6 bg-cream transition-all ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-cream transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-cream transition-all ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* mobile sheet */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden md:hidden"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-left text-lg text-cream/80"
            >
              {l.label}
            </button>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-2 justify-center">
            Contact on WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
