import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function GET() {
  try {
    const [items, total] = await Promise.all([
      db.game.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
          iconUrl: true,
          isHotOffer: true,
        },
      }),
      db.game.count({ where: { isActive: true } }),
    ]);
    const data = items.map((g) => ({
      slug: g.slug,
      title: g.name,
      subtitle: stripHtml(g.description) || (g.isHotOffer ? "Hot Offer" : ""),
      imageUrl: g.imageUrl ?? null,
      iconUrl: g.iconUrl ?? null,
      isHotOffer: g.isHotOffer,
    }));
    return NextResponse.json({ items: data, total });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

