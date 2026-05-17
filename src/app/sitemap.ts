import type { MetadataRoute } from "next";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: SitemapEntry["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/cashback", priority: 0.5, changeFrequency: "monthly" },
  { path: "/work-with-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/trust-safety", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const [posts, games, services, pages] = await Promise.all([
    db.post
      .findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      })
      .catch(() => []),
    db.game
      .findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 1000,
      })
      .catch(() => []),
    db.service
      .findMany({
        where: { isActive: true, game: { isActive: true } },
        select: { slug: true, updatedAt: true, game: { select: { slug: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      })
      .catch(() => []),
    db.page
      .findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 1000,
      })
      .catch(() => []),
  ]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const gameEntries: MetadataRoute.Sitemap = games.map((g) => ({
    url: `${base}/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((sv) => ({
    url: `${base}/${sv.game.slug}/${sv.slug}`,
    lastModified: sv.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // CMS pages — exclude reserved slugs that are handled by other routes
  const reserved = new Set([
    "blog",
    "about",
    "contact",
    "cashback",
    "work-with-us",
    "trust-safety",
    "terms",
    "privacy",
    "refund",
    "cookies",
    "admin",
    "super-admin",
    "api",
    "dashboard",
    "booster",
    "checkout",
    "login",
    "register",
    "forgot",
    "post-login",
    "auth",
  ]);
  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((pg) => !reserved.has(pg.slug))
    .map((pg) => ({
      url: `${base}/${pg.slug}`,
      lastModified: pg.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...gameEntries, ...serviceEntries, ...blogEntries, ...pageEntries];
}
