import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { ids } = await req.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    // Update each category's sortOrder based on its index in the array
    await db.$transaction(
      ids.map((id, index) =>
        db.category.update({
          where: { id: Number(id) },
          data: { sortOrder: index + 1 },
        })
      )
    );

    revalidateTag("categories", { expire: 0 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Reorder categories error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
