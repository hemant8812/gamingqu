import { db } from "@/lib/prisma";

export async function generateNextUserId(prefix: string, minDigits: number) {
  const last = await db.user.findMany({
    where: { id: { startsWith: prefix } },
    select: { id: true },
    orderBy: { id: "desc" },
    take: 1,
  });
  let nextNum = 1;
  let width = minDigits;
  if (last.length > 0) {
    const curr = last[0].id;
    const numStr = curr.slice(prefix.length);
    const n = parseInt(numStr, 10);
    if (!Number.isNaN(n)) {
      nextNum = n + 1;
      width = Math.max(minDigits, numStr.length);
    }
  }
  return `${prefix}${String(nextNum).padStart(width, "0")}`;
}

export async function generateRandomUserId(prefix = "G", digits = 4) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  for (let attempt = 0; attempt < 10; attempt++) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    const id = `${prefix}${n}`;
    const exists = await db.user.findUnique({ where: { id } });
    if (!exists) return id;
  }
  return generateNextUserId(prefix, digits);
}
