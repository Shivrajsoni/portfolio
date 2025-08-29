"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogMeta } from "@/lib/blog-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface BlogsProps {
  initialBlogs: BlogMeta[];
}

const Blogs = ({ initialBlogs }: BlogsProps) => {
  const [allBlogs] = useState<BlogMeta[]>(initialBlogs || []);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogMeta[]>(initialBlogs || []);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await fetch("/api/tags");
        if (tagsResponse.ok) {
          const { blogTags } = await tagsResponse.json();
          setTags(["All", ...blogTags]);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  const filterBlogs = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      setFilteredBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter((blog) => blog.tags.includes(tag));
      setFilteredBlogs(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blogs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blogs</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-muted-foreground mr-2">Filter by:</span>
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "ghost"}
              size="sm"
              onClick={() => filterBlogs(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blogs found.</p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <article
                key={blog.slug}
                className="group border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <Link href={`/blog/${blog.slug}`} className="block">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
