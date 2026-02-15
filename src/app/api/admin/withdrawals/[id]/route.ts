import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

const UpdateSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "REJECTED", "PAID"]),
  note: z.string().trim().max(400).optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (role !== "ADMIN" && role !== "SUPERADMIN")
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;
  const { id } = await params;
  const withdrawalId = Number(id);
  if (!Number.isFinite(withdrawalId) || withdrawalId <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const existing = await db.boosterWithdrawal.findUnique({
      where: { id: withdrawalId },
      select: { id: true, userId: true, amount: true, currency: true, status: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const nextStatus = parsed.data.status;
    const note = parsed.data.note ?? null;

    if (existing.status === nextStatus && note == null) {
      return NextResponse.json({ ok: true, withdrawal: existing });
    }

    // When marking PAID, deduct from wallet
    if (nextStatus === "PAID") {
      await db.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: { userId: existing.userId },
          select: { id: true, balance: true, currency: true },
        });
        const walletId = wallet?.id ?? null;
        const balance = wallet ? Number.parseFloat(wallet.balance.toString()) : 0;
        const amt = Number.parseFloat(existing.amount.toString());
        if (!walletId) throw new Error("Wallet not found");
        if (balance < amt) throw new Error("Insufficient wallet");

        await tx.boosterWithdrawal.update({
          where: { id: existing.id },
          data: { status: nextStatus, note },
        });

        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: (balance - amt).toFixed(2) },
        });
        await tx.walletTransaction.create({
          data: {
            walletId,
            type: "DEBIT",
            amount: amt,
            description: "Withdrawal paid",
          },
        });
      });
    } else {
      await db.boosterWithdrawal.update({
        where: { id: existing.id },
        data: { status: nextStatus, note },
      });
    }

    const updated = await db.boosterWithdrawal.findUnique({
      where: { id: existing.id },
    });
    return NextResponse.json({ ok: true, withdrawal: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
