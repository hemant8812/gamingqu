import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

const CreateSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number().positive(),
});

async function requireBooster() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (role !== "BOOSTER") return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const, userId: session.user.id };
}

export async function GET() {
  const auth = await requireBooster();
  if (!auth.ok) return auth.res;
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId: auth.userId },
      select: { id: true, balance: true, currency: true },
    });
    const walletId = wallet?.id ?? null;
    let totalCredits = 0;
    let monthCredits = 0;
    if (walletId) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const credits = await db.walletTransaction.findMany({
        where: { walletId, type: "CREDIT" },
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1000,
      });
      totalCredits = credits.reduce((s, t) => s + Number.parseFloat(t.amount.toString()), 0);
      monthCredits = credits
        .filter((t) => t.createdAt >= startOfMonth)
        .reduce((s, t) => s + Number.parseFloat(t.amount.toString()), 0);
    }

    const withdrawals = await db.boosterWithdrawal.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        account: {
          select: { providerName: true, type: true },
        },
      },
    });

    const pendingAmount = withdrawals
      .filter((w) => w.status === "PENDING" || w.status === "PROCESSING")
      .reduce((s, w) => s + Number.parseFloat(w.amount.toString()), 0);

    return NextResponse.json({
      ok: true,
      summary: {
        available: wallet ? Number.parseFloat(wallet.balance.toString()) : 0,
        totalEarnings: totalCredits,
        thisMonth: monthCredits,
        pending: pendingAmount,
        currency: wallet?.currency ?? "USD",
      },
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        amount: Number.parseFloat(w.amount.toString()),
        currency: w.currency,
        status: w.status,
        accountProvider: w.account.providerName,
        accountType: w.account.type,
        createdAt: w.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireBooster();
  if (!auth.ok) return auth.res;
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse({
      accountId: Number(body?.accountId),
      amount: Number(body?.amount),
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { accountId, amount } = parsed.data;
    if (amount < 10) {
      return NextResponse.json({ error: "Minimum $10" }, { status: 400 });
    }
    const account = await db.boosterPayoutAccount.findFirst({
      where: { id: accountId, userId: auth.userId, isActive: true },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const wallet = await db.wallet.findUnique({
      where: { userId: auth.userId },
      select: { balance: true, currency: true },
    });
    const balance = wallet ? Number.parseFloat(wallet.balance.toString()) : 0;
    if (balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const created = await db.boosterWithdrawal.create({
      data: {
        userId: auth.userId,
        accountId,
        amount,
        currency: wallet?.currency ?? "USD",
        status: "PENDING",
      },
      select: { id: true, amount: true, status: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, withdrawal: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
