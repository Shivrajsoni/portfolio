"use client";
import React, { useState } from "react";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "Shivraj Soni",
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you'd send this to an API endpoint
    // For now, we'll just log it and show how to create the MDX file
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const mdxContent = `---
title: "${formData.title}"
date: "${new Date().toISOString().split("T")[0]}"
excerpt: "${formData.excerpt}"
tags: [${formData.tags
      .split(",")
      .map((tag) => `"${tag.trim()}"`)
      .join(", ")}]
author: "${formData.author}"
featured: ${formData.featured}
---

${formData.content}`;

    console.log("Generated MDX content:");
    console.log(mdxContent);
    console.log("File should be saved as:", `src/content/blog/${slug}.mdx`);

    alert(
      `Blog post "${formData.title}" created! Check the console for the MDX content.`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Create New Blog Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              required
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Next.js, React, Web Development"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Content (Markdown)
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              rows={20}
              required
              placeholder="# Your blog content here...

## Introduction

Write your blog content in Markdown format.

### Code Example

```javascript
console.log('Hello, World!');
```

## Conclusion

End your blog post here."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="rounded border-border"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured Post
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Create Blog Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
