import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const categories = await db.category.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        game: { select: { id: true, name: true, iconUrl: true } },
      },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
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
    const inputSlug = (form.get("slug") as string | null) ?? "";
    const gameIdStr = (form.get("gameId") as string | null) ?? "";
    const gameId = Number(gameIdStr);
    const isActive = form.get("isActive") === "on" || form.get("isActive") === "true";
    if (!name.trim()) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (!Number.isFinite(gameId) || gameId <= 0) {
      return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
    }
    let baseSlug = slugify(inputSlug || name || "");
    if (baseSlug.length > 60) {
      baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
    }
    let slug = baseSlug || `category-${Date.now()}`;
    const existing = await db.category.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    await db.category.create({
      data: {
        name,
        slug,
        gameId,
        isActive,
      },
    });
    revalidatePath("/admin/categories");
    revalidateTag("categories", { expire: 0 });
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
    const inputSlug = (form.get("slug") as string | null) ?? "";
    const gameIdStr = (form.get("gameId") as string | null) ?? "";
    const gameId = Number(gameIdStr);
    const isActive = form.get("isActive") === "on" || form.get("isActive") === "true";
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const current = await db.category.findUnique({ where: { id }, select: { id: true, name: true, slug: true } });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    let baseSlug = slugify(inputSlug || name || current.name || "");
    if (baseSlug.length > 60) {
      baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
    }
    let slug = baseSlug || current.slug;
    const existing = await db.category.findUnique({ where: { slug }, select: { id: true } });
    if (existing && existing.id !== id) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        gameId: Number.isFinite(gameId) ? gameId : undefined,
        isActive,
      },
    });
    revalidatePath("/admin/categories");
    revalidateTag("categories", { expire: 0 });
    return NextResponse.json({ ok: true, toast: "updated" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const form = await req.formData();
    const idStr = (form.get("id") as string | null) ?? "";
    const id = Number(idStr);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await db.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
