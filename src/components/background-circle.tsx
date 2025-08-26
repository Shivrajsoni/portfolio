"use client";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import React from "react";

interface BackgroundCirclesProps {
  title?: string;
  className?: string;
  variant?: keyof typeof COLOR_VARIANTS;
}

const COLOR_VARIANTS = {
  primary: {
    border: [
      "border-emerald-500/60",
      "border-cyan-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-emerald-500/30 to-transparent",
    radial: "emerald-500",
  },
  secondary: {
    border: [
      "border-violet-500/60",
      "border-fuchsia-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-violet-500/30 to-transparent",
    radial: "violet-500",
  },
  tertiary: {
    border: [
      "border-orange-500/60",
      "border-yellow-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-orange-500/30 to-transparent",
    radial: "orange-500",
  },
  quaternary: {
    border: [
      "border-purple-500/60",
      "border-pink-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-purple-500/30 to-transparent",
    radial: "purple-500",
  },
  quinary: {
    border: ["border-red-500/60", "border-rose-400/50", "border-slate-600/30"],
    gradient: "from-red-500/30 to-transparent",
    radial: "red-500",
  },
  senary: {
    border: ["border-blue-500/60", "border-sky-400/50", "border-slate-600/30"],
    gradient: "from-blue-500/30 to-transparent",
    radial: "blue-500",
  },
  septenary: {
    border: ["border-gray-500/60", "border-gray-400/50", "border-slate-600/30"],
    gradient: "from-gray-500/30 to-transparent",
    radial: "gray-500",
  },
  octonary: {
    border: ["border-red-500/60", "border-rose-400/50", "border-slate-600/30"],
    gradient: "from-red-500/30 to-transparent",
    radial: "red-500",
  },
} as const;

const AnimatedGrid = () => (
  <motion.div
    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%"],
    }}
    transition={{
      duration: 40,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    }}
  >
    <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-20" />
  </motion.div>
);

export function BackgroundCircles({
  title = "Background Circles",
  className,
  variant: initialVariant = "octonary",
}: BackgroundCirclesProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variant = theme === "light" ? "primary" : initialVariant;
  const variantStyles = COLOR_VARIANTS[variant];
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.7], [0.2, 0]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div
        ref={targetRef}
        className={clsx("relative h-screen w-full", className)}
      />
      <motion.div
        style={{ scale, x, y }}
        className="fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center pointer-events-none"
      >
        <motion.div style={{ opacity: gridOpacity }}>
          <AnimatedGrid />
        </motion.div>
        <motion.div className="absolute h-[480px] w-[480px]">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={clsx(
                "absolute inset-0 rounded-full",
                "border-2 bg-gradient-to-br", // Changed to standard Tailwind class
                variantStyles.border[i],
                variantStyles.gradient
              )}
              animate={{
                rotate: 360,
                scale: [1, 1.05 + i * 0.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div
                className={clsx(
                  "absolute inset-0 rounded-full mix-blend-screen",
                  `bg-[radial-gradient(ellipse_at_center,rgba(var(--tw-color-${variantStyles.radial}),0.1),transparent_70%)]` // Using CSS variable for radial gradient
                )}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 text-center"
        >
          <h1
            className={clsx(
              "text-5xl font-bold tracking-tight md:text-7xl",
              "bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent",
              "drop-shadow-[0_0_32px_rgba(94,234,212,0.4)]"
            )}
          >
            {title}
          </h1>
        </motion.div>

        <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0F766E/30%,transparent_70%)] blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2DD4BF/15%,transparent)] blur-[80px]" />
        </div>
      </motion.div>
    </>
  );
}

export default function DemoCircles() {
  const [currentVariant, setCurrentVariant] =
    useState<keyof typeof COLOR_VARIANTS>("octonary");

  const variants = Object.keys(
    COLOR_VARIANTS
  ) as (keyof typeof COLOR_VARIANTS)[];

  function getNextVariant() {
    const currentIndex = variants.indexOf(currentVariant);
    const nextVariant = variants[(currentIndex + 1) % variants.length];
    return nextVariant;
  }

  return (
    <>
      <BackgroundCircles variant={currentVariant} />
      <div className="absolute top-12 right-12">
        <button
          type="button"
          className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-1 rounded-md z-10 text-sm font-medium"
          onClick={() => {
            setCurrentVariant(getNextVariant());
          }}
        >
          Change Variant
        </button>
      </div>
    </>
  );
}
