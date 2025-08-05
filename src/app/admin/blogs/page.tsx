"use client";
import React, { useState } from "react";
import type { BlogMeta } from "@/lib/blog-utils";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<BlogMeta[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "Shivraj Soni",
    featured: false,
  });

  // Load blogs on component mount
  React.useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetch("/api/admin/blogs");
        if (response.ok) {
          const { blogs: fetchedBlogs } = await response.json();
          setBlogs(fetchedBlogs);
        }
      } catch (error) {
        console.error("Error loading blogs:", error);
      }
    };
    loadBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Blog post "${formData.title}" created successfully!`);

        // Refresh the blogs list
        const blogsResponse = await fetch("/api/admin/blogs");
        if (blogsResponse.ok) {
          const { blogs: updatedBlogs } = await blogsResponse.json();
          setBlogs(updatedBlogs);
        }

        // Reset form and hide it
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          tags: "",
          author: "Shivraj Soni",
          featured: false,
        });
        setShowCreateForm(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog post. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create New Blog"}
        </button>
      </div>

      {/* Create Blog Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Create New Blog Post
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                rows={15}
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

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Create Blog Post
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Blogs List */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Existing Blogs
        </h2>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.slug}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground mb-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                    {blog.featured && (
                      <>
                        <span>•</span>
                        <span className="text-primary">Featured</span>
                      </>
                    )}
                  </div>
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
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
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
