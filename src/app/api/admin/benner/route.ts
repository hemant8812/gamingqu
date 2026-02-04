import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import path from "path";
import { promises as fs } from "fs";

async function saveButtonImage(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "benner");
  await fs.mkdir(uploadDir, { recursive: true });
  const name = file.name || `button-${Date.now()}.bin`;
  const ext = path.extname(name) || ".bin";
  const filename = `button-${Date.now()}${ext}`;
  const content = Buffer.from(await file.arrayBuffer());
  const savedPath = path.join(uploadDir, filename);
  await fs.writeFile(savedPath, content);
  return `/uploads/benner/${filename}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const list = await db.banner.findMany({
      select: { id: true, title: true, subtitle: true, buttonLink: true, buttonImageUrl: true, order: true, isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const form = await req.formData();
    const mode = ((form.get("mode") as string | null) ?? "").toUpperCase();
    if (mode === "CREATE") {
      const count = await db.banner.count();
      if (count >= 10) return NextResponse.json({ error: "Maksimum 10 benner" }, { status: 400 });
      const title = ((form.get("title") as string | null) ?? "").trim();
      const subtitle = ((form.get("subtitle") as string | null) ?? "").trim();
      const buttonLink = ((form.get("buttonLink") as string | null) ?? "").trim();
      const activeRaw = (form.get("isActive") as string | null) ?? null;
      const isActive = activeRaw === "on" || activeRaw === "true" || activeRaw === "1";
      const buttonImage = form.get("buttonImage") as File | null;
      const buttonImageUrl = await saveButtonImage(buttonImage);
      const valOrNull = (v: string) => (v.length > 0 ? v : null);
      const created = await db.banner.create({
        data: {
          title: valOrNull(title),
          subtitle: valOrNull(subtitle),
          buttonLink: valOrNull(buttonLink),
          buttonImageUrl: buttonImageUrl ?? undefined,
          isActive: activeRaw != null ? isActive : true,
          order: count,
        },
      });
      revalidateTag("banners", { expire: 0 });
      return NextResponse.json({ ok: true, data: created });
    } else if (mode === "UPDATE") {
      const idStr = ((form.get("id") as string | null) ?? "").trim();
      const id = Number(idStr);
      if (!Number.isFinite(id) || id <= 0) return NextResponse.json({ error: "id diperlukan" }, { status: 400 });
      const title = ((form.get("title") as string | null) ?? "").trim();
      const subtitle = ((form.get("subtitle") as string | null) ?? "").trim();
      const buttonLink = ((form.get("buttonLink") as string | null) ?? "").trim();
      const activeRaw = (form.get("isActive") as string | null) ?? null;
      const isActive = activeRaw === "on" || activeRaw === "true" || activeRaw === "1";
      const buttonImage = form.get("buttonImage") as File | null;
      const buttonImageUrl = await saveButtonImage(buttonImage);
      const valOrNull = (v: string) => (v.length > 0 ? v : null);
      const updated = await db.banner.update({
        where: { id },
        data: {
          title: valOrNull(title),
          subtitle: valOrNull(subtitle),
          buttonLink: valOrNull(buttonLink),
          buttonImageUrl: buttonImageUrl ?? undefined,
          ...(activeRaw != null ? { isActive } : {}),
        },
      });
      revalidateTag("banners", { expire: 0 });
      return NextResponse.json({ ok: true, data: updated });
    } else if (mode === "DELETE") {
      const idStr = ((form.get("id") as string | null) ?? "").trim();
      const id = Number(idStr);
      if (!Number.isFinite(id) || id <= 0) return NextResponse.json({ error: "id diperlukan" }, { status: 400 });
      await db.banner.delete({ where: { id } });
      revalidateTag("banners", { expire: 0 });
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "mode tidak dikenal" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
