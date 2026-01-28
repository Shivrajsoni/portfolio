"use client";

import type { ProjectPost } from "@/lib/project-utils";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectPageProps {
  project: ProjectPost;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ProjectPage = ({ project }: ProjectPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        <Breadcrumb className="mb-10">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[12rem] truncate sm:max-w-none">
                {project.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-14">
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
            <span className="text-border" aria-hidden>
              ·
            </span>
            <span>{project.readTime}</span>
            {project.author && (
              <>
                <span className="text-border" aria-hidden>
                  ·
                </span>
                <span>By {project.author}</span>
              </>
            )}
          </div>

          <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
            {project.title}
          </h1>

          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="font-medium text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {project.liveLink && (
              <Button asChild variant="default" size="sm" className="shrink-0">
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  View live
                  <svg
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </Button>
            )}
          </div>
        </header>

        <article className="doc-content">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </article>

        <footer className="mt-20 border-t border-border pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All projects
            </Link>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Shivraj Soni
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectPage;
