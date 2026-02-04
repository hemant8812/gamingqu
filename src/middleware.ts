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

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
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

  const nonce = generateNonce();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isDev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    `connect-src 'self' https: wss:`,
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""} https://static.cloudflareinsights.com https://www.googletagmanager.com https://client.crisp.chat https://embed.tawk.to https://*.tawk.to https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://adservice.google.com`,
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nonce", nonce);

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/auth/:path*",
    "/api/register",
  ],
};
