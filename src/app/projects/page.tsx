"use client";
import React, { useState, useEffect } from "react";
import { ProjectMeta } from "@/lib/project-utils";
import { ProjectsGrid } from "@/components/projects-grid";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
    <div className="container mx-auto px-4 py-8">
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
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-100">Projects</h1>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-muted-foreground mr-2">Filter by:</span>
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "ghost"}
            size="sm"
            onClick={() => filterProjects(tag)}
            className="rounded-full"
          >
            {tag}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p>Loading projects...</p>
      ) : (
        <ProjectsGrid projects={filteredProjects} />
      )}
    </div>
  );
};

export default ProjectsPage;
