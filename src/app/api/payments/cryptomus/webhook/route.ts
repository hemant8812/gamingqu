import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";
import type { Prisma } from "@/generated/prisma/client";

function verifySign(payload: Record<string, unknown>): boolean {
  const apiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY || "";
  if (!apiKey) return false;
  const { sign: signRaw, ...rest } = payload as { sign?: string };
  const json = JSON.stringify(rest ?? {});
  const b64 = Buffer.from(json).toString("base64");
  const calc = crypto.createHash("md5").update(b64 + apiKey).digest("hex");
  return !!signRaw && calc === signRaw;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const payload = (body?.result ?? body) as Record<string, unknown>;
    if (!verifySign(payload)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    const orderCode = String(payload?.order_id ?? "");
    const status = String(payload?.status ?? "").toLowerCase();
    const uuid = String(payload?.uuid ?? "");
    if (!orderCode) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }
    const order = await db.order.findUnique({
      where: { code: orderCode },
      select: { id: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const payment = await db.payment.findFirst({
      where: { orderId: order.id, provider: "cryptomus" },
      select: { id: true },
    });
    const payId = payment?.id;
    const mark = async (p: "CAPTURED" | "FAILED" | "CANCELED") => {
      if (payId) {
        await db.payment.update({
          where: { id: payId },
          data: { status: p, providerOrderId: uuid || undefined, raw: (payload as unknown as Prisma.InputJsonValue) },
        });
      }
      await db.order.update({
        where: { id: order.id },
        data: { status: p === "CAPTURED" ? "PAID" : p === "CANCELED" ? "CANCELED" : "FAILED" },
      });
    };
    if (status === "paid" || status === "paid_over") {
      await mark("CAPTURED");
    } else if (status === "cancel") {
      await mark("CANCELED");
    } else {
      await mark("FAILED");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
