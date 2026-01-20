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

    await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "MEMBER",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
