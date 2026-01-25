import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";

export async function GET() {
  const base = getBaseUrl();
  try {
    const items = await db.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true, excerpt: true, createdAt: true, imageUrl: true },
      take: 50,
    });
    const rssItems = items
      .map((p) => {
        const link = `${base}/blog/${p.slug}`;
        const desc = p.excerpt ?? p.title;
        return `
<item>
  <title>${escapeXml(p.title)}</title>
  <link>${link}</link>
  <guid>${link}</guid>
  <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
  <description>${escapeXml(desc)}</description>
</item>`;
      })
      .join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Gamingqu Blog</title>
    <link>${base}/blog</link>
    <description>Latest blog posts</description>
    ${rssItems}
  </channel>
</rss>`;
    return new NextResponse(xml, {
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
