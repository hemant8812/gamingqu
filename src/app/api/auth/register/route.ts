import { db } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

function sanitizePlain(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
function normalizeEmail(email: string): string {
  return sanitizePlain(email).toLowerCase();
}
function baseUsernameFrom(name: string, email: string): string {
  const local = email.split("@")[0] || "user";
  const source = (name || local).toLowerCase();
  const cleaned = source.replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^\W+|\W+$/g, "");
  const candidate = cleaned.length >= 3 ? cleaned.slice(0, 32) : (local || "user").slice(0, 32);
  return candidate || "user";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const name = sanitizePlain(parsed.data.name);
    const email = normalizeEmail(parsed.data.email);
    const password = parsed.data.password.trim();

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const hashed = await hash(password, 10);
    let username = baseUsernameFrom(name, email);
    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      let i = 1;
      const base = username.slice(0, 24);
      while (i < 50) {
        const candidate = `${base}-${i}`;
        const ex = await db.user.findUnique({ where: { username: candidate } });
        if (!ex) {
          username = candidate;
          break;
        }
        i += 1;
      }
      if (i >= 50) {
        username = `${base}-${Date.now().toString().slice(-6)}`;
      }
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "MEMBER",
        username,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
