"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import matter from "gray-matter";
import type { ProjectMeta as ProjectMetaType } from "@/lib/project-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

// Extend the ProjectMeta type to optionally include the full content
interface ProjectMeta extends ProjectMetaType {
  content?: string;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectMeta | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "Shivraj Soni",
    featured: false,
    liveLink: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch all projects
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const { projects: fetchedProjects } = await response.json();
        setProjects(fetchedProjects);
      } else {
        console.error("Failed to load projects");
        alert("Error: Could not load projects.");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      alert("An unexpected error occurred while loading projects.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects on initial component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Function to clear and reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      author: "Shivraj Soni",
      featured: false,
    });
    setEditingProject(null);
    setShowCreateForm(false);
  };

  // Handler for clicking the "Edit" button
  const handleEditClick = async (project: ProjectMeta) => {
    setShowCreateForm(true);
    setEditingProject(project);

    // Set initial form data with existing metadata
    setFormData({
      title: project.title,
      excerpt: project.excerpt,
      content: "Loading content...", // Placeholder while fetching
      tags: project.tags.join(", "),
      author: project.author || "Shivraj Soni",
      featured: project.featured || false,
    });

    try {
      // Fetch the full project data, including raw content
      const response = await fetch(`/api/admin/projects/${project.slug}`);
      if (!response.ok) {
        throw new Error("Failed to load project content for editing.");
      }
      const { project: fullProject } = await response.json();

      // The API returns the full raw MDX content.
      // We use gray-matter to parse it into data (frontmatter) and content (body).
      const { data, content } = matter(fullProject.content);

      // Update the form with the fetched data
      setFormData({
        title: data.title || "",
        excerpt: data.excerpt || "",
        tags: (data.tags || []).join(", "),
        author: data.author || "Shivraj Soni",
        featured: data.featured || false,
        liveLink: data.liveLink || "",
        content: content, // This is now just the markdown body
      });
    } catch (error) {
      console.error("Error loading project content:", error);
      alert("Error: Could not load project content for editing.");
      resetForm(); // Reset form on error
    }
  };

  // Handler for deleting a project
  const handleDeleteClick = async (slug: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(`/api/admin/projects/${slug}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Project deleted successfully!");
          loadProjects();
        } else {
          const result = await response.json();
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // Handler for submitting the create/update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = editingProject ? "PUT" : "POST";
    const url = editingProject
      ? `/api/admin/projects/${editingProject.slug}`
      : "/api/admin/projects";

    const body = JSON.stringify(formData);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "An unknown error occurred");
      }

      alert(
        `Project "${formData.title}" ${
          editingProject ? "updated" : "created"
        } successfully!`
      );
      resetForm();
      loadProjects();
    } catch (error) {
      console.error(
        `Error ${editingProject ? "updating" : "creating"} project:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Project Management
        </h1>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Create New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="excerpt">Excerpt</label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="tags">Tags (comma-separated)</label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="Next.js, React, Web Development"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="liveLink">Live Link</label>
                <Input
                  id="liveLink"
                  value={formData.liveLink}
                  onChange={(e) =>
                    setFormData({ ...formData, liveLink: e.target.value })
                  }
                  placeholder="https://my-project.com"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="content">Content (Markdown)</label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={15}
                  required
                  disabled={isSubmitting}
                  placeholder="# Your project content here..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: !!checked })
                  }
                  disabled={isSubmitting}
                />
                <label htmlFor="featured">Featured Project</label>
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingProject
                    ? "Update Project"
                    : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Existing Projects
        </h2>
        {isLoading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {project.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{project.date}</span>
                      <span>•</span>
                      <span>{project.readTime}</span>
                      {project.featured && (
                        <>
                          <span>•</span>
                          <span className="text-primary">Featured</span>
                        </>
                      )}
                    </div>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <div className="p-6 pt-0 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(project.slug)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectManagement;
