import { db } from "@/lib/prisma";

export async function getSimpleGames() {
  try {
    return await db.game.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  } catch {
    return [];
  }
}

export async function getSimpleCategories() {
  try {
    return await db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, gameId: true } });
  } catch {
    return [];
  }
}
