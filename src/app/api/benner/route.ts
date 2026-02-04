import { NextResponse } from "next/server";
import { getBanners } from "@/lib/settings";

export async function GET() {
  try {
    const list = await getBanners(10);
    return NextResponse.json({ ok: true, banners: list });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
