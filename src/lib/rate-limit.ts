// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per 15 minutes

  const rateLimit = rateLimitMap.get(ip);

  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (rateLimit.count >= maxRequests) {
    return false;
  }

  rateLimit.count++;
  return true;
}
