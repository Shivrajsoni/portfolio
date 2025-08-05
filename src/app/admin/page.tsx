"use client";
import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Management Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Blog Management
          </h2>
          <p className="text-muted-foreground mb-4">
            Create, edit, and manage your blog posts.
          </p>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Blogs
          </Link>
        </div>

        {/* Project Management Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Project Showcase
          </h2>
          <p className="text-muted-foreground mb-4">
            Add and manage your portfolio projects.
          </p>
          <Link
            href="/admin/projects"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Projects
          </Link>
        </div>

        {/* Proof of Work Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Proof of Work
          </h2>
          <p className="text-muted-foreground mb-4">
            Showcase your achievements and certifications.
          </p>
          <Link
            href="/admin/proof-of-work"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Proof of Work
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Total Blogs
          </h3>
          <p className="text-3xl font-bold text-primary">2</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Total Projects
          </h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Certifications
          </h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
