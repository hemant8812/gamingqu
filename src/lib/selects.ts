import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getSimpleGames = unstable_cache(
  async () => {
    try {
      return await db.game.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
    } catch {
      return [];
    }
  },
  ["simple-games"],
  { tags: ["games"], revalidate: 3600 }
);

export const getSimpleCategories = unstable_cache(
  async () => {
    try {
      return await db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, gameId: true } });
    } catch {
      return [];
    }
  },
  ["simple-categories"],
  { tags: ["categories"], revalidate: 3600 }
);

