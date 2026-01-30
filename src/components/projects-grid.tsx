"use client";

import Link from "next/link";
import { ProjectMeta } from "@/lib/project-utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Link as LinkIcon, Calendar, Star } from "lucide-react";

export function ProjectsGrid({ projects }: { projects: ProjectMeta[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-9xl mx-auto">
      {projects.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`} className="group">
          <Card
            className="bg-white/5 border-white/10 text-white backdrop-blur-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col min-h-[280px] group-hover:shadow-lg group-hover:shadow-blue-500/50"
          >
            <CardHeader className="space-y-3 pb-2">
              {/* Title: single clear line, aligned */}
              <h3 className="text-xl font-bold tracking-tight leading-snug text-white line-clamp-2">
                {project.title}
              </h3>
              {/* Description: consistent body text, line-clamp for even card height */}
              <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                {(project.description ?? project.excerpt ?? "").trim() || "—"}
              </p>
              {/* Excerpt only if different from description, smaller supporting line */}
              {project.excerpt &&
                (project.excerpt ?? "").trim() !== (project.description ?? "").trim() && (
                  <p className="text-xs text-white/55 leading-relaxed line-clamp-2">
                    {project.excerpt}
                  </p>
                )}
            </CardHeader>
            <CardContent className="flex-grow space-y-4 pt-0">
              {/* Meta row: icon + label pattern, consistent spacing */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-white/65">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{project.date}</span>
                </span>
                {project.timeline && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-white/45">·</span>
                    <span>{project.timeline}</span>
                  </span>
                )}
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 text-amber-400/90 font-medium">
                    <Star className="h-4 w-4 shrink-0" aria-hidden />
                    <span>Featured</span>
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-0 sm:flex-row sm:items-end sm:justify-between">
              {/* Tags: wrap with consistent gap */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/10 text-white/80 border-none text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {/* Links: aligned row, same pattern for each */}
              <div className="flex flex-wrap items-center gap-3">
                {project.liveLink && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-400 hover:text-blue-300 hover:no-underline font-medium inline-flex items-center gap-1.5"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.liveLink, "_blank");
                    }}
                  >
                    <LinkIcon className="h-4 w-4 shrink-0" />
                    <span>Live</span>
                  </Button>
                )}
                {project.pagePreviewLink && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-400 hover:text-blue-300 hover:no-underline font-medium inline-flex items-center gap-1.5"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.pagePreviewLink, "_blank");
                    }}
                  >
                    <LinkIcon className="h-4 w-4 shrink-0" />
                    <span>Preview</span>
                  </Button>
                )}
                {project.githubLink && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-400 hover:text-blue-300 hover:no-underline font-medium inline-flex items-center gap-1.5"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.githubLink, "_blank");
                    }}
                  >
                    <Github className="h-4 w-4 shrink-0" />
                    <span>GitHub</span>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
