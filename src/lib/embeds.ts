import { db } from "./prisma";
import { unstable_cache } from "next/cache";

export const getEmbeds = unstable_cache(
  async () => {
    try {
      const embeds = await db.embedCode.findMany({
        where: { isActive: true },
        select: { id: true, code: true, placement: true },
        orderBy: { createdAt: "asc" },
      });
      return embeds;
    } catch {
      return [];
    }
  },
  ["embeds-list"],
  { tags: ["embeds"], revalidate: 3600 }
);
