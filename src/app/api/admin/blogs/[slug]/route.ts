import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBlogBySlug } from "@/lib/blog-utils";
import { deleteBlogPost, updateBlogPost, blogPostExists } from "@/lib/file-operations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error(`Error fetching blog ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = deleteBlogPost(params.slug);

    if (success) {
      return new NextResponse(null, { status: 204 });
    } else {
      return NextResponse.json(
        { error: "Failed to delete blog post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error deleting blog ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    if (!blogPostExists(params.slug)) {
      return NextResponse.json(
        { error: `Blog post with slug "${params.slug}" not found` },
        { status: 404 }
      );
    }

    const mdxContent = `---
title: "${title.replace(/"/g, '"')}"
date: "${new Date().toISOString().split("T")[0]}"
excerpt: "${excerpt.replace(/"/g, '"')}"
tags: [${(tags || "")
      .split(",")
      .map((tag: string) => `"${tag.trim()}"`) 
      .join(", ")}]
author: "${(author || "Shivraj Soni").replace(/"/g, '"')}"
featured: ${featured || false}
---

${content}`;

    const success = updateBlogPost(params.slug, mdxContent);

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
    console.error(`Error updating blog post ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
