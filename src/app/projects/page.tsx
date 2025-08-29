"use client";
import React, { useState, useEffect } from "react";
import { ProjectMeta } from "@/lib/project-utils";
import { ProjectsGrid } from "@/components/projects-grid";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import BeamsBackground from "@/components/beams-background";

const ProjectsPage = () => {
  const [allProjects, setAllProjects] = useState<ProjectMeta[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectMeta[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectsResponse, tagsResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/tags"),
        ]);

        if (projectsResponse.ok) {
          const { projects } = await projectsResponse.json();
          setAllProjects(projects);
          setFilteredProjects(projects);
        }

        if (tagsResponse.ok) {
          const { projectTags } = await tagsResponse.json();
          setTags(["All", ...projectTags]);
        }
      } catch (error) {
        console.error("Failed to fetch projects or tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterProjects = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter((project) =>
        project.tags.includes(tag)
      );
      setFilteredProjects(filtered);
    }
  };

  return (
    <BeamsBackground intensity="subtle">
      <div className="container mx-auto py-12 px-4 relative z-10">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-5xl font-bold text-center mb-16 text-white tracking-tighter">
          Projects
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "ghost"}
              size="sm"
              onClick={() => filterProjects(tag)}
              className="rounded-full bg-white/10 text-white/80 border-none hover:bg-white/20"
            >
              {tag}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-white/70">Loading projects...</p>
        ) : (
          <ProjectsGrid projects={filteredProjects} />
        )}
      </div>
    </BeamsBackground>
  );
};

export default ProjectsPage;
