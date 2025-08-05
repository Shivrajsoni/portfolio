import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createBlogPost, blogPostExists } from "@/lib/file-operations";

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 10 requests per 15 minutes

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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
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

    // Check authentication
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, excerpt, content, tags, author, featured } =
      await request.json();

    // Validate required fields
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if blog post already exists
    if (blogPostExists(slug)) {
      return NextResponse.json(
        { error: `Blog post with title "${title}" already exists` },
        { status: 409 }
      );
    }

    // Create MDX content with proper escaping
    const escapedExcerpt = excerpt.replace(/"/g, '\\"');
    const escapedTitle = title.replace(/"/g, '\\"');
    const escapedAuthor = (author || "Shivraj Soni").replace(/"/g, '\\"');

    const mdxContent = `---
title: "${escapedTitle}"
date: "${new Date().toISOString().split("T")[0]}"
excerpt: "${escapedExcerpt}"
tags: [${tags
      .split(",")
      .map((tag: string) => `"${tag.trim()}"`)
      .join(", ")}]
author: "${escapedAuthor}"
featured: ${featured || false}
---

${content}`;

    console.log("Creating blog post with content:", mdxContent);

    // Create the blog post file
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
      filePath: `src/content/blog/${slug}.mdx`,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Import getAllBlogs dynamically to avoid server/client issues
    const { getAllBlogs } = await import("@/lib/blog-utils");
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
