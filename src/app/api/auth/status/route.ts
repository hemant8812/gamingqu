import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";

const Schema = z.object({ email: z.string().email().max(254) });

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
function normalizeEmail(email: string): string {
  return sanitize(email).toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const email = normalizeEmail(parsed.data.email);
    const user = await db.user.findUnique({ where: { email }, select: { id: true, isSuspended: true } });
    if (!user) {
      return NextResponse.json({ exists: false, isSuspended: false });
    }
    return NextResponse.json({ exists: true, isSuspended: !!user.isSuspended });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
