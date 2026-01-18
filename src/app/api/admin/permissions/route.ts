import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const list = await db.adminPermission.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const { key, label, enabled } = body as { key: string; label?: string; enabled?: boolean };
  if (!key) return NextResponse.json({ error: "key diperlukan" }, { status: 400 });

  const existing = await db.adminPermission.findUnique({ where: { key } });
  if (!existing) {
    const created = await db.adminPermission.create({
      data: { key, label: label ?? key, enabled: enabled ?? false },
    });
    return NextResponse.json(created);
  } else {
    const updated = await db.adminPermission.update({
      where: { key },
      data: { label: label ?? existing.label, enabled: enabled ?? existing.enabled },
    });
    return NextResponse.json(updated);
  }
}
