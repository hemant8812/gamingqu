import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";

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
    } catch {}
  });
  return Array.from(links);
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function downloadImageToPublic(imageUrl: string, base: string, nameHint: string) {
  try {
    const abs = imageUrl.startsWith("http") ? imageUrl : new URL(imageUrl, base).toString();
    const res = await fetch(abs);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    let ext = "jpg";
    if (ct.includes("png")) ext = "png";
    else if (ct.includes("webp")) ext = "webp";
    else if (ct.includes("jpeg")) ext = "jpg";
    else if (ct.includes("gif")) ext = "gif";
    const dir = path.join(process.cwd(), "public", "uploads", "blog");
    fs.mkdirSync(dir, { recursive: true });
    const u = new URL(abs);
    const baseName = toSlug(nameHint || path.basename(u.pathname).split(".")[0]) || "image";
    const file = `${baseName}.${ext}`;
    const full = path.join(dir, file);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(full, buf);
    return `/uploads/blog/${file}`;
  } catch {
    return null;
  }
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sources = [
      "https://worldofwarcraft.blizzard.com/en-us/news",
      "https://news.blizzard.com/en-us/world-of-warcraft",
    ];
    let created = 0;
    const seen = new Set<string>();

    for (const src of sources) {
      const html = await fetchHtml(src);
      const $ = cheerio.load(html);
      const links = collectLinks($, src);
      for (const link of links) {
        if (seen.has(link)) continue;
        seen.add(link);

        const exists = await db.post.findFirst({ where: { sourceUrl: link } });
        if (exists) continue;

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
          if (!title) continue;
          const slug = toSlug(title);
          const slugExists = await db.post.findUnique({ where: { slug } });
          if (slugExists) continue;
          const ogImg = $$('meta[property="og:image"]').attr("content") || $$('meta[name="twitter:image"]').attr("content") || $$("img").first().attr("src") || "";
          const imageUrl = ogImg ? await downloadImageToPublic(ogImg, link, slug) : null;
          await db.post.create({
            data: {
              title,
              slug,
              excerpt: excerpt.slice(0, 200),
              content: excerpt,
              sourceUrl: link,
              imageUrl: imageUrl || undefined,
              isPublished: true,
              authorId: session.user.id,
            },
          });
          created++;
          if (created >= 20) break;
        } catch {}
      }
      if (created >= 20) break;
    }

    return NextResponse.json({ success: true, created });
  } catch {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
