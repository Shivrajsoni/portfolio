"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import FeaturesSection from "@/components/features-section";
import type { BlogMeta } from "@/lib/blog-utils";
import type { ProjectMeta } from "@/lib/project-utils";
import type { ProofOfWorkMeta } from "@/lib/proof-of-work-utils";

interface FeaturesSectionWrapperProps {
  featuredBlogs: BlogMeta[];
  featuredProjects: ProjectMeta[];
  featuredProofOfWork: ProofOfWorkMeta[];
}

export default function FeaturesSectionWrapper({
  featuredBlogs,
  featuredProjects,
  featuredProofOfWork,
}: FeaturesSectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Smooth scroll-driven transitions for the features list */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0.7, 1, 1, 0.85],
  );
  const y = useTransform(smoothProgress, [0, 0.2], [24, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2], [0.98, 1]);

  return (
    <section ref={sectionRef} className="relative z-10 w-full">
      <motion.div
        style={{ opacity, y, scale }}
        className="will-change-[opacity,transform]"
      >
        <FeaturesSection
          featuredBlogs={featuredBlogs}
          featuredProjects={featuredProjects}
          featuredProofOfWork={featuredProofOfWork}
        />
      </motion.div>
    </section>
  );
}
