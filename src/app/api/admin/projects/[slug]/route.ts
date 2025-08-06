import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/project-utils";
import {
  projectPostExists,
  updateProjectPost,
  deleteProjectPost,
} from "@/lib/file-operations";

import { checkRateLimit } from "@/lib/rate-limit";

// GET - Retrieve a single project post by slug
export async function GET(
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

    const { slug } = params;
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
    console.error(`Error fetching project ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing project post
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

    const slug = params.slug;
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
      //@ts-ignore
      .map((tag) => `"${tag.trim()}"`)
      .join(", ")}]
author: "${author}"
featured: ${featured}
---

${content}`;

    try {
      updateProjectPost(slug, mdxContent);
      return NextResponse.json(
        { message: "Project updated successfully", slug },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update project post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error updating project ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project post
export async function DELETE(
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

    const slug = params.slug;
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
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete project post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error deleting project ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
