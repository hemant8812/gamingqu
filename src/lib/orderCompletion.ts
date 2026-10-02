import { db } from "@/lib/prisma";

// Hours a customer has to confirm before a finished order is confirmed for them.
export const AUTO_CONFIRM_HOURS = 72;

// Finish an order and pay the booster. Runs once per order: the paidOutAt
// check means a double click or a second admin can never pay twice.
export async function confirmOrder(code: string, opts: { allowFrom?: Array<"ACCEPTED" | "IN_PROGRESS" | "WAITING_CONFIRM"> } = {}) {
  const allowFrom = opts.allowFrom ?? ["WAITING_CONFIRM"];
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { code },
      select: { id: true, boosterId: true, boosterPay: true, currency: true, fulfillmentStatus: true, paidOutAt: true },
    });
    if (!order || order.paidOutAt || !allowFrom.includes(order.fulfillmentStatus as (typeof allowFrom)[number])) {
      return { ok: false as const, reason: "not-allowed" };
    }
    const now = new Date();
    const claimed = await tx.order.updateMany({
      where: { id: order.id, paidOutAt: null, fulfillmentStatus: { in: allowFrom } },
      data: { fulfillmentStatus: "COMPLETED", completedAt: now, paidOutAt: order.boosterId ? now : null },
    });
    if (claimed.count === 0) return { ok: false as const, reason: "already-done" };

    const amount = Number.parseFloat(String(order.boosterPay ?? 0)) || 0;
    if (order.boosterId && amount > 0) {
      const wallet = await tx.wallet.upsert({
        where: { userId: order.boosterId },
        update: { balance: { increment: amount } },
        create: { userId: order.boosterId, balance: amount, currency: order.currency || "USD" },
      });
      await tx.walletTransaction.create({
        data: { walletId: wallet.id, type: "CREDIT", amount, orderId: order.id, description: `Payout for order ${code}` },
      });
    }
    return { ok: true as const };
  });
}

// Confirm orders whose customer did not respond in time. Called lazily when
// order pages load, so no background job is needed.
export async function autoConfirmDue() {
  const cutoff = new Date(Date.now() - AUTO_CONFIRM_HOURS * 3600 * 1000);
  const due = await db.order.findMany({
    where: { fulfillmentStatus: "WAITING_CONFIRM", paidOutAt: null, doneAt: { lte: cutoff } },
    select: { code: true },
    take: 50,
  });
  for (const o of due) {
    await confirmOrder(o.code).catch(() => null);
  }
}
