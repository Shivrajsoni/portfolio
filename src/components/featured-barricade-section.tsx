"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BlogMeta } from "@/lib/blog-utils";
import type { ProjectMeta } from "@/lib/project-utils";
import type { ProofOfWorkMeta } from "@/lib/proof-of-work-utils";

type FeaturedItem = {
  type: "blog" | "project" | "proof";
  title: string;
  excerpt: string;
  href: string;
  external?: boolean;
};

interface FeaturedBarricadeSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  featuredBlogs: BlogMeta[];
  featuredProjects: ProjectMeta[];
  featuredProofOfWork: ProofOfWorkMeta[];
}

function buildItems(
  blogs: BlogMeta[],
  projects: ProjectMeta[],
  proof: ProofOfWorkMeta[],
): FeaturedItem[] {
  const items: FeaturedItem[] = [];
  blogs.forEach((b) =>
    items.push({
      type: "blog",
      title: b.title,
      excerpt: b.excerpt || "",
      href: `/blog/${b.slug}`,
    }),
  );
  projects.forEach((p) =>
    items.push({
      type: "project",
      title: p.title,
      excerpt: p.excerpt || "",
      href: `/projects/${p.slug}`,
    }),
  );
  proof.forEach((e) =>
    items.push({
      type: "proof",
      title: e.title,
      excerpt: e.excerpt || "",
      href: e.liveLink || `/proof-of-work/${e.slug}`,
      external: !!e.liveLink,
    }),
  );
  return items;
}

function FeaturedItemScroller({
  items,
  className,
}: {
  items: FeaturedItem[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current || items.length === 0)
      return;
    const scroller = scrollerRef.current;
    const children = Array.from(scroller.children);
    children.forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      scroller.appendChild(clone);
    });
    containerRef.current.style.setProperty("--animation-duration", "50s");
    containerRef.current.style.setProperty("--animation-direction", "forwards");
    setStart(true);
  }, [items.length]);

  if (items.length === 0) return null;

  const typeLabel = (t: FeaturedItem["type"]) =>
    t === "blog" ? "Blog" : t === "project" ? "Project" : "Proof of Work";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-3 py-2",
          start && "animate-scroll hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => {
          const cardContent = (
            <>
              <Badge
                variant="secondary"
                className="w-fit text-[10px] px-2 py-0"
              >
                {typeLabel(item.type)}
              </Badge>
              <span className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </span>
              {item.excerpt && (
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </span>
              )}
            </>
          );
          return (
          <li
            key={`${item.type}-${item.href}-${idx}`}
            className="relative max-w-[260px] min-w-[240px] shrink-0"
          >
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card/95 backdrop-blur-sm p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                {cardContent}
              </a>
            ) : (
              <Link
                href={item.href}
                className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card/95 backdrop-blur-sm p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                {cardContent}
              </Link>
            )}
          </li>
          );
        })}
      </ul>
    </div>
  );
}

const HEADER_OFFSET = 64;

export default function FeaturedBarricadeSection({
  heroRef,
  featuredBlogs,
  featuredProjects,
  featuredProofOfWork,
}: FeaturedBarricadeSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.5, 0.65],
    [1, 1, 0.4, 0],
  );

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setEntered(true), 400);
    return () => clearTimeout(t);
  }, [mounted]);

  const items = buildItems(
    featuredBlogs,
    featuredProjects,
    featuredProofOfWork,
  );

  if (!mounted) return null;

  return (
    <motion.div
      style={{ opacity, top: HEADER_OFFSET }}
      className="fixed left-0 right-0 z-[11] flex flex-col"
    >
      <motion.div
        initial={false}
        animate={entered ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full overflow-hidden rounded-b-xl bg-card/90 backdrop-blur-sm"
        style={
          {
            "--page-bg": isDark ? "rgb(0 0 0)" : "rgb(255 255 255)",
          } as React.CSSProperties
        }
      >
        <div className="relative flex h-[100px] w-full items-center px-4 md:px-6">
          <div className="relative z-10 w-full max-w-5xl mx-auto pointer-events-auto">
            {items.length > 0 ? (
              <FeaturedItemScroller items={items} />
            ) : (
              <div className="rounded-lg bg-card/80 backdrop-blur-sm px-4 py-3 text-center text-sm text-muted-foreground">
                No featured items yet. Mark blogs, projects, or proof of work as
                featured in the admin.
              </div>
            )}
          </div>
        </div>
        {/* Bottom edge fades into page background */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, transparent 30%, var(--page-bg) 100%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
