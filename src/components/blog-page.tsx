"use client";
import React from "react";
import type { BlogPost } from "@/lib/blog-utils";
import Link from "next/link";

interface BlogPageProps {
  blog: BlogPost;
}

const BlogPage = ({ blog }: BlogPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Back to Blogs
        </Link>

        {/* Blog Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>{blog.date}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
            {blog.author && (
              <>
                <span>•</span>
                <span>By {blog.author}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {blog.excerpt}
          </p>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © 2025 Shivraj Soni. All rights reserved.
            </div>
            <Link
              href="/blog"
              className="text-sm text-primary hover:opacity-80 transition-colors"
            >
              ← Back to Blogs
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogPage;
