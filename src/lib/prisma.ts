import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ??
  new PrismaClient({
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
        connectionLimit: 10,
      });
    })(),
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
