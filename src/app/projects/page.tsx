import React from "react";
import { getAllProjects, ProjectMeta } from "@/lib/project-utils";
import Link from "next/link";

const ProjectsPage = async () => {
  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project: ProjectMeta) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
              <p className="text-muted-foreground mb-4">{project.excerpt}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{project.date}</span>
                <span className="mx-2">•</span>
                <span>{project.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
