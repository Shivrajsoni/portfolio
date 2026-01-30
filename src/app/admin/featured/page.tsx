"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, FileText, FolderGit2, Trophy, Loader2 } from "lucide-react";

type ContentType = "blogs" | "projects" | "proof-of-work";

type BlogItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  featured?: boolean;
};

type ProjectItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  featured?: boolean;
};

type ProofOfWorkItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  featured?: boolean;
};

const FeaturedManagement = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [proofOfWork, setProofOfWork] = useState<ProofOfWorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toggling, setToggling] = useState<{ type: ContentType; slug: string } | null>(null);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [blogsRes, projectsRes, powRes] = await Promise.all([
        fetch("/api/admin/blogs"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/proof-of-work"),
      ]);
      if (blogsRes.ok) {
        const { blogs: b } = await blogsRes.json();
        setBlogs(b || []);
      }
      if (projectsRes.ok) {
        const { projects: p } = await projectsRes.json();
        setProjects(p || []);
      }
      if (powRes.ok) {
        const { proofOfWork: pow } = await powRes.json();
        setProofOfWork(pow || []);
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleFeatured = async (
    type: ContentType,
    slug: string,
    currentFeatured: boolean
  ) => {
    const base = "/api/admin";
    const url = `${base}/${type}/${encodeURIComponent(slug)}`;
    setToggling({ type, slug });
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (res.ok) {
        await loadAll();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update featured");
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to update featured");
    } finally {
      setToggling(null);
    }
  };

  const renderItem = (
    type: ContentType,
    item: { slug: string; title: string; excerpt: string; featured?: boolean },
    icon: React.ReactNode
  ) => {
    const featured = !!item.featured;
    const isToggling = toggling?.type === type && toggling?.slug === item.slug;
    return (
      <Card key={item.slug} className="flex flex-row items-center gap-4">
        <CardHeader className="flex-1 py-4 pr-0">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {icon}
            {item.title}
          </CardTitle>
          <CardContent className="p-0 pt-1 text-sm text-muted-foreground line-clamp-1">
            {item.excerpt}
          </CardContent>
        </CardHeader>
        <div className="p-4 pl-0 flex items-center">
          <Button
            variant={featured ? "default" : "outline"}
            size="icon"
            title={featured ? "Remove from featured" : "Add to featured"}
            onClick={() => toggleFeatured(type, item.slug, featured)}
            disabled={!!isToggling}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Star
                className={`h-4 w-4 ${featured ? "fill-current" : ""}`}
              />
            )}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Manage Featured
      </h1>
      <p className="text-muted-foreground mb-8">
        Toggle featured for any blog, project, or proof of work. Featured items
        appear on the homepage.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blogs
            </h2>
            <div className="space-y-3">
              {blogs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No blogs yet.</p>
              ) : (
                blogs.map((blog) =>
                  renderItem("blogs", blog, <FileText className="h-4 w-4 text-muted-foreground" />)
                )
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FolderGit2 className="h-5 w-5" />
              Projects
            </h2>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects yet.</p>
              ) : (
                projects.map((project) =>
                  renderItem(
                    "projects",
                    project,
                    <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                  )
                )
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Proof of Work
            </h2>
            <div className="space-y-3">
              {proofOfWork.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No proof of work entries yet.
                </p>
              ) : (
                proofOfWork.map((entry) =>
                  renderItem(
                    "proof-of-work",
                    entry,
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  )
                )
              )}
            </div>
          </section>
        </div>
      )}
    </motion.div>
  );
};

export default FeaturedManagement;
