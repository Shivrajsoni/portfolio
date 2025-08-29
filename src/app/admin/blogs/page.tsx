"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogMeta as BlogMetaType } from "@/lib/blog-utils";
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
        const response = await fetch(`/api/admin/blogs/${slug}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Blog post deleted successfully!");
          loadBlogs();
        } else {
          const result = response.body ? await response.json() : { error: "An unknown error occurred." };
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  // Handler for submitting the create/update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = editingBlog ? "PUT" : "POST";
    const url = editingBlog
      ? `/api/admin/blogs/${editingBlog.slug}`
      : "/api/admin/blogs";

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
        `Blog post "${formData.title}" ${editingBlog ? "updated" : "created"
        } successfully!`
      );
      resetForm();
      loadBlogs();
    } catch (error) {
      console.error(
        `Error ${editingBlog ? "updating" : "creating"} blog:`,
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
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Blog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
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
                  placeholder="# Your blog content here..."
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
                <label htmlFor="featured">Featured Post</label>
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingBlog
                      ? "Update Blog Post"
                      : "Create Blog Post"}
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
          Existing Blogs
        </h2>
        {isLoading ? (
          <p>Loading blogs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
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
                      <div className="flex flex-wrap gap-2 mt-4">
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
                  </CardContent>
                  <div className="p-6 pt-0 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(blog.slug)}
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

export default BlogManagement;
