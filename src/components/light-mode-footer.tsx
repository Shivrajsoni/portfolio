"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DitherShader } from "@/components/ui/dither-shader";

const QUOTES = [
  "Build things that matter.",
  "Simplicity is the ultimate sophistication.",
  "Code is poetry written in logic.",
];

const ROTATION_INTERVAL_MS = 5500;

const FOOTER_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/proof-of-work", label: "Proof of Work" },
  { href: "/blog", label: "Blogs" },
] as const;

// Pixel-art dither image – landscape/code vibe, fits portfolio
const DITHER_IMAGE =
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop";

export default function LightModeFooter() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-50/100">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 md:py-14">
        {/* Top: left = branding + quotes + links, right = pixel art with energy */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="relative min-w-0 flex-1">
            {/* Branding */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Shivraj Soni
              </span>
              <span className="text-slate-400">.</span>
            </div>

            {/* Quotes – Harry Potter style: emerge, hold, erase, next */}
            <div
              className="relative mt-3 min-h-[3rem] w-full max-w-xl sm:min-h-[3.5rem]"
              style={{ perspective: "800px" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={quoteIndex}
                  initial={{
                    opacity: 0,
                    filter: "blur(16px)",
                  }}
                  animate={{
                    opacity: 0.95,
                    filter: "blur(0px)",
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(16px)",
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="absolute inset-0 text-base text-slate-600/90 sm:text-lg"
                  style={{
                    fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
                    textShadow:
                      "0 0 24px rgba(255,255,255,0.7), 0 0 48px rgba(230,240,255,0.35), 0 0 1px rgba(100,120,140,0.2)",
                  }}
                >
                  &ldquo;{QUOTES[quoteIndex]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Lighter links: Projects, Proof of Work, Blogs */}
            <nav className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
              {FOOTER_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-50 rounded"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: pixel art with energy / glow, aligned to footer right */}
          <div className="flex shrink-0 justify-end md:ml-auto md:justify-end">
            <motion.div
              className="relative h-40 w-56 sm:h-48 sm:w-64"
              initial={false}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(148,163,184,0.15), 0 0 40px rgba(100,116,139,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                  "0 0 28px rgba(148,163,184,0.2), 0 0 56px rgba(100,116,139,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
                  "0 0 20px rgba(148,163,184,0.15), 0 0 40px rgba(100,116,139,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                ],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
              style={{
                borderRadius: "0.75rem",
                border: "1px solid rgba(226,232,240,0.9)",
                background:
                  "linear-gradient(145deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.9) 100%)",
              }}
            >
              <div className="absolute inset-[1px] overflow-hidden rounded-[11px]">
                <DitherShader
                  src={DITHER_IMAGE}
                  gridSize={2}
                  ditherMode="bayer"
                  colorMode="grayscale"
                  invert={false}
                  primaryColor="#1e293b"
                  secondaryColor="#f1f5f9"
                  threshold={0.5}
                  pixelResolution={[64, 48]}
                  className="h-full w-full"
                />
              </div>
              {/* Soft inner light / energy highlight */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[11px] opacity-60"
                style={{
                  background:
                    "linear-gradient(165deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)",
                  mixBlendMode: "overlay",
                }}
              />
              {/* Corner glow accents */}
              <div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 50% at 70% 20%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(ellipse 60% 40% at 30% 80%, rgba(148,163,184,0.08), transparent 50%)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom row: copyright */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200/60 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Shivraj Soni. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
