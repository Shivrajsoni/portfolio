"use client";
import React from "react";
import Link from "next/link";
import { Book, Briefcase, Trophy } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Welcome, Admin!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Management Card */}
        <Link
          href="/admin/blogs"
          className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <Book className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Blog Management
            </h2>
          </div>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog posts.
          </p>
        </Link>

        {/* Project Management Card */}
        <Link
          href="/admin/projects"
          className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Project Showcase
            </h2>
          </div>
          <p className="text-muted-foreground">
            Add and manage your portfolio projects.
          </p>
        </Link>

        {/* Proof of Work Card */}
        <Link
          href="/admin/proof-of-work"
          className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Proof of Work
            </h2>
          </div>
          <p className="text-muted-foreground">
            Showcase your achievements and certifications.
          </p>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Total Blogs
            </h3>
            <p className="text-4xl font-bold text-primary">2</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Total Projects
            </h3>
            <p className="text-4xl font-bold text-primary">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Certifications
            </h3>
            <p className="text-4xl font-bold text-primary">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
