import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getProofOfWorkBySlug,
  updateProofOfWork,
  updateProofOfWorkFeatured,
  deleteProofOfWork,
} from "@/lib/proof-of-work-utils";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const proofOfWork = await getProofOfWorkBySlug(slug);

    if (!proofOfWork) {
      return NextResponse.json({ error: "Proof of Work not found" }, { status: 404 });
    }

    return NextResponse.json({ proofOfWork });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch proof of work";
    console.error("Error fetching proof of work by slug:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.content || !data.excerpt || !data.tags || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields (title, content, excerpt, tags, type)" },
        { status: 400 }
      );
    }

    const updatedProofOfWork = await updateProofOfWork(slug, data);
    return NextResponse.json(updatedProofOfWork);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update proof of work";
    console.error("Error updating proof of work:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PATCH - Update only the featured flag (for admin quick-toggle)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = request.cookies.get("adminToken")?.value || null;
    if (!isAdminAuthenticated(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = params;
    const body = await request.json();
    const featured = typeof body.featured === "boolean" ? body.featured : undefined;
    if (featured === undefined) {
      return NextResponse.json(
        { error: "Body must include featured: boolean" },
        { status: 400 }
      );
    }
    const success = await updateProofOfWorkFeatured(slug, featured);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update featured or entry not found" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      featured,
      message: featured ? "Entry marked as featured" : "Entry removed from featured",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";
    console.error("Error PATCH proof of work featured:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await deleteProofOfWork(slug);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete proof of work";
    console.error("Error deleting proof of work:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
