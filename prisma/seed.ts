import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hash } from "bcrypt";

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

  await prisma.user.upsert({
    where: { email: "member@gamingqu.com" },
    update: {},
    create: { username: "member", name: "Member Satu", email: "member@gamingqu.com", password: pwd, role: "MEMBER" },
  });

  await prisma.user.upsert({
    where: { email: "booster@gamingqu.com" },
    update: {},
    create: { username: "booster", name: "Booster Satu", email: "booster@gamingqu.com", password: pwd, role: "BOOSTER" },
  });

  await prisma.user.upsert({
    where: { email: "admin@gamingqu.com" },
    update: {},
    create: { username: "admin", name: "Admin Satu", email: "admin@gamingqu.com", password: pwd, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "superadmin@gamingqu.com" },
    update: {},
    create: { username: "superadmin", name: "Super Admin", email: "superadmin@gamingqu.com", password: pwd, role: "SUPERADMIN" },
  });

  const member = await prisma.user.findUnique({ where: { email: "member@gamingqu.com" } });
  if (member) {
    await prisma.boosterApplication.upsert({
      where: { id: member.id.slice(0, 24) }, // stable key (dummy)
      update: {},
      create: {
        id: member.id.slice(0, 24),
        userId: member.id,
        status: "PENDING",
        motivation: "Saya berpengalaman boosting di beberapa game FPS.",
      },
    });
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

