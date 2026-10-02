import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getBoosterId, getBoosterServiceIds } from "@/lib/boosterJobs";

// Number of open orders for the booster's services (0 when they turned notifications off).
export async function GET() {
  const me = await getBoosterId();
  if (!me) return NextResponse.json({ count: 0 }, { status: 401 });
  const user = await db.user.findUnique({ where: { id: me }, select: { notifyNewOrders: true } });
  if (!user?.notifyNewOrders) return NextResponse.json({ count: 0 });
  const serviceIds = await getBoosterServiceIds(me);
  const count = serviceIds.length
    ? await db.order.count({ where: { status: "PAID", fulfillmentStatus: "PENDING", boosterId: null, serviceId: { in: serviceIds } } })
    : 0;
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
}
