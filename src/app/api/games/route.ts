import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

const getHomeGamesCached = unstable_cache(
  async () => {
    const [items, total] = await Promise.all([
      db.game.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 12,
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
    return { items: data, total };
  },
  ["games-home"],
  { tags: ["games"], revalidate: 600 }
);

export async function GET() {
  try {
    const { items, total } = await getHomeGamesCached();
    return NextResponse.json({ items, total });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

