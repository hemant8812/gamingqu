import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";
import { generateNextUserId } from "@/lib/userId";
import { sanitizePlain, normalizeEmail } from "@/lib/sanitize";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const Schema = z.object({
    email: z.string().email().max(254),
    password: z.string().min(8).max(128),
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(/^[a-zA-Z0-9._-]+$/),
    name: z
      .string()
      .min(2)
      .max(100),
  });
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }
  const email = normalizeEmail(parsed.data.email);
  const username = sanitizePlain(parsed.data.username);
  const name = sanitizePlain(parsed.data.name);
  const password = parsed.data.password.trim();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }
  const exUser = await db.user.findUnique({ where: { username } });
  if (exUser) {
    return NextResponse.json({ error: "Username sudah terpakai" }, { status: 409 });
  }
  const id = await generateNextUserId("GQ", 3);
  const passwordHash = await hash(password, 10);
  await db.user.create({
    data: {
      id,
      email,
      name,
      password: passwordHash,
      role: "MEMBER",
      username,
    },
  });
  return NextResponse.json({ success: true });
}
