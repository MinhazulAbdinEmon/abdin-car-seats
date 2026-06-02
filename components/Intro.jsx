"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * Cinematic luxury intro reveal for the ACS logo.
 * Three.js stage (golden particles, logo plane with a luminance-driven reveal
 * shader, reflective floor, bloom) orchestrated by a GSAP timeline:
 * gold catches light first → chrome reveals → blur-to-focus → light streak →
 * camera push-in → camera "through" the logo → seamless fade into the hero.
 */
const logoMask = {
  WebkitMaskImage: "url(/images/logo.png)",
  maskImage: "url(/images/logo.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

export default function Intro() {
  const [show, setShow] = useState(true);
  const canvasRef = useRef(null);
  // mobile / reduced-motion → lightweight CSS reveal instead of WebGL+bloom
  const [light] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.innerWidth <= 768)
  );

  // lock scroll while the intro plays
  useEffect(() => {
    document.documentElement.style.overflow = show ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [show]);

  useEffect(() => {
    // lightweight path: no WebGL, just a timed CSS reveal
    if (light) {
      const t = setTimeout(() => setShow(false), 2000); // shorter on mobile
      return () => clearTimeout(t);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf;
    let disposed = false;
    const cleanupFns = [];

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

    // shared animated state, tweened by GSAP, applied to uniforms each frame
    const state = { reveal: 0, focus: 1, sweep: -0.4, opacity: 0, camZ: 7, glow: 0 };

    // ── particles ──────────────────────────────────
    const isMobile = window.innerWidth <= 768;
    const COUNT = isMobile ? 80 : 220;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 7;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc8964f,
      size: isMobile ? 0.03 : 0.025,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── logo material factory ──────────────────────
    const makeMaterial = (texture, reflect) =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTex: { value: texture },
          uReveal: { value: 0 },
          uFocus: { value: 1 },
          uSweep: { value: -0.4 },
          uOpacity: { value: 0 },
          uTime: { value: 0 },
          uReflect: { value: reflect ? 1 : 0 },
          uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 1024) },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D uTex;
          uniform float uReveal,uFocus,uSweep,uOpacity,uTime,uReflect;
          uniform vec2 uTexel;
          vec4 samp(vec2 uv){ return texture2D(uTex, uv); }
          void main(){
            vec2 uv = vUv;
            if(uReflect > 0.5) uv.y = 1.0 - uv.y;

            vec4 c = samp(uv);
            if(uFocus > 0.001){
              float r = uFocus * 3.0;
              vec4 b = vec4(0.0);
              b += samp(uv + uTexel*vec2( r,0.0));
              b += samp(uv + uTexel*vec2(-r,0.0));
              b += samp(uv + uTexel*vec2(0.0, r));
              b += samp(uv + uTexel*vec2(0.0,-r));
              b += samp(uv + uTexel*vec2( r, r));
              b += samp(uv + uTexel*vec2(-r,-r));
              b += samp(uv + uTexel*vec2( r,-r));
              b += samp(uv + uTexel*vec2(-r, r));
              b /= 8.0;
              c = mix(c, b, clamp(uFocus,0.0,1.0));
            }

            // trim any residual white halo, respect existing alpha
            float white = smoothstep(0.90, 0.99, min(c.r, min(c.g, c.b)));
            float a = c.a * (1.0 - white);

            float lum = dot(c.rgb, vec3(0.299,0.587,0.114));
            float chroma = clamp(length(c.rgb - vec3(lum)) * 2.0, 0.0, 1.0);
            float priority = max(lum, chroma * 0.85); // bright/coloured accents reveal first

            float field = uReveal * 1.6 - (1.0 - priority);
            float appear = smoothstep(0.0, 0.18, field);

            vec3 col = c.rgb;
            // light streak sweeping across the letters (cool platinum sheen)
            float streak = smoothstep(0.07, 0.0, abs(vUv.x - uSweep));
            col += streak * (0.35 + priority) * vec3(0.82, 0.92, 1.0);
            // tiny reflection ripple over the curves
            float ripple = sin((vUv.x + vUv.y) * 18.0 - uTime * 2.0) * 0.5 + 0.5;
            col += ripple * streak * 0.15 * vec3(0.8, 0.9, 1.0);
            col *= 1.0 + chroma * 0.25;

            float alpha = appear * a * uOpacity;
            if(uReflect > 0.5){
              alpha *= smoothstep(0.0, 0.8, vUv.y) * 0.26;
              col *= 0.85;
            }
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });

    const group = new THREE.Group();
    scene.add(group);
    let logoMat, reflMat;

    const loader = new THREE.TextureLoader();
    loader.load("/images/logo.png", (texture) => {
      if (disposed) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const iw = texture.image?.width || 1024;
      const ih = texture.image?.height || 1024;
      const aspect = iw / ih;
      const h = 1.7;
      const w = h * aspect;

      logoMat = makeMaterial(texture, false);
      reflMat = makeMaterial(texture, true);
      logoMat.uniforms.uTexel.value.set(1 / iw, 1 / ih);
      reflMat.uniforms.uTexel.value.set(1 / iw, 1 / ih);

      const geo = new THREE.PlaneGeometry(w, h);
      const logo = new THREE.Mesh(geo, logoMat);
      const refl = new THREE.Mesh(geo, reflMat);
      refl.position.y = -h - 0.06;
      group.add(logo);
      group.add(refl);
    });

    // ── post-processing (bloom) ────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.85, 0.7, 0.0);
    composer.addPass(bloom);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);
    cleanupFns.push(() => window.removeEventListener("resize", resize));

    // ── mouse parallax ─────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    cleanupFns.push(() => window.removeEventListener("mousemove", onMove));

    // ── render loop ────────────────────────────────
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      pMat.opacity = state.opacity * 0.9;
      particles.rotation.y = t * 0.03;
      particles.rotation.x = Math.sin(t * 0.1) * 0.05;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      group.rotation.y = mouse.x * 0.12 + Math.sin(t * 0.5) * 0.015;
      group.rotation.x = -mouse.y * 0.08;
      group.position.y = Math.sin(t * 0.6) * 0.03;

      const apply = (m) => {
        if (!m) return;
        m.uniforms.uReveal.value = state.reveal;
        m.uniforms.uFocus.value = state.focus;
        m.uniforms.uSweep.value = state.sweep;
        m.uniforms.uOpacity.value = state.opacity;
        m.uniforms.uTime.value = t;
      };
      apply(logoMat);
      apply(reflMat);

      bloom.strength = 0.7 + state.glow * 0.5;
      camera.position.z = state.camZ;
      camera.lookAt(0, 0, 0);

      composer.render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ── GSAP cinematic timeline ────────────────────
    // Tightened to ~3.5s total. Scale every duration/position up to slow it down.
    const tl = gsap.timeline({ onComplete: () => setShow(false) });
    tl.to(state, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.1)
      .to(state, { reveal: 0.55, duration: 1.0, ease: "power2.inOut" }, 0.5) // gold catches light
      .to(state, { camZ: 3.4, duration: 2.0, ease: "power2.inOut" }, 0.5) // push-in
      .to(state, { reveal: 1.0, focus: 0.0, duration: 1.0, ease: "power2.inOut" }, 1.3) // chrome + focus
      .to(state, { sweep: 0.4, duration: 0.9, ease: "power1.inOut" }, 1.5) // light streak
      .to(state, { glow: 1, duration: 0.6, ease: "power2.out" }, 1.9)
      .to(state, { duration: 0.3 }) // short hold
      .to(state, { camZ: 0.4, duration: 0.8, ease: "power2.in" }, ">") // camera "through" the logo
      .to(state, { opacity: 0, duration: 0.6, ease: "power2.in" }, "<0.3");

    return () => {
      disposed = true;
      tl.kill();
      cancelAnimationFrame(raf);
      cleanupFns.forEach((fn) => fn());
      pGeo.dispose();
      pMat.dispose();
      logoMat?.dispose();
      reflMat?.dispose();
      bloom.dispose?.();
      composer.dispose?.();
      renderer.dispose();
    };
  }, []);

  const skip = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* atmosphere: graphite gradient + vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_42%,#16171b_0%,#0a0a0c_45%,#000_100%)]" />
          {/* soft fog blobs */}
          <div className="pointer-events-none absolute left-[20%] top-[30%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,150,79,0.08),transparent_65%)] blur-3xl" />
          <div className="pointer-events-none absolute right-[18%] bottom-[20%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(120,130,140,0.06),transparent_65%)] blur-3xl" />

          {/* warm golden light sweep across the darkness */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(200,150,79,0.10),transparent)] blur-2xl"
            initial={{ x: "-120%" }}
            animate={{ x: "240%" }}
            transition={{ duration: 3.2, ease: "easeInOut", delay: 0.4 }}
          />

          {/* three.js stage (desktop) */}
          {!light && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}

          {/* lightweight logo reveal (mobile / reduced-motion) */}
          {light && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 1.15, filter: "blur(22px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-40 w-40"
              >
                <span className="absolute inset-0 -z-10 scale-125 rounded-full bg-[radial-gradient(circle,rgba(120,180,235,0.5),transparent_70%)] blur-xl" />
                <img src="/images/logo.png" alt="Abdin Auto Seats Upholstery" className="h-full w-full object-contain" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 animate-[shimmer2_3s_infinite_linear] bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.6)_50%,rgba(170,215,255,0.5)_55%,transparent_70%)] [background-size:200%_100%]"
                  style={logoMask}
                />
              </motion.div>
            </div>
          )}

          {/* reflective floor sheen */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(200,150,79,0.05),transparent)]" />
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_220px_60px_rgba(0,0,0,0.9)]" />

          <button
            onClick={skip}
            className="absolute bottom-6 right-6 z-10 text-[11px] uppercase tracking-[0.3em] text-cream/40 transition-colors hover:text-gold-light"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
