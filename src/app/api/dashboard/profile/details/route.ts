import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.formData().catch(() => null);
  const name = String(body?.get("name") ?? "");
  const email = String(body?.get("email") ?? "");
  const Schema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().min(5).max(200),
  });
  const parsed = Schema.safeParse({ name, email });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
  }
  try {
    const userId = session.user.id;
    const existing = await db.user.findFirst({
      where: { email, NOT: { id: userId } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
    }
    await db.user.update({
      where: { id: userId },
      data: { name, email },
    });
    return NextResponse.redirect(new URL("/dashboard/profile?toast=info_updated", req.url));
  } catch {
    return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
  }
}
