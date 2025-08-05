"use client";
import React, { useState, useEffect } from "react";
import type { BlogMeta as BlogMetaType } from "@/lib/blog-utils";

// Extend the BlogMeta type to optionally include the full content
interface BlogMeta extends BlogMetaType {
  content?: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<BlogMeta[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogMeta | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "Shivraj Soni",
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch all blogs
  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/blogs");
      if (response.ok) {
        const { blogs: fetchedBlogs } = await response.json();
        setBlogs(fetchedBlogs);
      } else {
        console.error("Failed to load blogs");
        alert("Error: Could not load blogs.");
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
      alert("An unexpected error occurred while loading blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load blogs on initial component mount
  useEffect(() => {
    loadBlogs();
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
    setEditingBlog(null);
    setShowCreateForm(false);
  };

  // Handler for clicking the "Edit" button
  const handleEditClick = async (blog: BlogMeta) => {
    setShowCreateForm(true);
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: "Loading content...", // Placeholder while fetching
      tags: blog.tags.join(", "),
      author: blog.author || "Shivraj Soni",
      featured: blog.featured || false,
    });

    try {
      const response = await fetch(`/api/admin/blogs/${blog.slug}`);
      if (!response.ok) throw new Error("Failed to load blog content");
      const { blog: fullBlog } = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        content: fullBlog.content || "",
      }));
    } catch (error) {
      console.error("Error loading blog content:", error);
      alert("Error: Could not load blog content for editing.");
      resetForm();
    }
  };

  // Handler for deleting a blog post
  const handleDeleteClick = async (slug: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(`/api/admin/blogs`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        if (response.ok) {
          alert("Blog post deleted successfully!");
          loadBlogs();
        } else {
          const result = await response.json();
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        //alert(`Error deleting blog: ${error.message}`);
      }
    }
  };

  // Handler for submitting the create/update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = editingBlog ? "PUT" : "POST";
    const body = editingBlog
      ? JSON.stringify({ ...formData, slug: editingBlog.slug })
      : JSON.stringify(formData);

    try {
      const response = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      // If the response is not OK, parse the JSON to get the error message.
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "An unknown error occurred");
      }

      // If the response is OK, no need to parse JSON for PUT/DELETE if they don't return a body.
      // But since our API *does* return a body, we can just proceed.
      alert(
        `Blog post "${formData.title}" ${
          editingBlog ? "updated" : "created"
        } successfully!`
      );
      resetForm();
      loadBlogs();
    } catch (error) {
      console.error(
        `Error ${editingBlog ? "updating" : "creating"} blog:`,
        error
      );
      //   alert(
      //     `Failed to ${editingBlog ? "update" : "create"} blog post: ${
      //       error.message
      //     }`
      //   );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <button
          onClick={() => {
            showCreateForm ? resetForm() : setShowCreateForm(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create New Blog"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                placeholder="# Your blog content here..."
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
                disabled={isSubmitting}
              />
              <label htmlFor="featured" className="text-sm text-foreground">
                Featured Post
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingBlog
                  ? "Update Blog Post"
                  : "Create Blog Post"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Existing Blogs
        </h2>
        {isLoading ? (
          <p>Loading blogs...</p>
        ) : (
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
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog.slug)}
                      className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
