import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getSimpleGamesCached = unstable_cache(
  async () => {
    try {
      return await db.game.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { slug: true, name: true, iconUrl: true },
      });
    } catch {
      return [];
    }
  },
  ["games-simple"],
  { tags: ["games"], revalidate: 1800 }
);

export async function GET() {
  try {
    const games = await getSimpleGamesCached();
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

