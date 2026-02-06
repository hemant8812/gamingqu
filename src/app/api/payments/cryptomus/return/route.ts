import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/site";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderCode = (searchParams.get("order") || "").trim();
  const baseUrl = getBaseUrl();
  return NextResponse.redirect(`${baseUrl}/dashboard/orders?paid=1${orderCode ? `&order=${encodeURIComponent(orderCode)}` : ""}`);
}
