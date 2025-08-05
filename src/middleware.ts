import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, path: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  // Different limits for different endpoints
  const limits: Record<string, number> = {
    "/api/admin/login": 5, // 5 login attempts per 15 minutes
    "/api/admin/blogs": 20, // 20 blog operations per 15 minutes
    default: 100, // 100 requests per 15 minutes for other endpoints
  };

  const maxRequests = limits[path] || limits.default;
  const key = `${ip}:${path}`;

  const rateLimit = rateLimitMap.get(key);

  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (rateLimit.count >= maxRequests) {
    return false;
  }

  rateLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const path = request.nextUrl.pathname;

  // Rate limiting for API routes
  if (path.startsWith("/api/")) {
    if (!checkRateLimit(ip, path)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }
  // Admin route protection (except login)
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
