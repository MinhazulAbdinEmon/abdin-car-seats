"use client";

import { motion } from "framer-motion";

/**
 * Brand-tuned take on the Aceternity "floating paths" background — flowing gold
 * filament lines on the dark theme. Drop it as an absolute layer inside any
 * `relative` section. Subtle by design so content stays readable.
 */
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${
      189 + i * 6
    } -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${
      343 - i * 6
    }C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${
      875 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg className="h-full w-full text-gold" viewBox="0 0 696 316" fill="none">
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.06 + path.id * 0.018}
          initial={{ pathLength: 0.3, opacity: 0.5 }}
          animate={{
            pathLength: 1,
            opacity: [0.2, 0.45, 0.2],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

export default function PathsBackground({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
