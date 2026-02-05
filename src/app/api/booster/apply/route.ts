
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sanitizePlain } from "@/lib/sanitize";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  const body = await req.json().catch(() => ({}));
  
  const Schema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    discord: z.string().min(1, "Discord is required"),
    whatsapp: z.string().min(1, "WhatsApp number is required"),
    games: z.union([z.string(), z.array(z.string())]), // Handle string or array
  });

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { fullName, email, discord, whatsapp, games } = parsed.data;
  
  // Convert games array to comma-separated string if it's an array
  const gamesString = Array.isArray(games) ? games.join(", ") : games;

  let resolvedUserId: string | null = null;
  
  if (session?.user) {
    resolvedUserId = session.user.id ?? null;
    if (!resolvedUserId && session.user.email) {
      const u = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
      if (u) {
        resolvedUserId = u.id;
      }
    }
  }

  if (resolvedUserId) {
    const existing = await db.boosterApplication.findFirst({
      where: { userId: resolvedUserId },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "An application already exists for this account" }, { status: 409 });
    }
  }

  await db.boosterApplication.create({
    data: {
      userId: resolvedUserId, // Can be null
      fullName: sanitizePlain(fullName),
      email: sanitizePlain(email),
      discord: sanitizePlain(discord),
      whatsapp: sanitizePlain(whatsapp),
      games: sanitizePlain(gamesString),
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true });
}
