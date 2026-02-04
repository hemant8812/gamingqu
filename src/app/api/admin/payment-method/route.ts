import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const list = await db.paymentMethod.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const form = await req.formData();
    const name = (form.get("name") as string | null) ?? "";
    const slug = (form.get("slug") as string | null) ?? "";
    const feeType = (form.get("feeType") as string | null) ?? "percent";
    const feeValueRaw = (form.get("feeValue") as string | null) ?? "";
    const sortOrderRaw = (form.get("sortOrder") as string | null) ?? "";
    const isActiveRaw = (form.get("isActive") as string | null) ?? "";
    const isActive = isActiveRaw === "true" || isActiveRaw === "on";
    const iconFile = form.get("icon") as File | null;
    if (!name.trim() || !slug.trim()) {
      return NextResponse.json({ error: "name & slug required" }, { status: 400 });
    }
    const uploadDir = path.join(process.cwd(), "public", "uploads", "payment-methods");
    await fs.mkdir(uploadDir, { recursive: true });
    let iconUrl: string | undefined = undefined;
    if (iconFile && iconFile.size > 0) {
      const t = (iconFile as unknown as { type?: string }).type || "";
      if (t.startsWith("image/")) {
        const nameGuess = iconFile.name || "icon.png";
        const extRaw = path.extname(nameGuess).toLowerCase();
        const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
        const ext = allowed.includes(extRaw) ? extRaw : ".png";
        const filename = `${slug}-icon-${Date.now()}${ext}`;
        const buf = Buffer.from(await iconFile.arrayBuffer());
        await fs.writeFile(path.join(uploadDir, filename), buf);
        iconUrl = `/uploads/payment-methods/${filename}`;
      }
    }
    const feeValue = feeValueRaw ? Number(feeValueRaw) : null;
    const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 0;
    const created = await db.paymentMethod.create({
      data: {
        name,
        slug,
        iconUrl,
        feePercent: feeType === "percent" && feeValue != null ? feeValue : undefined,
        feeFixed: feeType === "fixed" && feeValue != null ? feeValue : undefined,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
    revalidatePath("/admin/payment-method");
    revalidateTag("payment-methods", { expire: 0 });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const form = await req.formData();
    const idRaw = (form.get("id") as string | null) ?? "";
    const id = Number(idRaw);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const existing = await db.paymentMethod.findUnique({ where: { id: id! } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const name = (form.get("name") as string | null) ?? existing.name;
    const slug = (form.get("slug") as string | null) ?? existing.slug;
    const feeType = (form.get("feeType") as string | null) ?? "";
    const feeValueRaw = (form.get("feeValue") as string | null) ?? "";
    const isActiveRaw = (form.get("isActive") as string | null) ?? "";
    const isActive = isActiveRaw ? isActiveRaw === "true" || isActiveRaw === "on" : existing.isActive;
    const sortOrderRaw = (form.get("sortOrder") as string | null) ?? "";
    const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : existing.sortOrder;
    const iconFile = form.get("icon") as File | null;
    let iconUrl = existing.iconUrl ?? undefined;
    if (iconFile && iconFile.size > 0) {
      const t = (iconFile as unknown as { type?: string }).type || "";
      if (t.startsWith("image/")) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "payment-methods");
        await fs.mkdir(uploadDir, { recursive: true });
        const nameGuess = iconFile.name || "icon.png";
        const extRaw = path.extname(nameGuess).toLowerCase();
        const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
        const ext = allowed.includes(extRaw) ? extRaw : ".png";
        const filename = `${slug}-icon-${Date.now()}${ext}`;
        const buf = Buffer.from(await iconFile.arrayBuffer());
        await fs.writeFile(path.join(uploadDir, filename), buf);
        iconUrl = `/uploads/payment-methods/${filename}`;
      }
    }
    let feePercent: number | undefined = existing.feePercent != null ? Number.parseFloat(existing.feePercent.toString()) : undefined;
    let feeFixed: number | undefined = existing.feeFixed != null ? Number.parseFloat(existing.feeFixed.toString()) : undefined;
    if (feeType === "percent" || feeType === "fixed") {
      const v = feeValueRaw ? Number(feeValueRaw) : NaN;
      if (Number.isFinite(v)) {
        feePercent = feeType === "percent" ? v : undefined;
        feeFixed = feeType === "fixed" ? v : undefined;
      }
    }
    const updated = await db.paymentMethod.update({
      where: { id: id! },
      data: {
        name,
        slug,
        iconUrl,
        feePercent,
        feeFixed,
        isActive,
        sortOrder,
      },
    });
    revalidatePath("/admin/payment-method");
    revalidateTag("payment-methods", { expire: 0 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get("id");
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await db.paymentMethod.delete({ where: { id } });
    revalidatePath("/admin/payment-method");
    revalidateTag("payment-methods", { expire: 0 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
