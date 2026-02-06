import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function escPdfText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makePdf(lines: string[]) {
  const header = "%PDF-1.4\n";
  const objects: Array<{ id: number; body: string }> = [];
  const textLines = lines.map((l) => `(${escPdfText(l)}) Tj`).join("\n0 -20 Td\n");
  const stream = `BT\n/F1 12 Tf\n72 770 Td\n${textLines}\nET\n`;
  const streamLen = Buffer.byteLength(stream, "utf8");
  const obj1 = { id: 1, body: "<< /Type /Catalog /Pages 2 0 R >>" };
  const obj2 = { id: 2, body: "<< /Type /Pages /Kids [3 0 R] /Count 1 >>" };
  const obj5 = { id: 5, body: "<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica >>" };
  const obj4 = { id: 4, body: `<< /Length ${streamLen} >>\nstream\n${stream}endstream` };
  const obj3 = {
    id: 3,
    body:
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  };
  objects.push(obj1, obj2, obj5, obj4, obj3);
  const chunks: Buffer[] = [];
  let pos = 0;
  const addStr = (s: string) => {
    const b = Buffer.from(s, "utf8");
    chunks.push(b);
    pos += b.length;
  };
  const offsets: number[] = [];
  addStr(header);
  for (const obj of objects) {
    offsets[obj.id] = pos;
    addStr(`${obj.id} 0 obj\n${obj.body}\nendobj\n`);
  }
  const xrefStart = pos;
  const pad = (n: number) => String(n).padStart(10, "0");
  addStr("xref\n");
  addStr(`0 ${objects.length + 1}\n`);
  addStr("0000000000 65535 f \n");
  for (let i = 1; i <= objects.length + 0; i++) {
    const off = offsets[i] ?? 0;
    addStr(`${pad(off)} 00000 n \n`);
  }
  addStr("trailer\n");
  addStr(`<< /Root 1 0 R /Size ${objects.length + 1} >>\n`);
  addStr("startxref\n");
  addStr(`${xrefStart}\n`);
  addStr("%%EOF\n");
  return Buffer.concat(chunks);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderCode = (url.searchParams.get("order") || "").trim();
  if (!orderCode) {
    return NextResponse.json({ error: "Missing order code" }, { status: 400 });
  }
  try {
    const rec = await db.order.findUnique({
      where: { code: orderCode },
      select: { amount: true, currency: true, methodSlug: true, status: true, fulfillmentStatus: true, createdAt: true },
    });
    if (!rec) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const symbol = rec.currency === "EUR" ? "€" : "$";
    const totalText = `${symbol}${Number.parseFloat(rec.amount.toString()).toFixed(2)}`;
    const methodText = rec.methodSlug ? rec.methodSlug.charAt(0).toUpperCase() + rec.methodSlug.slice(1) : "-";
    const dt = new Date(rec.createdAt as unknown as string);
    const dateText = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(dt);
    const timeText = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(dt);
    const statusText =
      rec.status === "PAID"
        ? "Completed"
        : rec.status === "CANCELED" || rec.status === "FAILED"
        ? "Cancelled"
        : rec.fulfillmentStatus === "IN_PROGRESS" || rec.fulfillmentStatus === "ACCEPTED"
        ? "In Progress"
        : "Pending";
    const lines = [
      "Payment Receipt",
      `Order: ${orderCode}`,
      `Total: ${totalText}`,
      `Payment Method: ${methodText}`,
      `Status: ${statusText}`,
      `Date: ${dateText} ${timeText}`,
    ];
    const pdf = makePdf(lines);
    const filename = `receipt-${orderCode}.pdf`;
    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
