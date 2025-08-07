"use client";

import { BentoGrid } from "@/components/ui/bento-grid";
import { BentoCard } from "@/components/ui/bento-card";
import { CardBackground } from "@/components/ui/card-background";
import { Globe } from "lucide-react";

export const ProjectsGrid = ({
  projects,
}: {
  projects: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    liveLink?: string;
  }[];
}) => {
  return (
    <BentoGrid>
      {projects.map((project, i: number) => (
        <BentoCard
          key={project.slug}
          name={project.title}
          className=""
          background={<CardBackground />}
          Icon={Globe}
          description={project.excerpt}
          date={project.date}
          href={`/projects/${project.slug}`}
          cta="View Project"
          liveLink={project.liveLink}
        />
      ))}
    </BentoGrid>
  );
};
