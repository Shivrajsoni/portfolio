import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProjectPost, projectPostExists } from "@/lib/file-operations";
import { getAllProjects } from "@/lib/project-utils";

import { checkRateLimit } from "@/lib/rate-limit";
// POST - Create a new project post
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

    if (projectPostExists(slug)) {
      return NextResponse.json(
        { error: `Project post with title \"${title}\" already exists` },
        { status: 409 }
      );
    }

    const mdxContent = `---
title: "${title.replace(/"/g, '"')}"
excerpt: "${excerpt.replace(/"/g, '"')}"
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
      createProjectPost(slug, mdxContent);
      return NextResponse.json(
        { message: "Project created successfully", slug },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create project post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Retrieve all project posts
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
