import { NextResponse } from "next/server";
import { PROJECT_TAGS, BLOG_TAGS } from "@/lib/tags";

export async function GET() {
  return NextResponse.json({ projectTags: PROJECT_TAGS, blogTags: BLOG_TAGS });
}
