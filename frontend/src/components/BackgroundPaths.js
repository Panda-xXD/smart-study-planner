import React from "react";
import { motion } from "framer-motion";

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}
        C-${380 - i * 5 * position} -${189 + i * 6}
        -${312 - i * 5 * position} ${216 - i * 6}
        ${152 - i * 5 * position} ${343 - i * 6}
        C${616 - i * 5 * position} ${470 - i * 6}
        ${684 - i * 5 * position} ${875 - i * 6}
        ${684 - i * 5 * position} ${875 - i * 6}`,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg viewBox="0 0 696 316" style={{ width: "100%", height: "100%" }}>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="rgba(79,140,255,0.2)"
            strokeWidth={0.5 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}

function BackgroundPaths() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#050505",
        overflow: "hidden",
      }}
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}

export default BackgroundPaths;
