import React from "react";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/project-utils";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import BeamsBackground from "@/components/beams-background"; // Import BeamsBackground
import { Button } from "@/components/ui/button"; // Import Button
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Github, Link as LinkIcon, Calendar } from "lucide-react"; // Import icons

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

const ProjectPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params; // Await params
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="dark">
      <BeamsBackground intensity="subtle"> {/* Wrap with BeamsBackground */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Breadcrumb className="mb-8">
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
                <BreadcrumbPage>{project.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <article className="prose dark:prose-invert max-w-none prose-lg text-white"> {/* Added prose-lg and text-white */}
            <h1 className="text-5xl font-bold mb-4 text-white">{project.title}</h1> {/* Increased font size */}
            {project.description && (
              <p className="text-white/70 text-xl mb-4">{project.description}</p> // Display description
            )}
            {project.excerpt && (
              <p className="text-white/60 text-lg mb-6">{project.excerpt}</p> // Display excerpt
            )}

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-8 gap-x-4">
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
              <span className="mx-2">•</span>
              <span>{project.readTime}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8"> {/* Tags */}
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

            <div className="flex gap-4 mb-8"> {/* Links */}
              {project.liveLink && (
                <Button asChild>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Live Preview
                  </a>
                </Button>
              )}
              {project.pagePreviewLink && (
                <Button asChild>
                  <a
                    href={project.pagePreviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Page Preview
                  </a>
                </Button>
              )}
              {project.githubLink && (
                <Button asChild>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
              )}
            </div>

            <div className="markdown-content" dangerouslySetInnerHTML={{ __html: project.content }} /> {/* Added markdown-content class */}
          </article>
        </div>
      </BeamsBackground>
    </div>
  );
};

export default ProjectPage;
