import type { MetadataRoute } from "next";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cashback`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
  let posts: MetadataRoute.Sitemap = [];
  let games: MetadataRoute.Sitemap = [];
  let services: MetadataRoute.Sitemap = [];
  try {
    const items = await db.post.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
    posts = items.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {}
  try {
    const gs = await db.game.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
    games = gs.map((g) => ({
      url: `${base}/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {}
  try {
    const ss = await db.service.findMany({
      where: { isActive: true, game: { isActive: true } },
      select: { slug: true, updatedAt: true, game: { select: { slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
    services = ss.map((s) => ({
      url: `${base}/${s.game.slug}/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {}
  return [...staticRoutes, ...games, ...services, ...posts];
}
