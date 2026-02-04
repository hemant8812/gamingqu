import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("avatar") as File | null;
    if (!file) {
      return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
    }
    const t = (file as unknown as { type?: string }).type || "";
    if (!t.startsWith("image/")) {
      return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
    }
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });
    const nameGuess = (file as unknown as { name?: string }).name || "avatar.png";
    const extRaw = path.extname(nameGuess).toLowerCase();
    const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    const ext = allowed.includes(extRaw) ? extRaw : ".png";
    const filename = `user-${session.user.id}-${Date.now()}${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buf);
    const imageUrl = `/uploads/avatars/${filename}`;
    await db.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });
    return NextResponse.redirect(new URL("/dashboard/profile?toast=info_updated", req.url));
  } catch {
    return NextResponse.redirect(new URL("/dashboard/profile?toast=error", req.url));
  }
}
