import React from "react";
import { getAllProjects } from "@/lib/project-utils";
import { ProjectsGrid } from "@/components/projects-grid";

const ProjectsPage = async () => {
  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
};

export default ProjectsPage;
