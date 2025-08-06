import { NextResponse } from "next/server";
import {
  getProofOfWorkBySlug,
  updateProofOfWork,
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
  } catch (error: any) {
    console.error("Error fetching proof of work by slug:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch proof of work" },
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
    if (!data.title || !data.content || !data.excerpt || !data.tags) {
      return NextResponse.json(
        { error: "Missing required fields (title, content, excerpt, tags)" },
        { status: 400 }
      );
    }

    const updatedProofOfWork = await updateProofOfWork(slug, data);
    return NextResponse.json(updatedProofOfWork);
  } catch (error: any) {
    console.error("Error updating proof of work:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update proof of work" },
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
  } catch (error: any) {
    console.error("Error deleting proof of work:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete proof of work" },
      { status: 500 }
    );
  }
}
