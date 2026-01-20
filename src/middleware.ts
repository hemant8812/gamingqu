import { NextResponse, NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 30;

declare global {
  var __ipRateLimitMap__: Map<string, { windowStart: number; count: number }> | undefined;
}

function shouldBlockByIp(ip: string): boolean {
  const now = Date.now();
  globalThis.__ipRateLimitMap__ ??= new Map();
  const rec = globalThis.__ipRateLimitMap__.get(ip);
  if (!rec) {
    globalThis.__ipRateLimitMap__.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  if (now - rec.windowStart > RATE_LIMIT_WINDOW_MS) {
    rec.windowStart = now;
    rec.count = 1;
    globalThis.__ipRateLimitMap__.set(ip, rec);
    return false;
  }
  rec.count += 1;
  globalThis.__ipRateLimitMap__.set(ip, rec);
  return rec.count > RATE_LIMIT_MAX;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (
    req.method === "POST" &&
    (url.pathname.startsWith("/api/auth/") || url.pathname === "/api/register" || url.pathname.startsWith("/api/auth/register"))
  ) {
    const ipHeader = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ip = ipHeader.split(",")[0].trim();
    if (shouldBlockByIp(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/api/register"],
};
