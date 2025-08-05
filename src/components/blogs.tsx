"use client";
import React from "react";
import Link from "next/link";
import type { BlogMeta } from "@/lib/blog-utils";

interface BlogsProps {
  initialBlogs: BlogMeta[];
}

const Blogs = ({ initialBlogs }: BlogsProps) => {
  const blogs = initialBlogs || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blogs</h1>
          {/* <p className="text-muted-foreground text-lg">
            Thoughts, ideas, and insights on technology and development.
          </p> */}
        </div>

        <div className="space-y-8">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blogs found.</p>
            </div>
          ) : (
            blogs.map((blog) => (
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
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
                        >
                          {tag}
                        </span>
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
