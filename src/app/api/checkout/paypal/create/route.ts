import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";

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
    range: d.range as { min: number; max: number; step?: number; dual?: boolean } | undefined,
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
      where: { slug: "paypal" },
      select: { isActive: true, feePercent: true, feeFixed: true },
    });
    if (pm && pm.isActive) {
      const pct = pm.feePercent != null ? Number.parseFloat(pm.feePercent.toString()) : 0;
      const fix = pm.feeFixed != null ? Number.parseFloat(pm.feeFixed.toString()) : 0;
      fee = totalPrice * (pct / 100) + fix;
    } else {
      fee = totalPrice * 0.035 + 0.49;
    }
  } catch {
    fee = totalPrice * 0.035 + 0.49;
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
    const serviceSlug = String(body?.serviceSlug ?? "");
    const selectedOptions = Array.isArray(body?.selectedOptions) ? (body.selectedOptions as SelectedOption[]) : [];
    const fromLevelRaw = body?.fromLevel;
    const toLevelRaw = body?.toLevel;
    const contact: Contact = (body?.contact ?? {}) as Contact;
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
    try {
      const s = await db.websiteSetting.findUnique({
        where: { id: "singleton" },
        select: { webSharePercent: true },
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
    } catch {}
    const itemsNum = Number(quote.items);
    const boosterPercent = Math.max(0, Math.min(100, 100 - webShare));
    const boosterPay = itemsNum * (boosterPercent / 100);
    const code = `ORD-${Date.now().toString().slice(-9)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = await db.order.create({
      data: {
        code,
        service: { connect: { id: quote.serviceId! } },
        serviceSlug,
        methodSlug: "paypal",
        items: Number(quote.items),
        fee: Number(quote.fee),
        amount: Number(quote.amount),
        boosterPay: Number(boosterPay.toFixed(2)),
        currency: "USD",
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
              currency_code: "USD",
              value: Number(quote.amount).toFixed(2),
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
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", raw: created },
      });
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
    }
    const providerOrderId = String(created.id || "");
    const links: Array<{ rel?: string; href?: string }> = Array.isArray((created as { links?: unknown }).links)
      ? ((created as { links?: Array<{ rel?: string; href?: string }> }).links ?? [])
      : [];
    const approveUrl = links.find((l) => l.rel === "approve")?.href ?? "";
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
