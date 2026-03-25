"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, motion, useReducedMotion } from "framer-motion";
import BackgroundCircles from "@/components/background-circles-client";
import ProfileHighlightCard from "@/components/profile-highlight-card";
import FeaturedBarricadeSection from "@/components/featured-barricade-section";
import LetsWorkTogether from "@/components/lets-work-together";
import type { BlogMeta } from "@/lib/blog-utils";
import type { ProjectMeta } from "@/lib/project-utils";
import type { ProofOfWorkMeta } from "@/lib/proof-of-work-utils";

const PROFILE_SCROLL_THRESHOLD = 0.9;

interface HeroAndProfileWrapperProps {
  children?: React.ReactNode;
  featuredBlogs?: BlogMeta[];
  featuredProjects?: ProjectMeta[];
  featuredProofOfWork?: ProofOfWorkMeta[];
}

export default function HeroAndProfileWrapper({
  children,
  featuredBlogs = [],
  featuredProjects = [],
  featuredProofOfWork = [],
}: HeroAndProfileWrapperProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setShowCard(value >= PROFILE_SCROLL_THRESHOLD);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      <div ref={heroRef} className="min-h-screen w-full relative">
        <BackgroundCircles />
        <FeaturedBarricadeSection
          heroRef={heroRef}
          featuredBlogs={featuredBlogs}
          featuredProjects={featuredProjects}
          featuredProofOfWork={featuredProofOfWork}
        />
      </div>

      {/* On lg: left column always reserved so right column never shifts — LetsWorkTogether always slides from viewport right into same place */}
      <section className="relative z-10 min-h-[200vh] pl-0 pt-16 pb-12 md:pl-1 lg:pl-2 overflow-visible">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 overflow-visible">
          {/* Left column always same width so right column never shifts — card fades in/out in place; LetsWorkTogether always slides from viewport right */}
          <div className="relative lg:sticky lg:top-[20%] lg:left-0 w-full max-w-[360px] lg:w-[360px] lg:min-w-[360px] shrink-0 self-start overflow-visible h-fit pointer-events-none">
            <div className="pointer-events-auto w-full">
              <motion.div
                initial={false}
                animate={{
                  opacity: showCard ? 1 : 0,
                  x: prefersReducedMotion ? 0 : showCard ? 0 : -32,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full"
                style={{ visibility: showCard ? "visible" : "hidden" }}
              >
                <ProfileHighlightCard />
              </motion.div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-10 shrink-0 lg:max-w-[360px] lg:pl-4 overflow-visible min-w-0 self-start">
            <div className="min-h-[55vh]" aria-hidden />
            {children ? <div className="w-full">{children}</div> : null}
            <LetsWorkTogether />
          </div>
        </div>
      </section>
    </>
  );
}
