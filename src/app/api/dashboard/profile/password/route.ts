import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.formData().catch(() => null);
  const password = String(body?.get("password") ?? "");
  const confirmPassword = String(body?.get("confirmPassword") ?? "");
  const mode = String(body?.get("mode") ?? "");
  const currentPassword = String(body?.get("currentPassword") ?? "");

  const Schema = z.object({
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  });
  const parsed = Schema.safeParse({ password, confirmPassword });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
  }
  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
  }

  try {
    const userId = session.user.id;
    const user = await db.user.findUnique({ where: { id: userId }, select: { password: true } });
    const hasExisting = !!user?.password;
    if (hasExisting) {
      if (mode !== "change") {
        return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
      }
      const ok = user?.password ? await compare(currentPassword, user.password) : false;
      if (!ok) {
        return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
      }
    }
    await db.user.update({
      where: { id: userId },
      data: { password: await hash(password, 10) },
    });
    return NextResponse.redirect(new URL(hasExisting ? "/dashboard/profile?toast=pw_changed" : "/dashboard/profile?toast=pw_set", req.url));
  } catch {
    return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
  }
}
