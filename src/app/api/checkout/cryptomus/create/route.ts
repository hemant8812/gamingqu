import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import crypto from "crypto";
import type { Prisma } from "@/generated/prisma/client";
import { sanitizeSlug, normalizeEmail, sanitizePlain, limitLen } from "@/lib/sanitize";
import { computeQuote } from "@/lib/checkoutQuote";

type SelectedOption = { title: string; values: string[] };
type Contact = { email?: string; discord?: string; characterName?: string };

 

function signCryptomus(body: unknown) {
  const apiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY || "";
  const json = JSON.stringify(body ?? {});
  const b64 = Buffer.from(json).toString("base64");
  const hash = crypto.createHash("md5").update(b64 + apiKey).digest("hex");
  return hash;
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
    const currencySelected = currencyRaw === "EUR" ? "EUR" : "USD";
    if (!serviceSlug) {
      return NextResponse.json({ error_code: "missing_serviceSlug", error: "Missing serviceSlug" }, { status: 400 });
    }
    const quote = await computeQuote(serviceSlug, fromLevelRaw, toLevelRaw, selectedOptions, "cryptomus");
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
    const rate = currencySelected === "EUR" ? eurPerUsd : 1;
    const itemsNumUsd = Number(quote.items);
    const boosterPercent = Math.max(0, Math.min(100, 100 - webShare));
    const boosterPayUsd = itemsNumUsd * (boosterPercent / 100);
    const itemsNum = itemsNumUsd * rate;
    const feeNum = Number(quote.fee) * rate;
    const amountNum = Number(quote.amount) * rate;
    const boosterPay = boosterPayUsd * rate;
    const itemsNumUsdFinal = itemsNumUsd;
    const feeNumUsdFinal = Number(quote.fee);
    const amountNumUsdFinal = Number(quote.amount);
    const boosterPayUsdFinal = boosterPayUsd;
    const code = `ORD-${Date.now().toString().slice(-9)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = await db.order.create({
      data: {
        code,
        service: { connect: { id: quote.serviceId! } },
        serviceSlug,
        methodSlug: "cryptomus",
        items: Number(itemsNum),
        fee: Number(feeNum),
        amount: Number(amountNum),
        boosterPay: Number(boosterPay.toFixed(2)),
        currency: currencySelected,
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
        provider: "cryptomus",
        status: "APPROVAL_REQUIRED",
      },
    });
    const baseUrl = getBaseUrl();
    const merchant = process.env.CRYPTOMUS_MERCHANT_UUID || "";
    if (!merchant || !process.env.CRYPTOMUS_PAYMENT_API_KEY) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error_code: "cryptomus_credentials_missing", error: "Missing Cryptomus credentials", orderCode: order.code }, { status: 500 });
    }
    const attempt = async (currencyCode: "USD" | "EUR", amountValue: number) => {
      const bodyData = {
        amount: Number(amountValue).toFixed(2),
        currency: currencyCode,
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
      return { ok: res.ok && !!result?.url, json, result };
    };
    let invoice = await attempt(currencySelected, amountNum);
    if (!invoice.ok && currencySelected === "EUR") {
      invoice = await attempt("USD", amountNumUsdFinal);
      if (invoice.ok) {
        await db.order.update({
          where: { id: order.id },
          data: {
            currency: "USD",
            items: Number(itemsNumUsdFinal),
            fee: Number(feeNumUsdFinal),
            amount: Number(amountNumUsdFinal),
            boosterPay: Number(boosterPayUsdFinal.toFixed(2)),
          },
        });
      }
    }
    if (!invoice.ok) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", raw: invoice.json as Prisma.InputJsonValue },
      });
      return NextResponse.json({ error_code: "cryptomus_create_failed", error: "Failed to create Cryptomus invoice", orderCode: order.code }, { status: 500 });
    }
    const providerOrderId = String(invoice.result?.uuid || "");
    const approveUrl = String(invoice.result?.url || "");
    await db.payment.update({
      where: { id: payment.id },
      data: {
        providerOrderId,
        approvalUrl: approveUrl || undefined,
        raw: invoice.json as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ ok: true, redirectUrl: approveUrl, orderCode: order.code });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
