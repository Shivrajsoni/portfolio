"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const GITHUB_USERNAME = "Shivrajsoni";

type ContributionsPayload = {
  svg: string;
  stats: {
    totalCells: number;
    activeCells: number;
    maxScore: number;
    latestDate?: string;
  };
};

export default function GitHubActivityFooter() {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [payload, setPayload] = useState<ContributionsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeParam = mounted && resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    setLoading(true);
    setPayload(null);
    setError(null);

    const ac = new AbortController();
    fetch(
      `/api/github-contributions?username=${encodeURIComponent(
        GITHUB_USERNAME,
      )}&theme=${encodeURIComponent(themeParam)}`,
      { signal: ac.signal },
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as ContributionsPayload;
      })
      .then((data) => {
        if (cancelled) return;
        setPayload(data);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load GitHub activity");
        setPayload(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [mounted, themeParam]);

  return (
    <div className="w-full border-t border-border/60 bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-6 py-0 sm:px-8">
        <motion.div
          className="flex w-full items-center justify-center overflow-hidden min-h-[120px] md:min-h-[160px]"
          aria-label="GitHub contributions heatmap"
          role="img"
          style={{ willChange: "transform" }}
          initial={{ x: 0 }}
          animate={
            !prefersReducedMotion && !!payload
              ? { x: ["-10px", "10px", "-10px"] }
              : { x: 0 }
          }
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-3 w-3 animate-pulse rounded-full bg-primary/60" />
            </div>
          ) : payload ? (
            <div
              className="w-full [&>svg]:block [&>svg]:w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: payload.svg }}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
              {error ?? "Could not load GitHub chart right now."}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

