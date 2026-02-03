import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const where = q
      ? {
          isActive: true,
          OR: [
            { name: { contains: q } },
            { slug: { startsWith: q } },
            { slug: { contains: q } },
          ],
        }
      : { isActive: true };
    const services = await db.service.findMany({
      where,
      orderBy: [{ isHotOffer: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        game: { select: { slug: true, name: true } },
      },
    });
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
