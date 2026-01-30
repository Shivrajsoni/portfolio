"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// 2x2 Bayer matrix (normalized 0–1)
const BAYER_2 = [0, 2, 3, 1].map((v) => v / 4);
// 4x4 Bayer matrix
const BAYER_4 = [
  0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
].map((v) => v / 16);

function getBayerThreshold(x: number, y: number, gridSize: number): number {
  const size = gridSize * gridSize;
  const idx = (y % gridSize) * gridSize + (x % gridSize);
  if (gridSize === 2) return BAYER_2[idx] ?? 0;
  if (gridSize === 4) return BAYER_4[idx] ?? 0;
  return (idx + 0.5) / size;
}

function parseHex(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export interface DitherShaderProps {
  src: string;
  gridSize?: 2 | 4;
  ditherMode?: "bayer";
  colorMode?: "grayscale" | "color";
  invert?: boolean;
  animated?: boolean;
  animationSpeed?: number;
  primaryColor?: string;
  secondaryColor?: string;
  threshold?: number;
  /** [width, height] – render at this resolution for full pixel-art block look, then scale up */
  pixelResolution?: [number, number];
  className?: string;
}

export function DitherShader({
  src,
  gridSize = 2,
  colorMode = "grayscale",
  invert = false,
  primaryColor = "#000000",
  secondaryColor = "#f5f5f5",
  threshold = 0.5,
  pixelResolution,
  className,
}: DitherShaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const displayW = Math.max(1, Math.floor(rect.width));
        const displayH = Math.max(1, Math.floor(rect.height));
        const [pw, ph] = pixelResolution ?? [displayW, displayH];
        const w = Math.max(1, pw);
        const h = Math.max(1, ph);

        const dpr = 1;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = pixelResolution ? "100%" : `${displayW}px`;
        canvas.style.height = pixelResolution ? "100%" : `${displayH}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const primary = parseHex(primaryColor);
        const secondary = parseHex(secondaryColor);

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            let r = data[i] / 255;
            let g = data[i + 1] / 255;
            let b = data[i + 2] / 255;

            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            const level = colorMode === "grayscale" ? luminance : (r + g + b) / 3;
            const adj = invert ? 1 - level : level;
            const t = getBayerThreshold(x, y, gridSize);
            const usePrimary = adj + (threshold - 0.5) >= t;
            const [pr, pg, pb] = usePrimary ? primary : secondary;
            data[i] = Math.round(pr * 255);
            data[i + 1] = Math.round(pg * 255);
            data[i + 2] = Math.round(pb * 255);
          }
        }

        ctx.putImageData(imageData, 0, 0);
      });
    };

    img.onerror = () => {};
    img.src = src;
  }, [src, gridSize, colorMode, invert, primaryColor, secondaryColor, threshold, pixelResolution]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full block object-contain object-center"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
