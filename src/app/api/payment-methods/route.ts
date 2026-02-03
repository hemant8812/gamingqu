import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await db.paymentMethod.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 200,
      select: {
        slug: true,
        iconUrl: true,
        feePercent: true,
        feeFixed: true,
        sortOrder: true,
      },
    });
    const data = list.map((m) => ({
      slug: m.slug,
      iconUrl: m.iconUrl ?? null,
      feePercent: m.feePercent != null ? Number.parseFloat(m.feePercent.toString()) : null,
      feeFixed: m.feeFixed != null ? Number.parseFloat(m.feeFixed.toString()) : null,
      sortOrder: m.sortOrder ?? 0,
    }));
    return NextResponse.json({ ok: true, methods: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
