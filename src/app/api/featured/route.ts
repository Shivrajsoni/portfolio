import { NextResponse } from "next/server";
import { getFeaturedBlogs } from "@/lib/blog-utils";
import { getFeaturedProjects } from "@/lib/project-utils";
import { getFeaturedProofOfWork } from "@/lib/proof-of-work-utils";

export async function GET() {
  try {
    const [blogs, projects, proofOfWork] = await Promise.all([
      getFeaturedBlogs(),
      getFeaturedProjects(),
      getFeaturedProofOfWork(),
    ]);
    return NextResponse.json({ blogs, projects, proofOfWork });
  } catch (error) {
    console.error("Error fetching featured content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
