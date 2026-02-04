import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";

async function getPaypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const secret = process.env.PAYPAL_SECRET || "";
  const isLive = (process.env.PAYPAL_ENV || "").toLowerCase() === "live";
  const base = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  if (!clientId || !secret) {
    throw new Error("Missing PayPal credentials");
  }
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error("Failed to obtain PayPal access token");
  }
  const json = await res.json();
  return { accessToken: String(json.access_token || ""), base };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = (searchParams.get("token") || "").trim();
  const orderCode = (searchParams.get("order") || "").trim();
  const baseUrl = getBaseUrl();
  if (!token) {
    return NextResponse.redirect(`${baseUrl}/checkout/error?code=missing_token`);
  }
  try {
    const payment = await db.payment.findFirst({
      where: { provider: "paypal", providerOrderId: token },
      select: { id: true, orderId: true, status: true },
    });
    if (!payment) {
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=payment_not_found`);
    }
    const { accessToken, base } = await getPaypalAccessToken();
    const capRes = await fetch(`${base}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await capRes.json();
    if (!capRes.ok) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", raw: data },
      });
      await db.order.update({
        where: { id: payment.orderId },
        data: { status: "FAILED" },
      });
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=capture_failed`);
    }
    await db.payment.update({
      where: { id: payment.id },
      data: { status: "CAPTURED", raw: data },
    });
    await db.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });
    return NextResponse.redirect(`${baseUrl}/dashboard/orders?paid=1${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/checkout/error?code=server_error`);
  }
}
