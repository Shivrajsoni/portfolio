"use client";

import { motion } from "motion/react";

interface GlassMenuEffectProps {
  rounded?: string;
  className?: string;
}

export function GlassMenuEffect({
  rounded = "rounded-[28px]",
  className = "",
}: GlassMenuEffectProps) {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      layout
      style={{
        transform: "translateZ(0)",
        willChange: "auto",
      }}
      transition={{
        layout: {
          type: "spring",
          damping: 35,
          stiffness: 180,
        },
      }}
    >
      <div
        className={`absolute inset-0 backdrop-blur-md bg-white/40 border border-zinc-200/50 dark:bg-white/5 dark:border-white/10 ${rounded}`}
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />
    </motion.div>
  );
}
