import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Logged-in boosters only see the booster panel and info pages, never the
// shop (prices, games, services, checkout).
const BOOSTER_ALLOWED = [
  "/booster", "/login", "/register", "/post-login", "/auth", "/contact", "/trust-safety",
  "/about", "/blog", "/work-with-us", "/terms", "/privacy", "/refund", "/cookies",
  "/uploads", "/brand", "/icons", "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/manifest.webmanifest",
];
const BOOSTER_BLOCKED_API = ["/api/checkout", "/api/orders/pay"];

function startsWithAny(path: string, list: string[]) {
  return list.some((p) => path === p || path.startsWith(`${p}/`));
}

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

  // Allow NextAuth providers endpoint; required by signIn("google") on client

  // Enforce canonical domain/scheme in production
  const isDev = process.env.NODE_ENV !== "production";
  const canonicalRaw = process.env.NEXT_PUBLIC_SITE_URL;
  const canonical = canonicalRaw ? canonicalRaw.trim().replace(/^`+|`+$/g, "") : undefined;
  if (!isDev && canonical) {
    try {
      const target = canonical.includes("://") ? new URL(canonical) : new URL(`https://${canonical}`);
      const targetHostname = target.hostname;
      const forwardedHost = (req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname).split(",")[0].trim();
      if (forwardedHost !== targetHostname) {
        const redirectUrl = new URL(url.toString());
        redirectUrl.hostname = targetHostname;
        redirectUrl.port = "";
        return NextResponse.redirect(redirectUrl, { status: 308 });
      }
    } catch {
      /* ignore invalid canonical */
    }
  }

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

  const token = await getToken({ req, secret: process.env.AUTH_SECRET }).catch(() => null);
  if ((token as { role?: string } | null)?.role === "BOOSTER") {
    const path = url.pathname;
    if (path.startsWith("/api/")) {
      if (startsWithAny(path, BOOSTER_BLOCKED_API)) {
        return NextResponse.json({ error: "Boosters cannot place orders" }, { status: 403 });
      }
    } else if (!startsWithAny(path, BOOSTER_ALLOWED)) {
      return NextResponse.redirect(new URL("/booster", req.url));
    }
  }

  const nonceCookieName = "__csp_nonce";
  const nonceCookieExisting = isDev ? req.cookies.get(nonceCookieName)?.value : undefined;
  const nonce = isDev ? (nonceCookieExisting || generateNonce()) : generateNonce();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isDev && !nonceCookieExisting) {
    res.cookies.set(nonceCookieName, nonce, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60,
    });
  }

  // ── Content-Security-Policy ───────────────────────────────
  // Trusted host allowlist for analytics, ads, and chat widgets.
  // Browsers that honor 'strict-dynamic' will ignore the host list and
  // 'unsafe-inline'; both are kept for legacy browser fallback.
  const scriptHosts = [
    "https://static.cloudflareinsights.com",
    "https://*.googletagmanager.com",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://www.google-analytics.com",
    "https://ssl.google-analytics.com",
    "https://client.crisp.chat",
    "https://embed.tawk.to",
    "https://*.tawk.to",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    "https://adservice.google.com",
    "https://*.doubleclick.net",
    "https://cdn.jsdelivr.net",
  ].join(" ");

  const devExtras = isDev ? " 'unsafe-inline' 'unsafe-eval'" : "";

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
    "img-src 'self' data: blob: https:",
    "style-src 'self' 'unsafe-inline' https://client.crisp.chat https://fonts.googleapis.com https://*.tawk.to",
    "style-src-elem 'self' 'unsafe-inline' https://client.crisp.chat https://fonts.googleapis.com https://*.tawk.to",
    "font-src 'self' data: https://client.crisp.chat https://fonts.gstatic.com https://*.tawk.to",
    "frame-src 'self' https://*.tawk.to https://embed.tawk.to https://*.crisp.chat https://www.googletagmanager.com https://td.doubleclick.net https://*.doubleclick.net",
    "connect-src 'self' https: wss:",
    `script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' ${scriptHosts}`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${scriptHosts}`,
    "worker-src 'self' blob:",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nonce", nonce);
  if (!isDev) {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    const ttReportOnly = (process.env.NEXT_PUBLIC_TT_REPORT_ONLY || process.env.TT_REPORT_ONLY || "").trim() === "1";
    if (ttReportOnly) {
      res.headers.set("Content-Security-Policy-Report-Only", "require-trusted-types-for 'script'");
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/auth/:path*",
    "/api/register",
  ],
};
