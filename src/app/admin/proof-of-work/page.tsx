"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProofOfWorkMeta as ProofOfWorkMetaType } from "@/lib/proof-of-work-utils";
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
import Link from "next/link";

// Extend the ProofOfWorkMeta type to optionally include the full content
interface ProofOfWorkMeta extends ProofOfWorkMetaType {
  content?: string;
}

const proofOfWorkTypes = ["oss", "bounty", "mentions"] as const;

type ProofOfWorkType = (typeof proofOfWorkTypes)[number];

const ProofOfWorkManagement = () => {
  const [proofOfWorkEntries, setProofOfWorkEntries] = useState<
    ProofOfWorkMeta[]
  >([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProofOfWork, setEditingProofOfWork] =
    useState<ProofOfWorkMeta | null>(null);
  type Type = {
    oss: string;
    bounty: string;
  };
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    type: "oss" as ProofOfWorkType,
    liveLink: "",
    organization: "",
    hardnessLevel: "",
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch all proof of work entries
  const loadProofOfWork = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/proof-of-work");
      if (response.ok) {
        const { proofOfWork } = await response.json();
        setProofOfWorkEntries(proofOfWork);
      } else {
        console.error("Failed to load proof of work entries");
        alert("Error: Could not load proof of work entries.");
      }
    } catch (error) {
      console.error("Error loading proof of work entries:", error);
      alert(
        "An unexpected error occurred while loading proof of work entries."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load proof of work entries on initial component mount
  useEffect(() => {
    loadProofOfWork();
  }, []);

  // Function to clear and reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      type: "oss" as ProofOfWorkType,
      tags: "",
      liveLink: "",
      organization: "",
      hardnessLevel: "",
      featured: false,
    });
    setEditingProofOfWork(null);
    setShowCreateForm(false);
  };

  // Handler for clicking the "Edit" button
  const handleEditClick = async (entry: ProofOfWorkMeta) => {
    setShowCreateForm(true);
    setEditingProofOfWork(entry);
    setFormData({
      title: entry.title,
      excerpt: entry.excerpt,
      content: "Loading content...", // Placeholder while fetching
      type: entry.type,
      tags: entry.tags.join(", "),
      liveLink: entry.liveLink || "",
      organization: entry.organization || "",
      hardnessLevel: entry.hardnessLevel || "",
      featured: entry.featured || false,
    });

    try {
      const response = await fetch(`/api/admin/proof-of-work/${entry.slug}`);
      if (!response.ok) throw new Error("Failed to load proof of work content");
      const { proofOfWork: fullEntry } = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        content: fullEntry.content || "",
      }));
    } catch (error) {
      console.error("Error loading proof of work content:", error);
      alert("Error: Could not load proof of work content for editing.");
      resetForm();
    }
  };

  // Handler for deleting a proof of work entry
  const handleDeleteClick = async (slug: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this proof of work entry? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(`/api/admin/proof-of-work/${slug}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Proof of work entry deleted successfully!");
          loadProofOfWork();
        } else {
          const result = await response.json();
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error deleting proof of work entry:", error);
      }
    }
  };

  // Handler for submitting the create/update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = editingProofOfWork ? "PUT" : "POST";
    const url = editingProofOfWork
      ? `/api/admin/proof-of-work/${editingProofOfWork.slug}`
      : "/api/admin/proof-of-work";

    const body = JSON.stringify({
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    });

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
        `Proof of work entry "${formData.title}" ${editingProofOfWork ? "updated" : "created"
        } successfully!`
      );
      resetForm();
      loadProofOfWork();
    } catch (error: unknown) {
      console.error(
        `Error ${editingProofOfWork ? "updating" : "creating"
        } proof of work entry:`,
        error
      );
      alert(
        `Failed to ${editingProofOfWork ? "update" : "create"
        } proof of work entry: ${error instanceof Error ? error.message : "An unknown error occurred"
        }`
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
          Proof of Work Management
        </h1>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingProofOfWork
                  ? "Edit Proof of Work Entry"
                  : "Create New Proof of Work Entry"}
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
                <label htmlFor="type">Type</label>
                <Textarea
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="liveLink">Live Link (URL)</label>
                <Input
                  id="liveLink"
                  value={formData.liveLink}
                  onChange={(e) =>
                    setFormData({ ...formData, liveLink: e.target.value })
                  }
                  type="url"
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="organization">Organization</label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="hardnessLevel">Hardness Level</label>
                <Input
                  id="hardnessLevel"
                  value={formData.hardnessLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, hardnessLevel: e.target.value })
                  }
                  placeholder="Easy, Medium, Hard"
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
                  placeholder="Next.js, Open Source, Contribution"
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
                  placeholder="# Details of your contribution here..."
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
                <label htmlFor="featured">Featured Entry</label>
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingProofOfWork
                      ? "Update Entry"
                      : "Create Entry"}
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
          Existing Proof of Work Entries
        </h2>
        {isLoading ? (
          <p>Loading proof of work entries...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofOfWorkEntries.map((entry) => (
              <motion.div
                key={entry.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold leading-tight truncate">
                      {entry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {entry.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                      <span>{entry.date}</span>
                      <span>•</span>
                      <span>{entry.readTime}</span>
                      {entry.organization && (
                        <>
                          <span>•</span>
                          <span>{entry.organization}</span>
                        </>
                      )}
                      {entry.hardnessLevel && (
                        <>
                          <span>•</span>
                          <span>{entry.hardnessLevel}</span>
                        </>
                      )}
                      {entry.featured && (
                        <>
                          <span>•</span>
                          <span className="text-primary font-medium">
                            Featured
                          </span>
                        </>
                      )}
                    </div>
                    {entry.liveLink && (
                      <p className="text-sm text-blue-500 hover:underline mt-2">
                        <a
                          href={entry.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Live Project
                        </a>
                      </p>
                    )}
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.tags.map((tag) => (
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
                      onClick={() => handleEditClick(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(entry.slug)}
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

export default ProofOfWorkManagement;
