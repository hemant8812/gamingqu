import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { canAccessAdminSection } from "@/lib/adminAccess";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if ((role !== "ADMIN" && role !== "SUPERADMIN") || !(await canAccessAdminSection("orders"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const takeRaw = searchParams.get("take");
  const take = Math.min(5000, Math.max(1, parseInt(String(takeRaw || "1000"), 10) || 1000));

  try {
    const orders = await db.order.findMany({
      orderBy: [{ createdAt: "desc" }],
      take,
      select: {
        code: true,
        user: { select: { id: true, username: true } },
        service: { select: { name: true, game: { select: { name: true } } } },
        methodSlug: true,
        status: true,
        fulfillmentStatus: true,
        items: true,
        fee: true,
        amount: true,
        currency: true,
        contactEmail: true,
        contactDiscord: true,
        characterName: true,
        createdAt: true,
      },
    });

    const rows = (q
      ? orders.filter((o) => {
          const code = o.code.toLowerCase();
          const user = (o.user?.username ?? "").toLowerCase();
          const uid = (o.user?.id ?? "").toLowerCase();
          const svc = (o.service?.name ?? "").toLowerCase();
          const game = (o.service?.game?.name ?? "").toLowerCase();
          const method = (o.methodSlug ?? "").toLowerCase();
          return (
            code.includes(q) ||
            user.includes(q) ||
            uid.includes(q) ||
            svc.includes(q) ||
            game.includes(q) ||
            method.includes(q)
          );
        })
      : orders
    ).map((o) => ({
      Code: o.code,
      UserID: o.user?.id ?? "",
      Username: o.user?.username ?? "",
      Service: o.service?.name ?? "",
      Game: o.service?.game?.name ?? "",
      Method: o.methodSlug.toUpperCase(),
      PaymentStatus: o.status,
      FulfillmentStatus: o.fulfillmentStatus,
      Items: Number.parseFloat(o.items.toString()),
      Fee: Number.parseFloat(o.fee.toString()),
      Amount: Number.parseFloat(o.amount.toString()),
      Currency: o.currency,
      Email: o.contactEmail ?? "",
      Discord: o.contactDiscord ?? "",
      Character: o.characterName ?? "",
      CreatedAt: o.createdAt.toISOString(),
    }));

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Orders");
    ws.columns = [
      { header: "Code", key: "Code", width: 18 },
      { header: "UserID", key: "UserID", width: 16 },
      { header: "Username", key: "Username", width: 18 },
      { header: "Service", key: "Service", width: 24 },
      { header: "Game", key: "Game", width: 18 },
      { header: "Method", key: "Method", width: 12 },
      { header: "PaymentStatus", key: "PaymentStatus", width: 16 },
      { header: "FulfillmentStatus", key: "FulfillmentStatus", width: 18 },
      { header: "Items", key: "Items", width: 12 },
      { header: "Fee", key: "Fee", width: 12 },
      { header: "Amount", key: "Amount", width: 12 },
      { header: "Currency", key: "Currency", width: 10 },
      { header: "Email", key: "Email", width: 24 },
      { header: "Discord", key: "Discord", width: 20 },
      { header: "Character", key: "Character", width: 18 },
      { header: "CreatedAt", key: "CreatedAt", width: 24 },
    ];
    rows.forEach((r) => ws.addRow(r));
    const buf = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(buf) ? buf : Buffer.from(buf as ArrayBuffer);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=orders.xlsx",
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
