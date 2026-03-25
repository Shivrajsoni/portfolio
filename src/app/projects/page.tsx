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
    <BeamsBackground intensity="subtle" background="auto">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 relative z-10">
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
        <h1 className="text-5xl font-bold text-center mb-16 text-foreground tracking-tighter">
          Projects
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "ghost"}
              size="sm"
              onClick={() => filterProjects(tag)}
              className={
                selectedTag === tag
                  ? "rounded-full"
                  : "rounded-full bg-primary/10 text-foreground opacity-80 border-none hover:bg-primary/20"
              }
            >
              {tag}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading projects...</p>
        ) : (
          <ProjectsGrid projects={filteredProjects} />
        )}
      </div>
    </BeamsBackground>
  );
};

export default ProjectsPage;
