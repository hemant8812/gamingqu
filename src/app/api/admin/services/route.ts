import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { promises as fs } from "fs";

function slugify(input: string) {
    return input.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function saveFile(file: File | null, slug: string): Promise<string | undefined> {
    if (!file || file.size === 0) return undefined;
    const t = (file as unknown as { type?: string }).type || "";
    if (!t.startsWith("image/")) return undefined;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "services");
    await fs.mkdir(uploadDir, { recursive: true });
    const name = file.name || `image.png`;
    const extRaw = path.extname(name).toLowerCase();
    const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    const ext = allowed.includes(extRaw) ? extRaw : ".png";
    const filename = `${slug}-${Date.now()}${ext}`;
    const content = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), content);
    return `/uploads/services/${filename}`;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role;
        if (role !== "ADMIN" && role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const services = await db.service.findMany({
            orderBy: { createdAt: "desc" },
            take: 100, // Limit untuk performa admin list
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                isHotOffer: true,
                isActive: true,
                imageUrl: true,
                createdAt: true,
                game: { select: { id: true, name: true } },
                category: { select: { id: true, name: true } },
            },
        });
        return NextResponse.json(services);
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
        const description = (form.get("description") as string | null) ?? "";
        const inputSlug = (form.get("slug") as string | null) ?? "";
        const gameIdStr = (form.get("gameId") as string | null) ?? "";
        const categoryIdStr = (form.get("categoryId") as string | null) || null;
        const gameId = Number(gameIdStr);
        const categoryId = categoryIdStr != null && categoryIdStr !== "" ? Number(categoryIdStr) : null;
        const price = (form.get("price") as string | null) ?? "0";
        const featuresRaw = (form.get("features") as string | null) ?? "[]";
        const isHotOffer = form.get("isHotOffer") === "on" || form.get("isHotOffer") === "true";
        const isActive = form.get("isActive") === "on" || form.get("isActive") === "true";
        const imageFile = form.get("image") as File | null;

        if (!name.trim()) {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }
        if (!Number.isFinite(gameId) || gameId <= 0) {
            return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
        }

        let features: string[] = [];
        try {
            features = JSON.parse(featuresRaw);
        } catch {
            features = [];
        }

        let baseSlug = slugify(inputSlug || name || "");
        if (baseSlug.length > 60) {
            baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
        }
        let slug = baseSlug || `service-${Date.now()}`;
        const existing = await db.service.findUnique({ where: { slug }, select: { id: true } });
        if (existing) {
            slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
        }
        const imageUrl = await saveFile(imageFile, slug);
        await db.service.create({
            data: {
                name,
                slug,
                description: description || undefined,
                gameId,
                categoryId: categoryId ?? undefined,
                price: parseFloat(price) || 0,
                features,
                imageUrl,
                isHotOffer,
                isActive,
            },
        });
        revalidatePath("/admin/services");
        return NextResponse.json({ ok: true, toast: "saved" });
    } catch (e) {
        console.error(e);
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
        const gameIdStr = (form.get("gameId") as string | null) ?? "";
        const categoryIdStr = (form.get("categoryId") as string | null) || null;
        const gameId = Number(gameIdStr);
        const categoryId = categoryIdStr != null && categoryIdStr !== "" ? Number(categoryIdStr) : null;
        const price = (form.get("price") as string | null) ?? "0";
        const featuresRaw = (form.get("features") as string | null) ?? "[]";
        const isHotOffer = form.get("isHotOffer") === "on" || form.get("isHotOffer") === "true";
        const isActive = form.get("isActive") === "on" || form.get("isActive") === "true";
        const imageFile = form.get("image") as File | null;

        if (!Number.isFinite(id) || id <= 0) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }
        const current = await db.service.findUnique({ where: { id }, select: { id: true, name: true, slug: true, imageUrl: true } });
        if (!current) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        let features: string[] = [];
        try {
            features = JSON.parse(featuresRaw);
        } catch {
            features = [];
        }

        let baseSlug = slugify(inputSlug || name || current.name || "");
        if (baseSlug.length > 60) {
            baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
        }
        let slug = baseSlug || current.slug;
        const existing = await db.service.findUnique({ where: { slug }, select: { id: true } });
        if (existing && existing.id !== id) {
            slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
        }
        const imageUrl = await saveFile(imageFile, slug);
        await db.service.update({
            where: { id },
            data: {
                name,
                slug,
                description: description || undefined,
                gameId,
                categoryId: categoryId ?? undefined,
                price: parseFloat(price) || 0,
                features,
                imageUrl: imageUrl ?? current.imageUrl,
                isHotOffer,
                isActive,
            },
        });
        revalidatePath("/admin/services");
        return NextResponse.json({ ok: true, toast: "updated" });
    } catch (e) {
        console.error(e);
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
        const { id: rawId } = await req.json();
        const id = Number(rawId);
        if (!Number.isFinite(id) || id <= 0) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }
        await db.service.delete({ where: { id } });
        revalidatePath("/admin/services");
        return NextResponse.json({ ok: true, toast: "deleted" });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
