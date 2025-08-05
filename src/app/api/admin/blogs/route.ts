import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createBlogPost,
  blogPostExists,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/file-operations";
import { getAllBlogs } from "@/lib/blog-utils";

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per 15 minutes

  const rateLimit = rateLimitMap.get(ip);

  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (rateLimit.count >= maxRequests) {
    return false;
  }

  rateLimit.count++;
  return true;
}

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

// PUT - Update an existing blog post
export async function PUT(request: NextRequest) {
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

    const { slug, title, excerpt, content, tags, author, featured } =
      await request.json();

    if (!slug || !title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Slug, title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    if (!blogPostExists(slug)) {
      return NextResponse.json(
        { error: `Blog post with slug "${slug}" not found` },
        { status: 404 }
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

    const success = updateBlogPost(slug, mdxContent);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update blog post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
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
