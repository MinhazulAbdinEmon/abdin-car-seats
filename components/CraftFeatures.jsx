"use client";

import { useEffect, useState } from "react";
import { Warp } from "@paper-design/shaders-react";
import { Sparkles, Layers, Ruler, Award, Armchair, ShieldCheck } from "lucide-react";

/**
 * Feature highlights on animated brand-gold shader backgrounds.
 * Replaces the photo gallery (whose source images were too low-res to show large).
 * Edit `features` for content. Shaders pause on mobile / reduced-motion for perf.
 */
const features = [
  {
    title: "Handcrafted Precision",
    description: "Every panel cut, shaped and stitched by hand — millimetre-accurate seams that hold for years.",
    Icon: Sparkles,
    colors: ["hsl(34,55%,14%)", "hsl(40,72%,48%)", "hsl(26,45%,9%)", "hsl(44,78%,58%)"],
  },
  {
    title: "Premium Materials",
    description: "Full-grain leather, Alcantara and breathable foams chosen for touch, durability and quality.",
    Icon: Layers,
    colors: ["hsl(28,40%,12%)", "hsl(36,60%,40%)", "hsl(22,35%,8%)", "hsl(40,70%,52%)"],
  },
  {
    title: "Bespoke Design",
    description: "Diamond quilting, contrast piping, embroidered logos — configured entirely to your identity.",
    Icon: Ruler,
    colors: ["hsl(38,55%,15%)", "hsl(44,75%,50%)", "hsl(30,45%,10%)", "hsl(46,80%,60%)"],
  },
  {
    title: "Showroom Finish",
    description: "UV-stable, wear-resistant finishes detailed, sealed and delivered better than factory.",
    Icon: Award,
    colors: ["hsl(30,45%,12%)", "hsl(38,68%,44%)", "hsl(24,40%,8%)", "hsl(42,74%,55%)"],
  },
  {
    title: "Beyond Cars",
    description: "The same craft applied to sofas, lounge furniture and bespoke padded headboards.",
    Icon: Armchair,
    colors: ["hsl(35,50%,14%)", "hsl(41,70%,46%)", "hsl(28,42%,9%)", "hsl(45,76%,57%)"],
  },
  {
    title: "Trusted Craftsmanship",
    description: "Drivers who notice the difference return — interiors built to be felt, not just seen.",
    Icon: ShieldCheck,
    colors: ["hsl(32,48%,13%)", "hsl(39,66%,42%)", "hsl(25,40%,8%)", "hsl(43,72%,54%)"],
  },
];

export default function CraftFeatures() {
  // 0 = static (mobile / reduced-motion), else animation speed
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth <= 768;
    setSpeed(reduced || mobile ? 0 : 0.5); // ← shader animation speed
  }, []);

  return (
    <section id="gallery" className="section relative z-10 bg-ink/40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="eyebrow text-gold/70">Why Abdin</p>
          <h2 className="display mx-auto mt-3 max-w-2xl text-4xl sm:text-5xl">
            Crafted to a higher <span className="text-gold-grad">standard</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, Icon, colors }, i) => (
            <div key={i} className="relative h-72">
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <Warp
                  style={{ height: "100%", width: "100%" }}
                  proportion={0.4}
                  softness={1.0}
                  distortion={0.16}
                  swirl={0.7}
                  swirlIterations={9}
                  shape="checks"
                  shapeScale={0.1}
                  scale={1}
                  rotation={0}
                  speed={speed}
                  colors={colors}
                />
              </div>

              <div className="relative z-10 flex h-full flex-col rounded-3xl border border-white/10 bg-ink/75 p-8 backdrop-blur-[2px] transition-transform duration-500 hover:-translate-y-1">
                <Icon className="h-10 w-10 text-gold-light drop-shadow" strokeWidth={1.3} />
                <h3 className="display mt-6 text-xl text-cream">{title}</h3>
                <p className="mt-3 flex-grow text-sm text-cream/65">{description}</p>
                <div className="mt-6 flex items-center gap-2 text-sm text-gold-light/80">
                  <span>Crafted detail</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
