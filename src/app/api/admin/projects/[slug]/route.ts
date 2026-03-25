import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/project-utils";
import {
  projectPostExists,
  updateProjectPost,
  deleteProjectPost,
  updateProjectFeatured,
} from "@/lib/file-operations";

import { checkRateLimit } from "@/lib/rate-limit";

// GET - Retrieve a single project post by slug
export async function GET(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
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

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: `Project with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // The content is already in HTML format from getProjectBySlug, but for editing,
    // we need the raw markdown. Let's re-read the file to get it.
    // NOTE: This is a simplified approach. In a real app, you might want a
    // function that returns the raw content directly.
    const { getProjectRawContent } = await import("@/lib/file-operations");
    const rawContent = getProjectRawContent(slug);

    if (rawContent === null) {
      return NextResponse.json(
        { error: "Could not load raw content for editing." },
        { status: 500 }
      );
    }

    const projectWithRawContent = {
      ...project,
      content: rawContent,
    };

    return NextResponse.json({ project: projectWithRawContent });
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing project post
export async function PUT(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
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

    const { title, excerpt, content, tags, author, featured, liveLink } =
      await request.json();

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    if (!projectPostExists(slug)) {
      return NextResponse.json(
        { error: `Project post with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
date: "${new Date().toISOString().split("T")[0]}"
tags: [${tags
      .split(",")
      //@ts-expect-error - tags is validated at runtime, but TS can't infer its type here
      .map((tag) => JSON.stringify(tag.trim()))
      .join(", ")}]
author: "${author}"
featured: ${featured}
${liveLink ? `liveLink: "${liveLink}"` : ""}
---

${content}`;

    try {
      updateProjectPost(slug, mdxContent);
      return NextResponse.json(
        { message: "Project updated successfully", slug },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { error: "Failed to update project post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error updating project ${slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update only the featured flag (for admin quick-toggle)
export async function PATCH(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  try {
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const featured = typeof body.featured === "boolean" ? body.featured : undefined;
    if (featured === undefined) {
      return NextResponse.json(
        { error: "Body must include featured: boolean" },
        { status: 400 }
      );
    }
    if (!projectPostExists(slug)) {
      return NextResponse.json(
        { error: `Project with slug "${slug}" not found` },
        { status: 404 }
      );
    }
    const success = updateProjectFeatured(slug, featured);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update featured" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      featured,
      message: featured ? "Project marked as featured" : "Project removed from featured",
    });
  } catch (error) {
    console.error(`Error PATCH project featured ${slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project post
export async function DELETE(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
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

    if (!projectPostExists(slug)) {
      return NextResponse.json(
        { error: `Project post with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    try {
      deleteProjectPost(slug);
      return NextResponse.json(
        { message: "Project deleted successfully" },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { error: "Failed to delete project post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error deleting project ${slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
