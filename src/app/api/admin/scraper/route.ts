import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

const parser = new Parser();

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
                            // Check if post exists
                            const exists = await db.post.findFirst({
                                where: { sourceUrl: item.link }
                            });

                            if (!exists) {
                                await db.post.create({
                                    data: {
                                        title: item.title,
                                        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now(),
                                        content: item.contentSnippet || item.content || "",
                                        excerpt: item.contentSnippet?.slice(0, 200) || "",
                                        sourceUrl: item.link,
                                        isPublished: true, // Auto publish or draft?
                                        authorId: session.user.id
                                    }
                                });
                                newPostsCount++;
                            }
                        }
                    }
                } catch (rssError) {
                    // Fallback to basic HTML scraping if RSS fails (very basic implementation)
                    const response = await fetch(source.url);
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    
                    // This is highly dependent on the target site structure. 
                    // For now, we'll try to find common article patterns or just skip.
                    // A proper implementation would need per-site selectors.
                    // For wowhead, we might look for specific classes.
                    
                    // Example generic scraper logic (simplified)
                    const elements = $('article, .news-post').toArray();
                    for (const el of elements) {
                        const $el = $(el as any);
                        const title = $el.find('h1, h2, .heading').first().text().trim();
                        const link = $el.find('a').first().attr('href');
                        const content = $el.find('p').first().text().trim();

                        if (title && link) {
                            const fullLink = link.startsWith('http') ? link : new URL(link, source.url).toString();
                            
                            const exists = await db.post.findFirst({
                                where: { sourceUrl: fullLink }
                            });

                            if (!exists) {
                                await db.post.create({
                                    data: {
                                        title: title,
                                        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now(),
                                        excerpt: content.slice(0, 200),
                                        content: content,
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
