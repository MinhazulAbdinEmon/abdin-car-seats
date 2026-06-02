"use client";

import { whatsappLink } from "@/lib/site";

/**
 * WhatsApp CTA with an animated glowing conic-gradient border — same technique
 * as the Aceternity glowing search bar, retuned to WhatsApp green + brand gold.
 */
export default function WhatsAppGlowButton({ label = "WhatsApp", className = "" }) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className={`group relative inline-flex items-center justify-center rounded-full p-[1.6px] ${className}`}
    >
      {/* rotating glow ring (clipped to the pill) */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute left-1/2 top-1/2 h-[320%] w-[320%] animate-ring-spin bg-[conic-gradient(from_0deg,transparent_0%,#25D366_14%,transparent_30%,transparent_55%,#e8c785_70%,transparent_86%)] opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      </span>

      {/* soft outer glow on hover */}
      <span className="pointer-events-none absolute -inset-1 rounded-full bg-[#25D366]/25 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

      {/* inner button face */}
      <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.85rem] font-semibold text-cream transition-colors duration-300 group-hover:bg-[#0c1410]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.943-5.359 11.946-11.945a11.86 11.86 0 00-3.421-8.4z" />
        </svg>
        {label}
      </span>
    </a>
  );
}
