import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  return await res.text();
}

function collectLinks($: cheerio.CheerioAPI, base: string) {
  const links = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href) return;
    const link = href.startsWith("http") ? href : new URL(href, base).toString();
    try {
      const u = new URL(link);
      const hostOk = u.hostname.includes("blizzard.com");
      const wowOk =
        u.pathname.includes("/world-of-warcraft") ||
        u.hostname.includes("worldofwarcraft.blizzard.com");
      if (hostOk && wowOk) {
        links.add(u.toString());
      }
    } catch {
      /* ignore */
    }
  });
  return Array.from(links);
}

export async function GET() {
  try {
    const sources = [
      "https://worldofwarcraft.blizzard.com/en-us/news",
      "https://news.blizzard.com/en-us/world-of-warcraft",
    ];
    const items: Array<{ title: string; excerpt: string; link: string; date?: string }> = [];
    const seen = new Set<string>();
    for (const src of sources) {
      const html = await fetchHtml(src);
      const $ = cheerio.load(html);
      const links = collectLinks($, src);
      for (const link of links) {
        if (seen.has(link)) continue;
        try {
          const artHtml = await fetchHtml(link);
          const $$ = cheerio.load(artHtml);
          const title =
            $$("h1").first().text().trim() ||
            $$('meta[property="og:title"]').attr("content") ||
            $$("title").text().trim() ||
            "";
          const excerpt =
            $$('meta[name="description"]').attr("content") ||
            $$("p").first().text().trim() ||
            "";
          if (title) {
            seen.add(link);
            items.push({ title, excerpt, link });
          }
        } catch {
          /* ignore article errors */
        }
        if (items.length >= 10) break;
      }
      if (items.length >= 10) break;
    }
    return NextResponse.json({ count: items.length, items });
  } catch {
    return NextResponse.json({ count: 0, items: [] });
  }
}
