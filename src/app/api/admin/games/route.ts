import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { sanitizeHtml, sanitizePlain } from "@/lib/sanitize";
import path from "path";
import { promises as fs } from "fs";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function saveFile(file: File | null, slug: string, kind: "image" | "icon"): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const t = (file as unknown as { type?: string }).type || "";
  if (!t.startsWith("image/")) return undefined;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "games");
  await fs.mkdir(uploadDir, { recursive: true });
  const name = file.name || `${kind}.png`;
  const extRaw = path.extname(name).toLowerCase();
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const ext = allowed.includes(extRaw) ? extRaw : ".png";
  const filename = `${slug}-${kind}-${Date.now()}${ext}`;
  const content = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), content);
  return `/uploads/games/${filename}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const form = await req.formData();
    const name = (form.get("name") as string | null) ?? "";
    const description = (form.get("description") as string | null) ?? "";
    const inputSlug = (form.get("slug") as string | null) ?? "";
    const isHotOffer = form.get("isHotOffer") === "on";
    const isActive = form.get("isActive") === "on";
    const sortOrderVal = form.get("sortOrder");
    let sortOrder = 9999;
    if (sortOrderVal !== null) {
      const parsed = Number(sortOrderVal);
      if (!isNaN(parsed) && parsed > 0) {
        sortOrder = parsed;
      }
    }
    const imageFile = form.get("image") as File | null;
    const iconFile = form.get("icon") as File | null;
    if (!name.trim()) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    const MAX_UPLOAD = 10 * 1024 * 1024;
    if ((imageFile && imageFile.size > MAX_UPLOAD) || (iconFile && iconFile.size > MAX_UPLOAD)) {
      return NextResponse.json({ error: "File terlalu besar" }, { status: 413 });
    }
    let baseSlug = slugify(inputSlug || name || "");
    if (baseSlug.length > 60) {
      baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
    }
    let slug = baseSlug || `game-${Date.now()}`;
    const existing = await db.game.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const [imageUrl, iconUrl] = await Promise.all([
      saveFile(imageFile, slug, "image"),
      saveFile(iconFile, slug, "icon"),
    ]);
    await db.game.create({
      data: {
        name: sanitizePlain(name),
        slug,
        description: sanitizeHtml(description || "") || undefined,
        imageUrl,
        iconUrl,
        isHotOffer,
        isActive,
        sortOrder,
      },
    });
    revalidateTag("games", { expire: 0 });
    return NextResponse.json({ ok: true, toast: "saved" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const form = await req.formData();
    const idStr = (form.get("id") as string | null) ?? "";
    const id = Number(idStr);
    const name = (form.get("name") as string | null) ?? "";
    const description = (form.get("description") as string | null) ?? "";
    const inputSlug = (form.get("slug") as string | null) ?? "";
    const isHotOffer = form.get("isHotOffer") === "on";
    const isActive = form.get("isActive") === "on";
    const imageFile = form.get("image") as File | null;
    const iconFile = form.get("icon") as File | null;
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const current = await db.game.findUnique({ where: { id }, select: { id: true, name: true, slug: true, imageUrl: true, iconUrl: true, sortOrder: true } });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const sortOrderVal = form.get("sortOrder");
    let sortOrder = current.sortOrder;
    if (sortOrderVal !== null) {
      const parsed = Number(sortOrderVal);
      if (!isNaN(parsed) && parsed > 0) {
        sortOrder = parsed;
      } else {
        sortOrder = 9999;
      }
    }
    const MAX_UPLOAD = 10 * 1024 * 1024;
    if ((imageFile && imageFile.size > MAX_UPLOAD) || (iconFile && iconFile.size > MAX_UPLOAD)) {
      return NextResponse.json({ error: "File terlalu besar" }, { status: 413 });
    }
    let baseSlug = slugify(inputSlug || name || current.name || "");
    if (baseSlug.length > 60) {
      baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
    }
    let slug = baseSlug || current.slug;
    const existing = await db.game.findUnique({ where: { slug }, select: { id: true } });
    if (existing && existing.id !== id) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const [imageUrl, iconUrl] = await Promise.all([
      saveFile(imageFile, slug, "image"),
      saveFile(iconFile, slug, "icon"),
    ]);
    await db.game.update({
      where: { id },
      data: {
        name: sanitizePlain(name),
        slug,
        description: sanitizeHtml(description || "") || undefined,
        imageUrl: imageUrl ?? current.imageUrl,
        iconUrl: iconUrl ?? current.iconUrl,
        isHotOffer,
        isActive,
        sortOrder,
      },
    });
    revalidateTag("games", { expire: 0 });
    return NextResponse.json({ ok: true, toast: "updated" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
