import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, generateAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Verify admin password using centralized function
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
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
