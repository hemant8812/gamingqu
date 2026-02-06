import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function escPdfText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makeStyledPdf(data: {
  orderCode: string;
  totalText: string;
  methodText: string;
  statusText: string;
  dateText: string;
  timeText: string;
}) {
  const header = "%PDF-1.4\n";
  const objects: Array<{ id: number; body: string }> = [];
  const streamParts: string[] = [];
  
  // Page dimensions
  const pageW = 595;
  const pageH = 842;
  
  // Background gradient effect (light gray)
  streamParts.push(
    "q",
    "0.96 0.97 0.98 rg",
    `0 0 ${pageW} ${pageH} re`,
    "f",
    "Q"
  );
  
  // Main card container with shadow effect
  const cardX = 50;
  const cardY = 720;
  const cardW = 495;
  const cardH = 620;
  
  // Shadow
  streamParts.push(
    "q",
    "0.85 0.85 0.85 rg",
    `${cardX + 3} ${cardY - cardH - 3} ${cardW} ${cardH} re`,
    "f",
    "Q"
  );
  
  // Card background (white)
  streamParts.push(
    "q",
    "1 1 1 rg",
    `${cardX} ${cardY - cardH} ${cardW} ${cardH} re`,
    "f",
    "Q"
  );
  
  // Header section with gradient background
  const headerH = 140;
  streamParts.push(
    "q",
    "0.2 0.4 0.8 rg", // Blue gradient
    `${cardX} ${cardY - headerH} ${cardW} ${headerH} re`,
    "f",
    "Q"
  );
  
  // Success icon (checkmark circle)
  const iconCenterX = cardX + cardW / 2;
  const iconCenterY = cardY - 50;
  const iconRadius = 20;
  
  // Circle background (white)
  streamParts.push(
    "q",
    "1 1 1 rg",
    "1 w",
    `${iconCenterX} ${iconCenterY} m`,
    `${iconCenterX + iconRadius} ${iconCenterY} ${iconCenterX + iconRadius} ${iconCenterY + iconRadius} ${iconCenterX} ${iconCenterY + iconRadius} c`,
    `${iconCenterX - iconRadius} ${iconCenterY + iconRadius} ${iconCenterX - iconRadius} ${iconCenterY} ${iconCenterX - iconRadius} ${iconCenterY} c`,
    `${iconCenterX - iconRadius} ${iconCenterY - iconRadius} ${iconCenterX} ${iconCenterY - iconRadius} ${iconCenterX} ${iconCenterY - iconRadius} c`,
    `${iconCenterX + iconRadius} ${iconCenterY - iconRadius} ${iconCenterX + iconRadius} ${iconCenterY} ${iconCenterX + iconRadius} ${iconCenterY} c`,
    "f",
    "Q"
  );
  
  // Checkmark
  streamParts.push(
    "q",
    "0.2 0.7 0.4 RG",
    "3 w",
    "1 J 1 j",
    `${iconCenterX - 8} ${iconCenterY} m`,
    `${iconCenterX - 2} ${iconCenterY - 6} l`,
    `${iconCenterX + 8} ${iconCenterY + 8} l`,
    "S",
    "Q"
  );
  
  // Title
  streamParts.push(
    "BT",
    "/F1 32 Tf",
    "1 1 1 rg",
    `${cardX + cardW / 2 - 135} ${cardY - 105} Td`,
    `(${escPdfText("Payment Successful")}) Tj`,
    "ET"
  );
  
  // Subtitle
  streamParts.push(
    "BT",
    "/F1 11 Tf",
    "0.9 0.95 1 rg",
    `${cardX + cardW / 2 - 115} ${cardY - 128} Td`,
    `(${escPdfText("Thank you for your payment!")}) Tj`,
    "ET"
  );
  
  // Amount section with background
  const amountY = cardY - 200;
  streamParts.push(
    "q",
    "0.95 0.97 1 rg",
    `${cardX + 30} ${amountY - 50} ${cardW - 60} 70 re`,
    "f",
    "Q"
  );
  
  // Amount label
  streamParts.push(
    "BT",
    "/F1 10 Tf",
    "0.4 0.5 0.6 rg",
    `${cardX + 50} ${amountY - 15} Td`,
    `(${escPdfText("TOTAL AMOUNT")}) Tj`,
    "ET"
  );
  
  // Amount value (large)
  streamParts.push(
    "BT",
    "/F2 36 Tf",
    "0.2 0.4 0.8 rg",
    `${cardX + 50} ${amountY - 45} Td`,
    `(${escPdfText(data.totalText)}) Tj`,
    "ET"
  );
  
  // Details section
  const detailsY = cardY - 310;
  const leftCol = cardX + 50;
  const rightCol = cardX + 280;
  let currentY = detailsY;
  
  // Section title
  streamParts.push(
    "BT",
    "/F2 14 Tf",
    "0.2 0.3 0.4 rg",
    `${leftCol} ${currentY} Td`,
    `(${escPdfText("Transaction Details")}) Tj`,
    "ET"
  );
  
  // Divider line
  streamParts.push(
    "q",
    "0.85 0.87 0.9 RG",
    "1 w",
    `${leftCol} ${currentY - 10} m`,
    `${cardX + cardW - 50} ${currentY - 10} l`,
    "S",
    "Q"
  );
  
  currentY -= 40;
  
  const details = [
    { label: "Order ID", value: data.orderCode },
    { label: "Payment Method", value: data.methodText },
    { label: "Date", value: data.dateText },
    { label: "Time", value: data.timeText },
    { label: "Status", value: data.statusText },
  ];
  
  for (const detail of details) {
    // Label
    streamParts.push(
      "BT",
      "/F1 11 Tf",
      "0.45 0.55 0.65 rg",
      `${leftCol} ${currentY} Td`,
      `(${escPdfText(detail.label)}) Tj`,
      "ET"
    );
    
    // Value with status color
    const isStatus = detail.label === "Status";
    const valueColor = isStatus 
      ? (data.statusText === "Completed" ? "0.2 0.7 0.4 rg" : 
         data.statusText === "Cancelled" ? "0.9 0.3 0.3 rg" : 
         "0.95 0.65 0.2 rg")
      : "0.15 0.25 0.35 rg";
    
    streamParts.push(
      "BT",
      isStatus ? "/F2 11 Tf" : "/F1 11 Tf",
      valueColor,
      `${rightCol} ${currentY} Td`,
      `(${escPdfText(detail.value)}) Tj`,
      "ET"
    );
    
    currentY -= 35;
    
    // Subtle divider
    if (detail !== details[details.length - 1]) {
      streamParts.push(
        "q",
        "0.92 0.94 0.96 RG",
        "0.5 w",
        `${leftCol} ${currentY + 15} m`,
        `${cardX + cardW - 50} ${currentY + 15} l`,
        "S",
        "Q"
      );
    }
  }
  
  // Footer section
  const footerY = cardY - cardH + 60;
  
  // Divider
  streamParts.push(
    "q",
    "0.85 0.87 0.9 RG",
    "1 w",
    `${cardX + 50} ${footerY + 30} m`,
    `${cardX + cardW - 50} ${footerY + 30} l`,
    "S",
    "Q"
  );
  
  // Footer text
  streamParts.push(
    "BT",
    "/F1 9 Tf",
    "0.5 0.6 0.7 rg",
    `${cardX + cardW / 2 - 95} ${footerY + 10} Td`,
    `(${escPdfText("This is an official payment receipt")}) Tj`,
    "ET"
  );
  
  streamParts.push(
    "BT",
    "/F1 8 Tf",
    "0.6 0.65 0.7 rg",
    `${cardX + cardW / 2 - 75} ${footerY - 5} Td`,
    `(${escPdfText("Generated on " + new Date().toLocaleDateString())}) Tj`,
    "ET"
  );

  const stream = streamParts.join("\n") + "\n";
  const streamLen = Buffer.byteLength(stream, "utf8");
  
  const obj1 = { id: 1, body: "<< /Type /Catalog /Pages 2 0 R >>" };
  const obj2 = { id: 2, body: "<< /Type /Pages /Kids [3 0 R] /Count 1 >>" };
  const obj5 = { id: 5, body: "<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>" };
  const obj6 = { id: 6, body: "<< /Type /Font /Subtype /Type1 /Name /F2 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>" };
  const obj4 = { id: 4, body: `<< /Length ${streamLen} >>\nstream\n${stream}endstream` };
  const obj3 = {
    id: 3,
    body: "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
  };
  
  objects.push(obj1, obj2, obj5, obj6, obj4, obj3);
  
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
  for (let i = 1; i <= objects.length; i++) {
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
    const printTotalText = symbol === "€" ? `EUR ${Number.parseFloat(rec.amount.toString()).toFixed(2)}` : totalText;
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
    const pdf = makeStyledPdf({
      orderCode,
      totalText: printTotalText,
      methodText,
      statusText,
      dateText,
      timeText,
    });
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