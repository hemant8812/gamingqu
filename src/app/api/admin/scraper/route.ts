import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

const parser = new Parser();

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function imageFromArticle(link: string) {
    try {
        const artRes = await fetch(link);
        const artHtml = await artRes.text();
        const $$ = cheerio.load(artHtml);
        return $$('meta[property="og:image"]').attr('content') || $$('meta[name="twitter:image"]').attr('content') || $$('img').first().attr('src') || "";
    } catch {
        return "";
    }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    
    // Check if source already exists
    const existing = await db.scraperSource.findUnique({
        where: { url }
    });

    if (existing) {
        return NextResponse.json({ error: "Source already exists" }, { status: 400 });
    }

    // Basic validation to see if it's a valid URL
    new URL(url);

    const source = await db.scraperSource.create({
      data: {
        name: new URL(url).hostname,
        url,
      },
    });

    return NextResponse.json(source);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add source" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const sources = await db.scraperSource.findMany();
        return NextResponse.json(sources);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        
        // Check if this is a scrape trigger or an update
        if (body.action === "update") {
             const { id, url, interval } = body;
             if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

             await db.scraperSource.update({
                 where: { id },
                 data: {
                     url,
                     scrapeInterval: interval,
                     name: new URL(url).hostname
                 }
             });
             return NextResponse.json({ success: true });
        }

        // Existing scrape logic
        const sources = await db.scraperSource.findMany({ where: { isActive: true } });
        let newPostsCount = 0;
        const now = new Date();

        for (const source of sources) {
            // Check if it's time to scrape based on interval
            // Logic: if (now - lastRunAt) > interval * 60 * 1000
            // But for manual "Run Scraper Now" button, we might want to force run?
            // Let's assume this endpoint is called manually or by a cron job
            
            // Update lastRunAt
             await db.scraperSource.update({
                where: { id: source.id },
                data: { lastRunAt: now }
            });

            try {
                // Try RSS first
                try {
                    const feed = await parser.parseURL(source.url);
                    for (const item of feed.items) {
                        if (item.title && item.link) {
                            const exists = await db.post.findFirst({
                                where: { sourceUrl: item.link }
                            });

                            if (!exists) {
                                const slug = toSlug(item.title);
                                const dup = await db.post.findUnique({ where: { slug } });
                                if (dup) continue;
                                const ogImg = (item as any).enclosure?.url || "";
                                const img = ogImg || await imageFromArticle(item.link);
                                await db.post.create({
                                    data: {
                                        title: item.title,
                                        slug,
                                        content: item.contentSnippet || item.content || "",
                                        excerpt: item.contentSnippet?.slice(0, 200) || "",
                                        sourceUrl: item.link,
                                        imageUrl: img || undefined,
                                        isPublished: true, // Auto publish or draft?
                                        authorId: session.user.id
                                    }
                                });
                                newPostsCount++;
                            }
                        }
                    }
                } catch (rssError) {
                    const response = await fetch(source.url);
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    const host = new URL(source.url).hostname;
                    if (host.includes("news.blizzard.com")) {
                        const links = new Set<string>();
                        $('a[href]').each((_, el) => {
                            const href = $(el).attr('href') || "";
                            const text = $(el).text().trim();
                            if (!href) return;
                            if (!text) return;
                            const isWow = href.includes("/world-of-warcraft") || href.includes("/wow");
                            const isNews = href.includes("/en-us/news") || href.includes("/en-us/world-of-warcraft");
                            if (isWow || isNews) {
                                const fullLink = href.startsWith('http') ? href : new URL(href, source.url).toString();
                                links.add(fullLink);
                            }
                        });
                        for (const fullLink of links) {
                            const exists = await db.post.findFirst({ where: { sourceUrl: fullLink } });
                            if (exists) continue;
                            try {
                                const artRes = await fetch(fullLink);
                                const artHtml = await artRes.text();
                                const $$ = cheerio.load(artHtml);
                                const title = $$('h1').first().text().trim() || $$('meta[property="og:title"]').attr('content') || "";
                                const desc = $$('meta[name="description"]').attr('content') || $$('p').first().text().trim() || "";
                                if (!title) continue;
                                const slug = toSlug(title);
                                const dup = await db.post.findUnique({ where: { slug } });
                                if (dup) continue;
                                const ogImg = $$('meta[property="og:image"]').attr('content') || $$('meta[name="twitter:image"]').attr('content') || $$('img').first().attr('src') || "";
                                await db.post.create({
                                    data: {
                                        title,
                                        slug,
                                        excerpt: desc.slice(0, 200),
                                        content: desc,
                                        sourceUrl: fullLink,
                                        imageUrl: ogImg || undefined,
                                        isPublished: true,
                                        authorId: session.user.id
                                    }
                                });
                                newPostsCount++;
                            } catch {}
                        }
                    } else {
                        const elements = $('article, .news-post').toArray();
                        for (const el of elements) {
                            const $el = $(el as any);
                            const title = $el.find('h1, h2, .heading').first().text().trim();
                            const link = $el.find('a').first().attr('href');
                            const content = $el.find('p').first().text().trim();
                            if (title && link) {
                                const fullLink = link.startsWith('http') ? link : new URL(link, source.url).toString();
                                const exists = await db.post.findFirst({ where: { sourceUrl: fullLink } });
                                if (!exists) {
                                    const slug = toSlug(title);
                                    const dup = await db.post.findUnique({ where: { slug } });
                                    if (dup) continue;
                                    await db.post.create({
                                        data: {
                                            title,
                                            slug,
                                            excerpt: content.slice(0, 200),
                                            content,
                                            sourceUrl: fullLink,
                                            isPublished: true,
                                            authorId: session.user.id
                                        }
                                    });
                                    newPostsCount++;
                                }
                            }
                        }
                    }
                }

            } catch (sourceError) {
                console.error(`Error scraping ${source.url}:`, sourceError);
            }
        }

        return NextResponse.json({ success: true, newPosts: newPostsCount });

    } catch (error) {
        console.error("Scraping failed:", error);
        return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await db.scraperSource.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete source" }, { status: 500 });
    }
}
