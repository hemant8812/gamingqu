import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { motivation } = await req.json().catch(() => ({ motivation: "" }));

  const userId = session.user.id ?? undefined;
  let resolvedUserId = userId;
  if (!resolvedUserId && session.user?.email) {
    const u = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (u) {
      resolvedUserId = u.id;
    }
  }
  if (!resolvedUserId) {
    return NextResponse.json({ error: "Unable to resolve user" }, { status: 400 });
  }

  const existingPending = await db.boosterApplication.findFirst({
    where: { userId: resolvedUserId, status: "PENDING" },
  });
  if (existingPending) {
    return NextResponse.json({ error: "Pengajuan sebelumnya masih menunggu" }, { status: 409 });
  }

  await db.boosterApplication.create({
    data: { userId: resolvedUserId, motivation },
  });
  return NextResponse.json({ success: true });
}
