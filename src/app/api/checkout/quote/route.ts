import { NextResponse } from "next/server";
import { sanitizeSlug } from "@/lib/sanitize";
import { computeQuote } from "@/lib/checkoutQuote";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serviceSlug = sanitizeSlug(String(body?.serviceSlug ?? ""));
    const methodRaw = body?.method as string | undefined;
    const method = sanitizeSlug(String(methodRaw ?? "")) || undefined;
    const fromLevelRaw = body?.fromLevel;
    const toLevelRaw = body?.toLevel;
    const selectedOptions = Array.isArray(body?.selectedOptions) ? (body.selectedOptions as Array<{ title: string; values: string[] }>) : [];
    if (!serviceSlug) {
      return NextResponse.json({ error: "Missing serviceSlug" }, { status: 400 });
    }
    const quote = await computeQuote(serviceSlug, fromLevelRaw, toLevelRaw, selectedOptions, method);
    if (!("ok" in quote)) {
      return NextResponse.json(quote, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      basePrice: quote.basePrice,
      subtotal: quote.subtotal,
      totalPrice: quote.totalPrice,
      items: quote.items,
      fee: quote.fee,
      amount: quote.amount,
      range: quote.range,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
