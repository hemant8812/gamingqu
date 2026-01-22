import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function isPlacement(p: unknown): p is "HEAD" | "BODY" | "FOOTER" {
  return p === "HEAD" || p === "BODY" || p === "FOOTER";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const list = await db.embedCode.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, code: true, placement: true, isActive: true, createdAt: true, updatedAt: true },
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
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const placement = body.placement;
    const isActive = typeof body.isActive === "boolean" ? body.isActive : true;
    if (!name) return NextResponse.json({ error: "name diperlukan" }, { status: 400 });
    if (!code) return NextResponse.json({ error: "code diperlukan" }, { status: 400 });
    if (!isPlacement(placement)) return NextResponse.json({ error: "placement tidak valid" }, { status: 400 });
    const created = await db.embedCode.create({
      data: { name, code, placement, isActive },
    });
    revalidatePath("/");
    revalidatePath("/admin/settings");
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
    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return NextResponse.json({ error: "id diperlukan" }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.code === "string") data.code = body.code.trim();
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (isPlacement(body.placement)) data.placement = body.placement;
    const updated = await db.embedCode.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/admin/settings");
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
    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return NextResponse.json({ error: "id diperlukan" }, { status: 400 });
    await db.embedCode.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
