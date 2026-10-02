import { unstable_cache } from "next/cache";
import { db } from "@/lib/prisma";

function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export type HomeGame = { slug: string; name: string; imageUrl: string | null; iconUrl: string | null; isHot: boolean; services: number; blurb: string };
export type HomeOffer = { id: number; name: string; slug: string; price: number; imageUrl: string | null; features: string[]; isHot: boolean; gameSlug: string; gameName: string };

// Everything the homepage shows, read on the server so search engines see it.
export const getHomeData = unstable_cache(
  async () => {
    const [games, services, gameCount] = await Promise.all([
      db.game.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 24,
        select: {
          slug: true,
          name: true,
          imageUrl: true,
          iconUrl: true,
          isHotOffer: true,
          description: true,
          _count: { select: { services: { where: { isActive: true } } } },
        },
      }),
      db.service.findMany({
        where: { isActive: true, game: { isActive: true } },
        orderBy: [{ isHotOffer: "desc" }, { createdAt: "desc" }],
        take: 60,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          imageUrl: true,
          features: true,
          isHotOffer: true,
          game: { select: { slug: true, name: true } },
        },
      }),
      db.game.count({ where: { isActive: true } }),
    ]);

    const homeGames: HomeGame[] = games.map((g) => ({
      slug: g.slug,
      name: g.name,
      imageUrl: g.imageUrl,
      iconUrl: g.iconUrl,
      isHot: g.isHotOffer,
      services: g._count.services,
      blurb: stripHtml(g.description).slice(0, 90),
    }));

    // Up to 8 offers per game, hot offers first.
    const offersByGame: Record<string, HomeOffer[]> = {};
    for (const s of services) {
      const list = (offersByGame[s.game.slug] ??= []);
      if (list.length >= 8) continue;
      list.push({
        id: s.id,
        name: s.name,
        slug: s.slug,
        price: Number.parseFloat(String(s.price)) || 0,
        imageUrl: s.imageUrl,
        features: Array.isArray(s.features) ? (s.features as unknown[]).map(String).slice(0, 3) : [],
        isHot: s.isHotOffer,
        gameSlug: s.game.slug,
        gameName: s.game.name,
      });
    }
    const offerTabs = homeGames.filter((g) => offersByGame[g.slug]?.length).map((g) => ({ slug: g.slug, name: g.name }));

    return { games: homeGames, gameCount, offersByGame, offerTabs };
  },
  ["home-data-v2"],
  { tags: ["games", "services"], revalidate: 300 }
);
