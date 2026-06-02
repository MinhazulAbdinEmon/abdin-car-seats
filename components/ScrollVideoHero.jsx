"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whatsappLink, site } from "@/lib/site";
import HeroCards from "@/components/HeroCards";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven frame animation (kling.ai / Apple-style).
 * Instead of seeking an MP4 (which stutters), we pre-extracted the clip into an
 * image sequence (public/frames). Each scroll position maps to a frame that we
 * swap INSTANTLY into a Three.js texture — buttery smooth, forward on scroll
 * down and reverse on scroll up. A glass-distortion shader keeps the cinematic
 * automotive-mirror feel.
 */
const IMG_ASPECT = 1280 / 720;

export default function ScrollVideoHero() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // mobile → lighter frame set (720p / 12fps, ~1.7MB) + contain-fit
    const mobile = window.innerWidth <= 768;
    const FRAME_COUNT = mobile ? 96 : 192;
    const framePath = mobile
      ? (i) => `/frames-mobile/frame-${String(i + 1).padStart(4, "0")}.jpg`
      : (i) => `/frames/frame-${String(i + 1).padStart(4, "0")}.jpg`;

    // ── preload the frame sequence ──────────────────
    const images = new Array(FRAME_COUNT);
    const loaded = new Array(FRAME_COUNT).fill(false);
    let readyUntil = -1; // highest contiguous loaded index
    let loadedCount = 0;
    let readyFlag = false;

    const advance = () => {
      while (readyUntil + 1 < FRAME_COUNT && loaded[readyUntil + 1]) readyUntil++;
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i);
      img.onload = () => {
        loaded[i] = true;
        loadedCount++;
        advance();
        setPct(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (readyUntil >= 0 && !readyFlag) {
          readyFlag = true;
          setReady(true);
          // recompute ScrollTrigger positions once the media is in
          ScrollTrigger.refresh();
        }
      };
      images[i] = img;
    }

    // ── three.js stage ──────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const texture = new THREE.Texture();
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;

    const uniforms = {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uImageAspect: { value: IMG_ASPECT },
      uScreenAspect: { value: 1 },
      uDistort: { value: mobile ? 0.03 : 0.06 }, // ← curved-glass warp; lower = flatter/cleaner edges
      uFade: { value: 0 },
      uReady: { value: 0 },
      uContain: { value: 0 }, // 1 = fit whole frame (portrait), 0 = cover
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime, uImageAspect, uScreenAspect, uDistort, uFade, uReady, uContain;

        void main(){
          vec2 coverScale = uScreenAspect > uImageAspect
            ? vec2(1.0, uImageAspect / uScreenAspect)
            : vec2(uScreenAspect / uImageAspect, 1.0);
          vec2 containScale = uScreenAspect > uImageAspect
            ? vec2(uScreenAspect / uImageAspect, 1.0)
            : vec2(1.0, uImageAspect / uScreenAspect);
          vec2 scale = mix(coverScale, containScale, uContain);
          vec2 uv = (vUv - 0.5) * scale + 0.5;

          // letterbox transparency when fitting (lets the gradient show)
          float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);

          vec2 c = uv - 0.5;
          float d = dot(c, c);
          uv += c * d * uDistort;

          float ca = (0.0012 + d * 0.0030);
          float r = texture2D(uTexture, uv + c * ca).r;
          float g = texture2D(uTexture, uv).g;
          float b = texture2D(uTexture, uv - c * ca).b;
          vec3 col = vec3(r, g, b);

          col = pow(col, vec3(0.94));
          col *= vec3(1.04, 1.0, 0.94);

          float streak = smoothstep(0.0, 0.5, sin((vUv.x + vUv.y) * 3.1415 + uTime * 0.25)) * 0.03;
          col += streak * vec3(0.9, 0.8, 0.6);

          // ── EDGE VIGNETTE — smooth cinematic falloff (NOT hard bars).
          //    Lower the 2nd number (0.72) to darken edges more / raise to flatten.
          float vig = smoothstep(1.25, 0.5, length(vUv - 0.5));
          col *= mix(0.72, 1.0, vig);

          col *= (1.0 - uFade * 0.85);
          col *= uReady; // fade in once first frame is decoded

          // Only letterbox-transparent when actually fitting (portrait contain);
          // landscape "cover" stays fully opaque → no transparent side bars.
          float a = uContain > 0.01 ? inside : 1.0;
          gl_FragColor = vec4(col, a);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uScreenAspect.value = w / h;
      // FIT MODE: landscape always "cover" (full-bleed width, no side bars);
      // only true portrait uses "contain" (fits width, letterboxes top/bottom).
      // ← raise 0.95 toward 1.1 if you want narrow laptops to fit instead of cover.
      uniforms.uContain.value = w / h < 0.95 ? 1.0 : 0.0;
    };
    resize();
    window.addEventListener("resize", resize);

    // pause rendering whenever the hero is scrolled out of view (saves CPU/GPU)
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(wrap);

    // ── scrub loop ──────────────────────────────────
    let raf;
    let frameLerp = 0;
    let lastIndex = -1;
    let readyMix = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      if (!visible) { raf = requestAnimationFrame(tick); return; }
      uniforms.uTime.value = clock.getElapsedTime();

      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      uniforms.uFade.value = Math.max(0, (p - 0.62) / 0.38);

      const target = p * (FRAME_COUNT - 1);
      // smooth toward the target frame (skip easing for reduced-motion)
      frameLerp += (target - frameLerp) * (reduced ? 1 : 0.2);

      let idx = Math.round(frameLerp);
      if (readyUntil >= 0) idx = Math.min(idx, readyUntil); // never show an unloaded frame
      idx = Math.max(0, Math.min(FRAME_COUNT - 1, idx));

      if (idx !== lastIndex && loaded[idx]) {
        texture.image = images[idx];
        texture.needsUpdate = true;
        lastIndex = idx;
      }

      readyMix += ((readyFlag ? 1 : 0) - readyMix) * 0.08;
      uniforms.uReady.value = readyMix;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      for (const im of images) { if (im) im.onload = null; }
      texture.dispose();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  // ── HERO TEXT: load pop-up from the bottom + scroll-driven motion (GSAP) ──
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth <= 768;
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".hero-reveal", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      // REVEAL DISTANCE — desktop ~80px, mobile ~40px (keep it calm/premium)
      const dist = mobile ? 40 : 80;

      // (1) LOAD entrance — each line pops up from the bottom, staggered,
      //     so the hero is readable immediately (never an empty hero).
      gsap.from(".hero-reveal", {
        y: dist,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12, // ← STAGGER TIMING between elements
        delay: 0.15,
      });

      // (2) SCROLL-DRIVEN — as you scroll the hero, the whole text block
      //     lifts further and fades out, scrubbed to scroll progress.
      gsap.to(textRef.current, {
        y: mobile ? -60 : -110, // upward drift amount
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: {
          trigger: "#top",
          start: "top top", // ← SCROLL START
          end: "+=55%",     // ← SCROLL END (longer = slower fade)
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // (3) HYDROFLOW PRODUCT FEEL — the car subtly scales down & lifts as you
      //     scroll, so it reads as a product showcase (transform-only = smooth).
      gsap.to(canvasRef.current, {
        scale: mobile ? 0.97 : 0.92, // ← CAR SCALE on scroll (smaller = more shrink)
        yPercent: mobile ? -2 : -5,  // ← CAR UPWARD MOVEMENT
        ease: "none",
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "+=70%",
          scrub: 1.2, // smoother lag
          invalidateOnRefresh: true,
        },
      });
    }, wrapRef);

    return () => {
      ctx.revert();
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <section ref={wrapRef} id="top" className="relative h-[200vh] md:h-[230vh]">
      {/* sticky cinematic stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* clean gradient background behind the frame plane */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_15%,#23252b_0%,#121318_45%,#08080a_100%)]" />

        {/* the car visual fills the full width (object-fit: cover via the shader) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full transform-gpu will-change-transform [backface-visibility:hidden]"
        />

        {/* OVERLAYS — readability only. Adjust opacities to taste:
            top/bottom gradient blends nav + scroll area; center scrim sits behind
            the text; the side gradient only *blends* the edges (no hard bars). */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_46%_at_50%_48%,rgba(0,0,0,0.42),transparent_72%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/35 via-transparent to-ink/35" />

        {/* headline — GSAP reveals each `.hero-reveal` from the bottom */}
        <div
          ref={textRef}
          className="absolute inset-0 z-10 flex transform-gpu flex-col items-center justify-center px-6 text-center will-change-transform [text-shadow:0_2px_30px_rgba(0,0,0,0.65)]"
        >
          <p className="hero-reveal eyebrow mb-6 text-gold-light">
            {site.brand} · {site.tagline}
          </p>

          <h1 className="display max-w-5xl text-[12vw] leading-[0.98] sm:text-[8.5vw] lg:text-[6.4rem]">
            <span className="hero-reveal block text-chrome-grad">Luxury Upholstery</span>
            <span className="hero-reveal block text-gold-grad">Redefined</span>
          </h1>

          <p className="hero-reveal mt-7 max-w-xl text-base text-cream/85 sm:text-lg">
            Premium custom interiors crafted for comfort, elegance, and identity.
          </p>

          <div className="hero-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#gallery" className="btn btn-gold">Explore Designs</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Contact on WhatsApp
            </a>
          </div>
        </div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
        >
          <p className="eyebrow text-cream/60">Scroll to reveal</p>
          <div className="mx-auto mt-3 h-10 w-px overflow-hidden bg-white/15">
            <div className="h-4 w-full animate-[floaty_2.4s_ease-in-out_infinite] bg-gold-light" />
          </div>
        </motion.div>

        {/* load progress until the sequence is ready */}
        {!ready && (
          <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2 text-xs text-cream/55">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-gold-light" />
            loading footage… {pct}%
          </div>
        )}

        {/* digitalists-style content cards that rise from the bottom on scroll */}
        <HeroCards />
      </div>
    </section>
  );
}
