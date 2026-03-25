import { NextRequest } from "next/server";

const DEFAULT_USERNAME = "Shivrajsoni";

// ghchart uses a hardcoded light grey for empty cells.
const EMPTY_LIGHT = "#eeeeee";

// GitHub dark-ish empty cell color (tuned for the app's slate theme).
const EMPTY_DARK = "#2b3648";

// Label text inside the SVG uses this grey in the upstream graphic.
const LABEL_LIGHT = "#767676";
const LABEL_DARK = "#94a3b8";

function sanitizeUsername(input: string) {
  // Allow common GitHub username characters; truncate to a reasonable length.
  return input.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 39);
}

function stripSvgXmlHeaders(svg: string) {
  return svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "")
    .trim();
}

function getLatestDate(svg: string) {
  // data-date is in YYYY-MM-DD format.
  const matches = [...svg.matchAll(/data-date="([^"]+)"/g)].map((m) => m[1]);
  if (matches.length === 0) return undefined;
  return matches.sort().at(-1);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const usernameRaw = url.searchParams.get("username") ?? DEFAULT_USERNAME;
  const theme = url.searchParams.get("theme") ?? "light";

  const username = sanitizeUsername(usernameRaw);
  const upstreamUrl = `https://ghchart.rshah.org/${encodeURIComponent(
    username,
  )}`;

  const upstream = await fetch(upstreamUrl, {
    headers: {
      // Some fetch clients get blocked; a UA header avoids 403s.
      "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
    },
    // Contributions don't change more than daily; cache upstream for an hour.
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  const svgText = await upstream.text();
  const svgBase = stripSvgXmlHeaders(svgText);

  const scoreMatches = [...svgBase.matchAll(/data-score="(\d+)"/g)].map((m) =>
    Number(m[1]),
  );
  const totalCells = scoreMatches.length;
  const activeCells = scoreMatches.filter((s) => s > 0).length;
  const maxScore = scoreMatches.length ? Math.max(...scoreMatches) : 0;
  const latestDate = getLatestDate(svgBase);

  // Patch “empty” squares for dark mode so the chart blends with the UI.
  const patchedSvg =
    theme === "dark"
      ? svgBase
          .replace(
            new RegExp(`fill:${EMPTY_LIGHT}`, "gi"),
            `fill:${EMPTY_DARK}`,
          )
          .replace(
            new RegExp(`fill:${LABEL_LIGHT}`, "gi"),
            `fill:${LABEL_DARK}`,
          )
      : svgBase;

  return Response.json(
    {
      svg: patchedSvg,
      stats: {
        totalCells,
        activeCells,
        maxScore,
        latestDate,
      },
    },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
