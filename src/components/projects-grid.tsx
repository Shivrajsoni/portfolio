"use client";
import { useRouter } from "next/navigation";
import { ProjectMeta } from "@/lib/project-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Link as LinkIcon, Calendar, Star } from "lucide-react";

export function ProjectsGrid({ projects }: { projects: ProjectMeta[] }) {
  const router = useRouter();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const descriptionRaw = (project.description ?? "").trim();
        const excerptText = (project.excerpt ?? "").trim();
        const descriptionText = descriptionRaw || excerptText || "—";
        const showExcerpt = Boolean(excerptText && descriptionRaw && excerptText !== descriptionRaw);

        return (
          <Card
            key={project.slug}
            role="link"
            tabIndex={0}
            aria-label={`Open project: ${project.title}`}
            onClick={() => router.push(`/projects/${project.slug}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/projects/${project.slug}`);
              }
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent text-foreground py-0 gap-0 px-0 shadow-none transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 backdrop-blur-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -top-24 left-0 h-48 w-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.45),transparent)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex min-h-[300px] flex-col">
              <div className="min-h-[165px] flex flex-col px-6 pt-6 pb-3">
                <h3 className="line-clamp-2 text-xl font-bold tracking-tight leading-snug">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground opacity-90 line-clamp-3">
                  {descriptionText}
                </p>

                {showExcerpt ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground opacity-70 line-clamp-2">
                    {excerptText}
                  </p>
                ) : (
                  // Keep header height stable for better grid symmetry.
                  <div aria-hidden className="mt-2 h-[1.2rem]" />
                )}
              </div>

              <div className="px-6 flex-grow pb-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground opacity-90">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{project.date}</span>
                  </span>

                  {project.timeline && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-muted-foreground opacity-60">·</span>
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
              </div>

              <div className="px-6 pt-4 pb-6 min-h-[96px] flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/5 text-foreground opacity-90 border border-border/60 text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap justify-end items-center gap-2">
                  {project.liveLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-border/60 bg-transparent px-3 text-primary/70 hover:text-primary/90 hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.liveLink, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <LinkIcon className="h-4 w-4 shrink-0" />
                      <span>Live</span>
                    </Button>
                  )}

                  {project.pagePreviewLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-border/60 bg-transparent px-3 text-primary/70 hover:text-primary/90 hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.pagePreviewLink, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <LinkIcon className="h-4 w-4 shrink-0" />
                      <span>Preview</span>
                    </Button>
                  )}

                  {project.githubLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-border/60 bg-transparent px-3 text-primary/70 hover:text-primary/90 hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.githubLink, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <Github className="h-4 w-4 shrink-0" />
                      <span>GitHub</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
