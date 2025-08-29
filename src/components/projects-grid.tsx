"use client";

import Link from "next/link"; // Import Link
import { ProjectMeta } from "@/lib/project-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { Github, Link as LinkIcon, Calendar, Star } from "lucide-react"; // Renamed Link to LinkIcon

export function ProjectsGrid({ projects }: { projects: ProjectMeta[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-9xl mx-auto">
      {projects.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`} className="group">
          <Card
            className="bg-white/5 border-white/10 text-white backdrop-blur-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col min-h-[280px] group-hover:shadow-lg group-hover:shadow-blue-500/50"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold leading-tight flex items-center gap-2">
                {project.title}
              </CardTitle>
              <CardDescription className="text-white/60 pt-2">
                {project.description}
              </CardDescription>
              {project.excerpt && (
                <p className="text-white/70 text-sm mt-2">{project.excerpt}</p>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{project.date}</span>
                </div>
                {project.timeline && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{project.timeline}</span>
                  </div>
                )}
                {project.isFeatured && (
                  <div className="flex items-center gap-1.5 text-yellow-400 font-medium">
                    <Star className="w-4 h-4" />
                    <span>Featured</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/10 text-white/80 border-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                {project.liveLink && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-400 hover:text-blue-300 hover:no-underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.liveLink, "_blank");
                    }}
                  >
                    <span>
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    <span>Live Preview</span>
                  </Button>
                )}
                {project.pagePreviewLink && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-400 hover:text-blue-300 hover:no-underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.pagePreviewLink, "_blank");
                    }}
                  >
                    <span>
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    <span>Page Preview</span>
                  </Button>
                )}
                {project.githubLink && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-400 hover:text-blue-300 hover:no-underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.githubLink, "_blank");
                    }}
                  >
                    <span>
                      <Github className="w-4 h-4" />
                    </span>
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
