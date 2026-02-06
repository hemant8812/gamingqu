import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import crypto from "crypto";
import type { Prisma } from "@/generated/prisma/client";
import { limitLen } from "@/lib/sanitize";

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
      const baseUrl = getBaseUrl();
      const url = new URL(req.url);
      const orderCode = url.searchParams.get("order") || "";
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=not_signed_in${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
    }
    const url = new URL(req.url);
    const orderCodeUnsafe = url.searchParams.get("order") || "";
    const orderCode = limitLen(orderCodeUnsafe.replace(/[^A-Za-z0-9-]/g, ""), 64);
    if (!orderCode) {
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=missing_order_code`);
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
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=order_not_found${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
    }
    if (order.status !== "PENDING") {
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=order_not_pending${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
    }
    const provider = order.methodSlug === "paypal" ? "paypal" : order.methodSlug === "cryptomus" ? "cryptomus" : null;
    if (!provider) {
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/checkout/error?code=unsupported_method${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
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
        return NextResponse.redirect(`${baseUrl}/checkout/error?code=paypal_create_failed${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
      }
      const providerOrderId = String(created.id || "");
      const links: Array<{ rel?: string; href?: string }> = Array.isArray((created as { links?: unknown }).links)
        ? ((created as { links?: Array<{ rel?: string; href?: string }> }).links ?? [])
        : [];
      const approveUrl = links.find((l) => l.rel === "approve")?.href ?? "";
      if (!approveUrl) {
        return NextResponse.redirect(`${baseUrl}/checkout/error?code=missing_approve_url${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
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
        return NextResponse.redirect(`${baseUrl}/checkout/error?code=cryptomus_credentials_missing${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
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
        return NextResponse.redirect(`${baseUrl}/checkout/error?code=cryptomus_create_failed${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
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
    const url = new URL(req.url);
    const orderCode = url.searchParams.get("order") || "";
    const baseUrl = getBaseUrl();
    return NextResponse.redirect(`${baseUrl}/checkout/error?code=server_error${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
  }
}

