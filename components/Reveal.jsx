"use client";

import { motion } from "framer-motion";

/**
 * Fade + rise on enter, used across all content sections.
 * Transform/opacity only (no filter) so it stays cheap & smooth on mobile.
 * Tweak: `y` = reveal distance, `delay`/`duration` below.
 */
export default function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} // premium easing
    >
      {children}
    </motion.div>
  );
}
