import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  const u = new URL(url);
  const database = u.pathname.replace(/^\/+/, "");
  return new PrismaClient({
    adapter: new PrismaMariaDb({
      host: u.hostname,
      port: u.port ? Number(u.port) : 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database,
      connectionLimit: 10,
    }),
  });
}

(() => {
  const current = globalThis.prisma;
  const missingModels = (() => {
    if (!current) return true;
    const models = current as unknown as Record<string, unknown>;
    return !("review" in models) || !("wallet" in models);
  })();
  if (!current || missingModels) {
    globalThis.prisma = createClient();
  }
})();

export const db = globalThis.prisma as PrismaClient;

// In dev, keep a single client instance
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
