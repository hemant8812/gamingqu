import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import crypto from "crypto";
import type { Prisma } from "@/generated/prisma/client";

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

function signCryptomus(body: unknown) {
  const apiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY || "";
  const json = JSON.stringify(body ?? {});
  const b64 = Buffer.from(json).toString("base64");
  const hash = crypto.createHash("md5").update(b64 + apiKey).digest("hex");
  return hash;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const orderCode = url.searchParams.get("order") || "";
    if (!orderCode) {
      return NextResponse.json({ error: "Missing order code" }, { status: 400 });
    }
    const order = await db.order.findUnique({
      where: { code: orderCode },
      select: {
        id: true,
        userId: true,
        code: true,
        currency: true,
        amount: true,
        methodSlug: true,
        status: true,
      },
    });
    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Order is not pending payment" }, { status: 400 });
    }
    const provider = order.methodSlug === "paypal" ? "paypal" : order.methodSlug === "cryptomus" ? "cryptomus" : null;
    if (!provider) {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
    }
    const existingPayment = await db.payment.findFirst({
      where: { orderId: order.id, provider },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, approvalUrl: true, providerOrderId: true, raw: true },
    });
    if (existingPayment && existingPayment.approvalUrl && (existingPayment.status === "APPROVAL_REQUIRED" || existingPayment.status === "CREATED")) {
      return NextResponse.redirect(existingPayment.approvalUrl);
    }
    const baseUrl = getBaseUrl();
    if (provider === "paypal") {
      const { accessToken, base } = await getPaypalAccessToken();
      const createRes = await fetch(`${base}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: order.currency,
                value: Number.parseFloat(order.amount.toString()).toFixed(2),
              },
              custom_id: order.code,
            },
          ],
          application_context: {
            brand_name: "Gamingqu",
            user_action: "PAY_NOW",
            return_url: `${baseUrl}/api/payments/paypal/return?order=${encodeURIComponent(order.code)}`,
            cancel_url: `${baseUrl}/api/payments/paypal/cancel?order=${encodeURIComponent(order.code)}`,
          },
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
      }
      const providerOrderId = String(created.id || "");
      const links: Array<{ rel?: string; href?: string }> = Array.isArray((created as { links?: unknown }).links)
        ? ((created as { links?: Array<{ rel?: string; href?: string }> }).links ?? [])
        : [];
      const approveUrl = links.find((l) => l.rel === "approve")?.href ?? "";
      if (!approveUrl) {
        return NextResponse.json({ error: "Missing PayPal approve url" }, { status: 500 });
      }
      if (existingPayment) {
        await db.payment.update({
          where: { id: existingPayment.id },
          data: {
            providerOrderId,
            approvalUrl: approveUrl,
            status: "APPROVAL_REQUIRED",
            raw: created as Prisma.InputJsonValue,
          },
        });
      } else {
        await db.payment.create({
          data: {
            orderId: order.id,
            provider,
            providerOrderId,
            approvalUrl: approveUrl,
            status: "APPROVAL_REQUIRED",
            raw: created as Prisma.InputJsonValue,
          },
        });
      }
      return NextResponse.redirect(approveUrl);
    } else {
      const merchant = process.env.CRYPTOMUS_MERCHANT_UUID || "";
      const apiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY || "";
      if (!merchant || !apiKey) {
        return NextResponse.json({ error: "Missing Cryptomus credentials" }, { status: 500 });
      }
      const bodyData = {
        amount: Number.parseFloat(order.amount.toString()).toFixed(2),
        currency: order.currency === "EUR" ? "EUR" : "USD",
        order_id: order.code,
        url_return: `${baseUrl}/api/payments/cryptomus/return?order=${encodeURIComponent(order.code)}`,
        url_callback: `${baseUrl}/api/payments/cryptomus/webhook`,
        is_payment_multiple: true,
        lifetime: 7200,
      };
      const sign = signCryptomus(bodyData);
      const res = await fetch("https://api.cryptomus.com/v1/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          merchant,
          sign,
        } as Record<string, string>,
        body: JSON.stringify(bodyData),
      });
      const json = await res.json().catch(() => ({}));
      const result = (json as { result?: unknown })?.result as { uuid?: string; url?: string } | undefined;
      const approveUrl = String(result?.url || "");
      if (!res.ok || !approveUrl) {
        return NextResponse.json({ error: "Failed to create Cryptomus invoice" }, { status: 500 });
      }
      if (existingPayment) {
        await db.payment.update({
          where: { id: existingPayment.id },
          data: {
            providerOrderId: String(result?.uuid || ""),
            approvalUrl: approveUrl,
            status: "APPROVAL_REQUIRED",
            raw: json as Prisma.InputJsonValue,
          },
        });
      } else {
        await db.payment.create({
          data: {
            orderId: order.id,
            provider,
            providerOrderId: String(result?.uuid || ""),
            approvalUrl: approveUrl,
            status: "APPROVAL_REQUIRED",
            raw: json as Prisma.InputJsonValue,
          },
        });
      }
      return NextResponse.redirect(approveUrl);
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

