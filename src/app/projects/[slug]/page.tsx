import React from "react";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/project-utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

const ProjectPage = async ({ params }: { params: { slug: string } }) => {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <span>{project.date}</span>
          <span className="mx-2">•</span>
          <span>{project.readTime}</span>
        </div>
        {project.liveLink && (
          <div className="mb-8">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Live Project
            </a>
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: project.content }} />
      </article>
    </div>
  );
};

export default ProjectPage;
