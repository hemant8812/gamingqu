import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await db.banner.findMany({
      where: { isActive: true },
      select: { title: true, subtitle: true, buttonLink: true, buttonImageUrl: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 10,
    });
    return NextResponse.json({ ok: true, banners: list });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
