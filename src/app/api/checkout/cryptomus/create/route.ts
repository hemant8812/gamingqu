import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import crypto from "crypto";
import type { Prisma } from "@/generated/prisma/client";

type SelectedOption = { title: string; values: string[] };
type Contact = { email?: string; discord?: string; characterName?: string };

async function computeQuote(serviceSlug: string, fromLevelRaw: unknown, toLevelRaw: unknown, selectedOptionsRaw: unknown) {
  const service = await db.service.findFirst({
    where: { slug: serviceSlug, isActive: true },
    select: { id: true, price: true },
  });
  if (!service) return { error: "Service not found" } as const;
  const basePrice = parseFloat(service.price.toString());
  const detailsRaw = await db.serviceDetail.findMany({
    where: { serviceId: service.id, isActive: true },
    select: {
      id: true,
      title: true,
      fieldName: true,
      inputType: true,
      displayType: true,
      priceType: true,
      price: true,
      sortOrder: true,
      options: true,
      range: true,
      inputMeta: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 200,
  });
  const details = detailsRaw.map((d) => ({
    id: d.id,
    title: d.title,
    fieldName: d.fieldName,
    inputType: d.inputType as "select" | "radio" | "range" | "checkbox" | "input",
    displayType: d.displayType as "number" | "text" | "dual" | "single" | null,
    priceType: d.priceType as "fixed" | "percent",
    price: typeof d.price === "number" ? d.price : parseFloat(String(d.price)),
    sortOrder: d.sortOrder,
    options: Array.isArray(d.options as unknown) ? (d.options as unknown as Array<{ label: string; price: number }>) : undefined,
    range: d.range as { min: number; max: number; step?: number; dual?: boolean; items?: Array<{ min: number; max: number; price: number }> } | undefined,
    inputMeta: d.inputMeta as { kind: "text" | "number"; min?: number; max?: number; required?: boolean } | undefined,
  }));
  const selectedOptions: SelectedOption[] = Array.isArray(selectedOptionsRaw) ? (selectedOptionsRaw as SelectedOption[]) : [];
  const rangeDual = details.filter((d) => d.inputType === "range" && ((d.displayType === "dual") || d.range?.dual));
  let minLevel: number | null = null;
  let maxLevel: number | null = null;
  for (const d of rangeDual) {
    const mn = Number(d.range?.min ?? Number.NEGATIVE_INFINITY);
    const mx = Number(d.range?.max ?? Number.POSITIVE_INFINITY);
    minLevel = minLevel == null ? mn : Math.min(minLevel, mn);
    maxLevel = maxLevel == null ? mx : Math.max(maxLevel, mx);
  }
  const fromLevel = Number.isFinite(fromLevelRaw as number) ? Number(fromLevelRaw) : null;
  const toLevel = Number.isFinite(toLevelRaw as number) ? Number(toLevelRaw) : null;
  let from = fromLevel;
  let to = toLevel;
  if (minLevel != null && maxLevel != null) {
    if (from == null) from = minLevel;
    if (to == null) to = maxLevel;
    if (from < minLevel) from = minLevel;
    if (from > maxLevel) from = maxLevel;
    if (to < minLevel) to = minLevel;
    if (to > maxLevel) to = maxLevel;
    if (to < from) to = from;
  }
  const diff = from != null && to != null ? Math.max(0, to - from) : 0;
  let rangeAdd = 0;
  if (diff > 0) {
    for (const d of rangeDual) {
      const items = d.range?.items;
      if (Array.isArray(items) && from != null && to != null) {
        const candidates = items.filter((it) => Number.isFinite(it.min) && Number.isFinite(it.max));
        if (candidates.length > 0) {
          let chosen = candidates[0];
          let bestScore = Math.abs(from - chosen.min) + Math.abs(to - chosen.max);
          for (let i = 1; i < candidates.length; i++) {
            const s = Math.abs(from - candidates[i].min) + Math.abs(to - candidates[i].max);
            if (s < bestScore) {
              bestScore = s;
              chosen = candidates[i];
            }
          }
          const deltaMax = to - chosen.max;
          const deltaMin = chosen.min - from;
          const price = Math.max(0, Number(chosen.price) + deltaMax * 1 + deltaMin * 1);
          if (Number.isFinite(price) && price > 0) {
            rangeAdd += price;
            continue;
          }
        }
      }
      const p = Number(d.price);
      if (Number.isFinite(p) && p > 0) {
        if (d.priceType === "percent") {
          rangeAdd += basePrice * (p / 100) * diff;
        } else {
          rangeAdd += p * diff;
        }
      }
    }
  }
  const extras: Array<{ price: number; kind: "fixed" | "percent" }> = [];
  const selMap = new Map<string, string[]>();
  for (const so of selectedOptions) {
    const t = String(so?.title ?? "").toLowerCase();
    const values = Array.isArray(so.values) ? so.values : [];
    selMap.set(t, values);
  }
  for (const d of details) {
    const req = !!d.inputMeta?.required;
    if (!req) continue;
    if (d.inputType === "range") continue;
    const key = String(d.title ?? "").toLowerCase();
    const vals = selMap.get(key) ?? [];
    if (d.inputType === "checkbox" && Array.isArray(d.options) && d.options.length > 0) {
      if (vals.length === 0) {
        return { error: "Required fields missing", fields: [d.title] } as const;
      }
    } else if (d.inputType === "select" || d.inputType === "radio" || d.inputType === "input") {
      const v0 = vals[0] ?? "";
      if (!v0) {
        return { error: "Required fields missing", fields: [d.title] } as const;
      } else if (d.inputType === "input" && d.inputMeta?.kind === "number") {
        const v = Number(v0);
        const minOk = d.inputMeta.min == null || v >= Number(d.inputMeta.min);
        const maxOk = d.inputMeta.max == null || v <= Number(d.inputMeta.max);
        if (!Number.isFinite(v) || !minOk || !maxOk) {
          return { error: "Required fields missing", fields: [d.title] } as const;
        }
      }
    }
  }
  for (const so of selectedOptions) {
    const t = String(so?.title ?? "").toLowerCase();
    const detail = details.find((d) => String(d.title ?? "").toLowerCase() === t);
    if (!detail || !Array.isArray(detail.options)) continue;
    const values = Array.isArray(so.values) ? so.values : [];
    for (const v of values) {
      const opt = detail.options.find((o) => o.label === v);
      if (opt && Number.isFinite(opt.price) && opt.price > 0) {
        extras.push({ price: opt.price, kind: detail.priceType === "percent" ? "percent" : "fixed" });
      }
    }
  }
  let fixedAdd = 0;
  let percentRate = 0;
  for (const e of extras) {
    if (e.kind === "fixed") fixedAdd += e.price;
    else percentRate += e.price;
  }
  const subtotal = basePrice + rangeAdd + fixedAdd;
  const percentAdd = subtotal * (percentRate / 100);
  const totalPrice = subtotal + percentAdd;
  let fee = 0;
  try {
    const pm = await db.paymentMethod.findUnique({
      where: { slug: "cryptomus" },
      select: { isActive: true, feePercent: true, feeFixed: true },
    });
    if (pm && pm.isActive) {
      const pct = pm.feePercent != null ? Number.parseFloat(pm.feePercent.toString()) : 0;
      const fix = pm.feeFixed != null ? Number.parseFloat(pm.feeFixed.toString()) : 0;
      fee = totalPrice * (pct / 100) + fix;
    } else {
      fee = 0;
    }
  } catch {
    fee = 0;
  }
  const amount = totalPrice + fee;
  return {
    ok: true as const,
    serviceId: service.id,
    basePrice,
    subtotal,
    totalPrice,
    items: totalPrice,
    fee,
    amount,
  };
}

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
    const serviceSlug = String(body?.serviceSlug ?? "");
    const selectedOptions = Array.isArray(body?.selectedOptions) ? (body.selectedOptions as SelectedOption[]) : [];
    const fromLevelRaw = body?.fromLevel;
    const toLevelRaw = body?.toLevel;
    const contact: Contact = (body?.contact ?? {}) as Contact;
    const currencyRaw = String(body?.currency ?? "").toUpperCase();
    const currencySelected = currencyRaw === "EUR" ? "EUR" : "USD";
    if (!serviceSlug) {
      return NextResponse.json({ error: "Missing serviceSlug" }, { status: 400 });
    }
    const quote = await computeQuote(serviceSlug, fromLevelRaw, toLevelRaw, selectedOptions);
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
    const amountFromUi = Number(body?.amount ?? NaN);
    const amountNum = Number.isFinite(amountFromUi) ? amountFromUi : Number(quote.amount) * rate;
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
        contactEmail: (contact.email ?? "").trim() || undefined,
        contactDiscord: (contact.discord ?? "").trim() || undefined,
        characterName: (contact.characterName ?? "").trim() || undefined,
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
      return NextResponse.json({ error: "Missing Cryptomus credentials" }, { status: 500 });
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
      return NextResponse.json({ error: "Failed to create Cryptomus invoice" }, { status: 500 });
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
