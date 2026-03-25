"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const [payload, setPayload] = useState<ContributionsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const themeParam = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    setLoading(true);
    setPayload(null);

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
      .catch(() => {
        if (cancelled) return;
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
      <div className="mx-auto w-full max-w-6xl pl-0 pr-6 py-0 sm:pl-0 sm:pr-8">
        <div
          className="w-full overflow-hidden aspect-[663/104] md:w-[85%] md:max-w-[85%]"
          aria-label="GitHub contributions heatmap"
          role="img"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-3 w-3 animate-pulse rounded-full bg-primary/60" />
            </div>
          ) : payload ? (
            <div
              className="h-full w-full [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: payload.svg }}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
              Could not load GitHub chart right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

