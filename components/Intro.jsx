"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Cinematic intro splash (kling.ai-style) built around the brand logo.
 * The logo lifts out of darkness, a chrome line sweeps across, then the
 * whole curtain peels upward to reveal the experience.
 */
export default function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("acs-intro-seen")) {
      setShow(false);
      return;
    }
    // lock scroll during the intro
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem("acs-intro-seen", "1");
      setShow(false);
    }, 2900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* radial luxe glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(200,150,79,0.16),transparent_70%)]" />

          <div className="relative flex flex-col items-center">
            <motion.img
              src="/images/logo.png"
              alt="Abdin Car Seats"
              width={150}
              height={150}
              className="h-36 w-36 object-contain drop-shadow-[0_10px_40px_rgba(200,150,79,0.35)]"
              initial={{ opacity: 0, scale: 0.7, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="mt-7 h-px w-56 overflow-hidden">
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-gold-light to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              className="eyebrow mt-6 text-gold-light/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
            >
              Abdin Car Seats
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
