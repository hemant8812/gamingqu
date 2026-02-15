import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ id?: string }> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "BOOSTER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const p = await params;
  const idRaw = p?.id;
  const id = typeof idRaw === "string" ? Number.parseInt(idRaw, 10) : NaN;
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const existing = await db.boosterPayoutAccount.findFirst({
      where: { id, userId: session.user.id, isActive: true },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await db.boosterPayoutAccount.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

