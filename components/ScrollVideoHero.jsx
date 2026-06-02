"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { whatsappLink } from "@/lib/site";

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
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.55], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.55], [0, -90]);
  const textScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.1]);
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
      uDistort: { value: mobile ? 0.04 : 0.1 },
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

          float vig = smoothstep(1.2, 0.4, length(vUv - 0.5));
          col *= mix(0.62, 1.0, vig);

          col *= (1.0 - uFade * 0.85);
          col *= uReady; // fade in once first frame is decoded

          gl_FragColor = vec4(col, inside);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uScreenAspect.value = w / h;
      // blend toward "contain" on portrait so the whole car stays visible
      // (1 = full letterbox fit, 0 = fill/crop); 0.8 keeps it large but intact
      uniforms.uContain.value = w / h < 1.15 ? 0.8 : 0;
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

  return (
    <section ref={wrapRef} id="top" className="relative h-[180vh]">
      {/* sticky cinematic stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* clean gradient background behind the frame plane */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_15%,#23252b_0%,#121318_45%,#08080a_100%)]" />

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_46%,rgba(0,0,0,0.55),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-white/5 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]" />

        {/* headline */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center [text-shadow:0_2px_30px_rgba(0,0,0,0.65)]"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="eyebrow mb-6 text-gold-light"
          >
            Abdin Car Seats · Upholstery &amp; Covers
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="display max-w-5xl text-[12vw] leading-[0.92] sm:text-[8.5vw] lg:text-[6.4rem]"
          >
            <span className="text-chrome-grad">Luxury Upholstery</span>
            <br />
            <span className="text-gold-grad">Redefined</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-7 max-w-xl text-base text-cream/85 sm:text-lg"
          >
            Premium custom interiors crafted for comfort, elegance, and identity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a href="#gallery" className="btn btn-gold">Explore Designs</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Contact on WhatsApp
            </a>
          </motion.div>
        </motion.div>

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
      </div>
    </section>
  );
}
