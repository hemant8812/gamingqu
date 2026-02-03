import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serviceSlug = String(body?.serviceSlug ?? "");
    const method = body?.method as string | undefined;
    const fromLevelRaw = body?.fromLevel;
    const toLevelRaw = body?.toLevel;
    const selectedOptions = Array.isArray(body?.selectedOptions) ? body.selectedOptions as Array<{ title: string; values: string[] }> : [];
    if (!serviceSlug) {
      return NextResponse.json({ error: "Missing serviceSlug" }, { status: 400 });
    }
    const service = await db.service.findFirst({
      where: { slug: serviceSlug, isActive: true },
      select: { id: true, price: true },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
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
      inputMeta: d.inputMeta as { kind: "text" | "number"; min?: number; max?: number } | undefined,
    }));
    const rangeDual = details.filter((d) => d.inputType === "range" && ((d.displayType === "dual") || d.range?.dual));
    let minLevel: number | null = null;
    let maxLevel: number | null = null;
    for (const d of rangeDual) {
      const mn = Number(d.range?.min ?? Number.NEGATIVE_INFINITY);
      const mx = Number(d.range?.max ?? Number.POSITIVE_INFINITY);
      minLevel = minLevel == null ? mn : Math.min(minLevel, mn);
      maxLevel = maxLevel == null ? mx : Math.max(maxLevel, mx);
    }
    const fromLevel = Number.isFinite(fromLevelRaw) ? Number(fromLevelRaw) : null;
    const toLevel = Number.isFinite(toLevelRaw) ? Number(toLevelRaw) : null;
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
      if (method) {
        const pm = await db.paymentMethod.findUnique({
          where: { slug: method },
          select: { isActive: true, feePercent: true, feeFixed: true },
        });
        if (pm && pm.isActive) {
          const pct = pm.feePercent != null ? Number.parseFloat(pm.feePercent.toString()) : 0;
          const fix = pm.feeFixed != null ? Number.parseFloat(pm.feeFixed.toString()) : 0;
          fee = totalPrice * (pct / 100) + fix;
        } else {
          if (method === "card") {
            fee = totalPrice * 0.029 + 0.3;
          } else if (method === "paypal") {
            fee = totalPrice * 0.035 + 0.49;
          } else {
            fee = 0;
          }
        }
      }
    } catch {
      if (method === "card") {
        fee = totalPrice * 0.029 + 0.3;
      } else if (method === "paypal") {
        fee = totalPrice * 0.035 + 0.49;
      } else {
        fee = 0;
      }
    }
    const amount = totalPrice + fee;
    return NextResponse.json({
      ok: true,
      basePrice,
      subtotal,
      totalPrice,
      items: totalPrice,
      fee,
      amount,
      range: { from, to },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
