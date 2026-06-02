# Abdin Car Seats — Cinematic Luxury Website

A premium, immersive redesign for **Abdin Car Seats (ACS)** — luxury automotive
upholstery & custom interiors. Dark luxury UI, scroll-driven 3D video, mirror-style
reflections, glassmorphism and cinematic motion.

## Tech
- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS** (custom black / graphite / chrome / gold / leather palette)
- **Three.js** — scroll-scrubbed video hero with a glass-distortion shader
- **Framer Motion** — reveals, parallax, horizontal gallery
- **Lenis** — inertia smooth scrolling

## Run it
```bash
npm install
npm run dev
```
Then open http://localhost:3000

Production build:
```bash
npm run build
npm start
```

## ✏️ Make it yours — edit `lib/site.js`
Put in your real details (currently placeholders):
- `whatsapp` — international number, digits only (e.g. `971501234567`)
- `phone`, `email`, `location`, `mapQuery`
- `socials` — Instagram / Facebook / TikTok links

## Replace media
Drop your own files into `public/`:
- `public/video/exploded.mp4` — the hero scroll video (plays forward on scroll-down, reverses on scroll-up)
- `public/images/` — `logo.png`, `car-seats.jpg`, `sofa.jpg`, `bed.jpg`, `intro.jpg`

> The current images came from your provided assets. Swap in more real
> upholstery photos any time — `components/Gallery.jsx` and `components/Craftsmanship.jsx`
> are where they're referenced.

## Sections
1. Cinematic intro splash (logo reveal)
2. Hero — Three.js scroll-driven video + headline
3. Craftsmanship (macro detail + parallax)
4. Before / After transformation slider
5. Services (6 animated cards)
6. Gallery (horizontal cinematic scroll)
7. Testimonials (glassmorphism)
8. Contact (WhatsApp + phone + map) & footer
