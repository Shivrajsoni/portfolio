import { NextResponse } from "next/server";
import {
  getAllProofOfWork,
  createProofOfWork,
  getProofOfWorkBySlug,
} from "@/lib/proof-of-work-utils";

export async function GET() {
  try {
    const proofOfWork = await getAllProofOfWork();
    return NextResponse.json({ proofOfWork });
  } catch (error: any) {
    console.error("Error fetching proof of work:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch proof of work" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Basic validation
    if (
      !data.title ||
      !data.content ||
      !data.excerpt ||
      !data.tags ||
      !data.type
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (title, content, excerpt, tags, type)",
        },
        { status: 400 }
      );
    }

    const newProofOfWork = await createProofOfWork(data);
    return NextResponse.json(newProofOfWork, { status: 201 });
  } catch (error: any) {
    console.error("Error creating proof of work:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create proof of work" },
      { status: 500 }
    );
  }
}
