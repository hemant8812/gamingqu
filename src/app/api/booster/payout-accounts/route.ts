import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

const CreateSchema = z.object({
  type: z.enum(["BANK", "EWALLET", "CRYPTO"]),
  providerName: z.string().trim().min(2).max(80),
  accountName: z.string().trim().min(2).max(80),
  accountRef: z.string().trim().min(4).max(200),
});

async function requireBooster() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (role !== "BOOSTER") return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ok: true as const, userId: session.user.id };
}

export async function GET() {
  const auth = await requireBooster();
  if (!auth.ok) return auth.res;
  try {
    const accounts = await db.boosterPayoutAccount.findMany({
      where: { userId: auth.userId, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        type: true,
        providerName: true,
        accountName: true,
        accountRef: true,
        createdAt: true,
      },
    });
    return NextResponse.json({
      accounts: accounts.map((a) => ({
        id: a.id,
        type: a.type,
        providerName: a.providerName,
        accountName: a.accountName,
        accountRef: a.accountRef,
        createdAt: a.createdAt,
      })),
      max: 4,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireBooster();
  if (!auth.ok) return auth.res;
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const count = await db.boosterPayoutAccount.count({
      where: { userId: auth.userId, isActive: true },
    });
    if (count >= 4) {
      return NextResponse.json({ error: "Max accounts reached" }, { status: 409 });
    }

    const created = await db.boosterPayoutAccount.create({
      data: {
        userId: auth.userId,
        type: parsed.data.type,
        providerName: parsed.data.providerName,
        accountName: parsed.data.accountName,
        accountRef: parsed.data.accountRef,
        isActive: true,
      },
      select: {
        id: true,
        type: true,
        providerName: true,
        accountName: true,
        accountRef: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        account: {
          id: created.id,
          type: created.type,
          providerName: created.providerName,
          accountName: created.accountName,
          accountRef: created.accountRef,
          createdAt: created.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.toLowerCase().includes("unique")) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
