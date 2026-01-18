import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.AUTH_SECRET })) as JWT | null;
  const role = token?.role;
  const url = req.nextUrl;

  if (url.pathname.startsWith("/admin")) {
    if (!role || (role !== "ADMIN" && role !== "SUPERADMIN")) {
      return NextResponse.redirect(new URL("/login", url));
    }
  }

  if (url.pathname.startsWith("/super-admin")) {
    if (role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/login", url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*"],
};
