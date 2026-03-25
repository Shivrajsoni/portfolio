"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  // Keep existing behavior (always dark) by default so current pages don't change.
  background?: "dark" | "auto";
  centered?: boolean;
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

const OPACITY_MAP = {
  subtle: 0.7,
  medium: 0.85,
  strong: 1,
} as const;

const CONFIG_BY_INTENSITY = {
  subtle: {
    beamMultiplier: 1.15,
    // Lower blur to reduce GPU load.
    blurPx: 18,
    // Fewer gradient stops (solid beams) below are cheaper.
    useGradient: false,
    // Render less frequently to cut CPU/GPU work.
    targetFps: 30,
  },
  medium: {
    beamMultiplier: 1.35,
    blurPx: 26,
    useGradient: true,
    targetFps: 40,
  },
  strong: {
    beamMultiplier: 1.55,
    blurPx: 35,
    useGradient: true,
    targetFps: 50,
  },
} as const;

export default function BeamsBackground({
  className,
  intensity = "strong",
  children,
  background = "dark",
  centered = true,
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastRenderTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const intensityConfig = CONFIG_BY_INTENSITY[intensity];
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      // Keep beams bounded to reduce rendering cost.
      const baseBeams = intensity === "subtle" ? 14 : intensity === "medium" ? 20 : 24;
      const totalBeams = baseBeams * intensityConfig.beamMultiplier;
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;

      const column = index % 3;
      const spacing = canvas.width / 3;

      beam.y = canvas.height + 100;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      // Calculate pulsing opacity
      const pulsingOpacity =
        beam.opacity *
        (0.8 + Math.sin(beam.pulse) * 0.2) *
        OPACITY_MAP[intensity];
      if (!intensityConfig.useGradient) {
        ctx.fillStyle = `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

        // Enhanced gradient with multiple color stops
        gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
        gradient.addColorStop(
          0.1,
          `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
        );
        gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
        gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
        gradient.addColorStop(
          0.9,
          `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
        );
        gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      }
      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;

      // Throttle rendering to reduce GPU/CPU load.
      const targetFrameMs = 1000 / intensityConfig.targetFps;
      const now = performance.now();
      if (now - lastRenderTimeRef.current < targetFrameMs) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastRenderTimeRef.current = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `blur(${intensityConfig.blurPx}px)`;

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // `subtle` is used on content-heavy pages; keep it static to avoid lag.
    const shouldAnimate = !prefersReducedMotion && intensity !== "subtle";

    if (!shouldAnimate) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `blur(${intensityConfig.blurPx}px)`;
      beamsRef.current.forEach((beam) => {
        drawBeam(ctx, beam);
      });
      // Single-frame render (either reduced motion or `subtle` mode).
    } else {
      animate();
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div
      className={cn(
        "relative min-h-[100vh] w-full overflow-hidden",
        background === "dark" ? "bg-neutral-950" : "bg-neutral-50 dark:bg-neutral-950",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none",
          intensity === "subtle" ? "blur-[8px]" : "blur-[15px]"
        )}
      />

      {intensity === "subtle" ? (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none -z-10",
            background === "dark" ? "bg-neutral-950/20" : "bg-neutral-900/5 dark:bg-neutral-950/20"
          )}
        />
      ) : (
        <motion.div
          className={cn(
            "absolute inset-0 pointer-events-none -z-10",
            background === "dark" ? "bg-neutral-950/5" : "bg-neutral-900/5 dark:bg-neutral-950/5",
            intensity === "medium" ? "backdrop-blur-[35px]" : "backdrop-blur-[50px]"
          )}
          initial={false}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      )}

      {centered ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">{children}</div>
      ) : (
        <div className="relative z-10 w-full">{children}</div>
      )}
    </div>
  );
}
