import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = (searchParams.get("token") || "").trim();
  const orderCode = (searchParams.get("order") || "").trim();
  const baseUrl = getBaseUrl();
  try {
    if (token) {
      const payment = await db.payment.findFirst({
        where: { provider: "paypal", providerOrderId: token },
        select: { id: true, orderId: true },
      });
      if (payment) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "CANCELED" },
        });
        await db.order.update({
          where: { id: payment.orderId },
          data: { status: "CANCELED" },
        });
      }
    }
  } catch {
    /* ignore */
  }
  return NextResponse.redirect(`${baseUrl}/checkout/canceled${orderCode ? `?order=${encodeURIComponent(orderCode)}` : ""}`);
}
