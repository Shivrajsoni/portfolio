import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, generateAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { adminId, password } = await request.json();

    // Verify admin credentials using centralized function
    if (!verifyAdminCredentials(adminId, password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate admin token
    const token = generateAdminToken();

    // Set HTTP-only cookie for better security
    const response = NextResponse.json({ success: true });
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
