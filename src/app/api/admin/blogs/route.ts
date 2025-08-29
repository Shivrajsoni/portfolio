import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createBlogPost,
  blogPostExists,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/file-operations";
import { getAllBlogs } from "@/lib/blog-utils";

import { checkRateLimit } from "@/lib/rate-limit";

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, excerpt, content, tags, author, featured } =
      await request.json();

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (blogPostExists(slug)) {
      return NextResponse.json(
        { error: `Blog post with title "${title}" already exists` },
        { status: 409 }
      );
    }

    const mdxContent = `---
title: "${title.replace(/"/g, '"')}"
date: "${new Date().toISOString().split("T")[0]}"
excerpt: "${excerpt.replace(/"/g, '"')}"
tags: [${(tags || "")
      .split(",")
      .map((tag: string) => `"${tag.trim()}"`) // Corrected: Ensure tags are properly quoted within the array
      .join(", ")}]
author: "${(author || "Shivraj Soni").replace(/"/g, '"')}"
featured: ${featured || false}
---

${content}`;

    const success = createBlogPost(slug, mdxContent);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to create blog post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully",
      slug,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Retrieve all blog posts
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blogs = await getAllBlogs();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



// DELETE - Delete a blog post
export async function DELETE(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (!blogPostExists(slug)) {
      return NextResponse.json(
        { error: `Blog post with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    const success = deleteBlogPost(slug);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete blog post" },
        { status: 500 }
      );
    }

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
