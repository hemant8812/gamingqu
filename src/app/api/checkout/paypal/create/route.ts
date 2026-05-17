import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import { sanitizeSlug, normalizeEmail, sanitizePlain, limitLen } from "@/lib/sanitize";
import { computeQuote } from "@/lib/checkoutQuote";
import { SITE_DEFAULTS } from "@/lib/constants";

type SelectedOption = { title: string; values: string[] };
type Contact = { email?: string; discord?: string; characterName?: string };

 

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serviceSlug = sanitizeSlug(String(body?.serviceSlug ?? ""));
    const selectedOptions = Array.isArray(body?.selectedOptions) ? (body.selectedOptions as SelectedOption[]) : [];
    const fromLevelRaw = body?.fromLevel;
    const toLevelRaw = body?.toLevel;
    const contact: Contact = (body?.contact ?? {}) as Contact;
    const currencyRaw = String(body?.currency ?? "").toUpperCase();
    const currencyCode = currencyRaw === "EUR" ? "EUR" : "USD";
    if (!serviceSlug) {
      return NextResponse.json({ error_code: "missing_serviceSlug", error: "Missing serviceSlug" }, { status: 400 });
    }
    const quote = await computeQuote(serviceSlug, fromLevelRaw, toLevelRaw, selectedOptions, "paypal");
    if (!("ok" in quote)) {
      return NextResponse.json(quote, { status: 400 });
    }
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    let webShare = 50;
    let eurPerUsd = 1;
    try {
      const s = await db.websiteSetting.findUnique({
        where: { id: "singleton" },
        select: { webSharePercent: true, eurPerUsd: true },
      });
      const v =
        typeof s?.webSharePercent === "number"
          ? s?.webSharePercent
          : s?.webSharePercent
          ? Number(s?.webSharePercent)
          : undefined;
      if (Number.isFinite(v as number)) {
        webShare = Math.max(0, Math.min(100, v as number));
      }
      const r =
        typeof s?.eurPerUsd === "number"
          ? s?.eurPerUsd
          : s?.eurPerUsd
          ? Number(s?.eurPerUsd)
          : undefined;
      if (Number.isFinite(r as number) && (r as number) > 0) {
        eurPerUsd = r as number;
      }
    } catch {}
    const rate = currencyCode === "EUR" ? eurPerUsd : 1;
    const itemsNumUsd = Number(quote.items);
    const boosterPercent = Math.max(0, Math.min(100, 100 - webShare));
    const boosterPayUsd = itemsNumUsd * (boosterPercent / 100);
    const itemsNum = itemsNumUsd * rate;
    const feeNum = Number(quote.fee) * rate;
    const amountNum = Number(quote.amount) * rate;
    const boosterPay = boosterPayUsd * rate;
    const code = `ORD-${Date.now().toString().slice(-9)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = await db.order.create({
      data: {
        code,
        service: { connect: { id: quote.serviceId! } },
        serviceSlug,
        methodSlug: "paypal",
        items: Number(itemsNum),
        fee: Number(feeNum),
        amount: Number(amountNum),
        boosterPay: Number(boosterPay.toFixed(2)),
        currency: currencyCode,
        status: "PENDING",
        fulfillmentStatus: "PENDING",
        contactEmail: limitLen(normalizeEmail(contact.email ?? ""), 200) || undefined,
        contactDiscord: limitLen(sanitizePlain(contact.discord ?? ""), 120) || undefined,
        characterName: limitLen(sanitizePlain(contact.characterName ?? ""), 120) || undefined,
        payload: { selectedOptions, range: { from: fromLevelRaw, to: toLevelRaw } },
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
    });
    const payment = await db.payment.create({
      data: {
        orderId: order.id,
        provider: "paypal",
        status: "APPROVAL_REQUIRED",
      },
    });
    const { accessToken, base } = await getPaypalAccessToken();
    const baseUrl = getBaseUrl();
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
              currency_code: currencyCode,
              value: Number(amountNum).toFixed(2),
            },
            custom_id: order.code,
          },
        ],
        application_context: {
          brand_name: SITE_DEFAULTS.name,
          user_action: "PAY_NOW",
          return_url: `${baseUrl}/api/payments/paypal/return?order=${encodeURIComponent(order.code)}`,
          cancel_url: `${baseUrl}/api/payments/paypal/cancel?order=${encodeURIComponent(order.code)}`,
        },
      }),
    });
    const created = await createRes.json();
    if (!createRes.ok) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", raw: created },
      });
      return NextResponse.json({ error_code: "paypal_create_failed", error: "Failed to create PayPal order", orderCode: order.code }, { status: 500 });
    }
    const providerOrderId = String(created.id || "");
    const links: Array<{ rel?: string; href?: string }> = Array.isArray((created as { links?: unknown }).links)
      ? ((created as { links?: Array<{ rel?: string; href?: string }> }).links ?? [])
      : [];
    const approveUrl = links.find((l) => l.rel === "approve")?.href ?? "";
    if (!approveUrl) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", raw: created },
      });
      return NextResponse.json({ error_code: "missing_approve_url", error: "No approval URL", orderCode: order.code }, { status: 500 });
    }
    await db.payment.update({
      where: { id: payment.id },
      data: {
        providerOrderId,
        approvalUrl: approveUrl || undefined,
        raw: created,
      },
    });
    return NextResponse.json({ ok: true, redirectUrl: approveUrl, orderCode: order.code });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
