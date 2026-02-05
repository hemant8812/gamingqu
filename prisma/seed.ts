import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hash } from "bcrypt";
import * as cheerio from "cheerio";

const prisma = new PrismaClient({
  adapter: (() => {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is required");
    }
    const u = new URL(url);
    const database = u.pathname.replace(/^\/+/, "");
    return new PrismaMariaDb({
      host: u.hostname,
      port: u.port ? Number(u.port) : 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database,
      connectionLimit: 5,
    });
  })(),
});

async function generateRandomUserId(prefix = "G", digits = 4) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  for (let i = 0; i < 20; i++) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    const id = `${prefix}${n}`;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) return id;
  }
  return `${prefix}${Date.now().toString().slice(-digits)}`;
}

async function main() {
  await prisma.adminPermission.upsert({
    where: { key: "users" },
    update: {},
    create: { key: "users", label: "Users", enabled: true },
  });
  await prisma.adminPermission.upsert({
    where: { key: "boosters" },
    update: {},
    create: { key: "boosters", label: "Boosters", enabled: true },
  });
  await prisma.adminPermission.upsert({
    where: { key: "orders" },
    update: {},
    create: { key: "orders", label: "Orders", enabled: true },
  });
  await prisma.adminPermission.upsert({
    where: { key: "analytics" },
    update: {},
    create: { key: "analytics", label: "Analytics", enabled: false },
  });

  const pwd = await hash("password123", 10);

  const memberId = await generateRandomUserId("G", 4);
  await prisma.user.upsert({
    where: { email: "member@gamingqu.com" },
    update: {},
    create: { id: memberId, username: "member", name: "Member Satu", email: "member@gamingqu.com", password: pwd, role: "MEMBER" },
  });

  const boosterId = await generateRandomUserId("G", 4);
  await prisma.user.upsert({
    where: { email: "booster@gamingqu.com" },
    update: {},
    create: { id: boosterId, username: "booster", name: "Booster Satu", email: "booster@gamingqu.com", password: pwd, role: "BOOSTER" },
  });

  const adminId = await generateRandomUserId("G", 4);
  await prisma.user.upsert({
    where: { email: "admin@gamingqu.com" },
    update: {},
    create: { id: adminId, username: "admin", name: "Admin Satu", email: "admin@gamingqu.com", password: pwd, role: "ADMIN" },
  });

  const superadminId = await generateRandomUserId("G", 4);
  await prisma.user.upsert({
    where: { email: "superadmin@gamingqu.com" },
    update: {},
    create: { id: superadminId, username: "superadmin", name: "Super Admin", email: "superadmin@gamingqu.com", password: pwd, role: "SUPERADMIN" },
  });

  const member = await prisma.user.findUnique({ where: { email: "member@gamingqu.com" } });
  if (member) {
    const exists = await prisma.boosterApplication.findFirst({ where: { userId: member.id } });
    if (!exists) {
      await prisma.boosterApplication.create({
        data: {
          userId: member.id,
          fullName: "Member Satu",
          email: "member@gamingqu.com",
          discord: "member#1234",
          whatsapp: "+1234567890",
          games: "Saya berpengalaman boosting di beberapa game FPS.",
          status: "PENDING",
        },
      });
    }
  }

  const blizzardUrl = "https://news.blizzard.com/en-us/world-of-warcraft";
  await prisma.scraperSource.upsert({
    where: { url: blizzardUrl },
    update: {},
    create: {
      name: new URL(blizzardUrl).hostname,
      url: blizzardUrl,
      scrapeInterval: 60,
      isActive: true,
    },
  });

  const admin = await prisma.user.findUnique({ where: { email: "admin@gamingqu.com" } });
  try {
    const res = await fetch(blizzardUrl);
    const html = await res.text();
    const $ = cheerio.load(html);
    const links = new Set<string>();
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || "";
      if (!href) return;
      const fullLink = href.startsWith('http') ? href : new URL(href, blizzardUrl).toString();
      try {
        const u = new URL(fullLink);
        const hostOk = u.hostname.includes("blizzard.com");
        const pathOk = u.pathname.includes("/news/");
        const wowOk = u.pathname.includes("world-of-warcraft") || u.hostname.includes("worldofwarcraft.blizzard.com");
        if (hostOk && pathOk && wowOk) {
          links.add(u.toString());
        }
      } catch {}
    });
    console.log(`Found Blizzard links: ${links.size}`);
    const toCreate = Array.from(links).slice(0, 10);
    let created = 0;
    for (const fullLink of toCreate) {
      const exists = await prisma.post.findFirst({ where: { sourceUrl: fullLink } });
      if (exists) continue;
      try {
        const artRes = await fetch(fullLink);
        const artHtml = await artRes.text();
        const $$ = cheerio.load(artHtml);
        const title = $$('h1').first().text().trim() || $$('meta[property="og:title"]').attr('content') || "";
        const desc = $$('meta[name="description"]').attr('content') || $$('p').first().text().trim() || "";
        if (!title) continue;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
        await prisma.post.create({
          data: {
            title,
            slug,
            excerpt: desc.slice(0, 200),
            content: desc,
            sourceUrl: fullLink,
            isPublished: true,
            authorId: admin?.id,
          },
        });
        created++;
      } catch {}
    }
    if (created === 0) {
      const samples = [
        { title: "Midnight Pre-Expansion Content Update Notes", sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news" },
        { title: "Watch the Pre-Expansion Update Survival Guide", sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news" },
        { title: "WoW Weekly: Midnight Draws Near", sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news" },
        { title: "Hotfixes", sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news" },
        { title: "Gallop into the New Year with a 6-Month Subscription", sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news" },
      ];
      for (const s of samples) {
        const exists = await prisma.post.findFirst({ where: { title: s.title } });
        if (exists) continue;
        const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await prisma.post.create({
          data: {
            title: s.title,
            slug,
            excerpt: s.title,
            content: s.title,
            sourceUrl: s.sourceUrl,
            isPublished: true,
            authorId: admin?.id,
          },
        });
        created++;
      }
    }
    console.log(`Seeded Blizzard posts: ${created}`);
  } catch {
    console.log("Blizzard seed failed");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding selesai.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

