import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { PageToast } from "@/components/shared/PageToast";
import { GameManager } from "@/components/admin/games/GameManager";
import { normalizeQuery, parseToast } from "@/lib/page-utils";

async function getGames(q?: string) {
  try {
    const list = await db.game.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      where: q
        ? {
            OR: [
              { name: { startsWith: q } },
              { slug: { startsWith: q } },
              { name: { contains: q } },
              { slug: { contains: q } },
              ...(q.length >= 3 ? [{ description: { contains: q } }] : []),
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        iconUrl: true,
        isHotOffer: true,
        isActive: true,
      },
    });
    return list;
  } catch {
    return [];
  }
}

export default async function AdminGamesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
  }
  const sp = await searchParams;
  const q = normalizeQuery(sp, "q", 64);
  const games = await getGames(q || undefined);
  const editParam = sp?.edit;
  const editId = typeof editParam === "string" ? editParam : Array.isArray(editParam) ? editParam[0] ?? null : null;
  let editing = null as null | {
    id: string; name: string; slug: string; imageUrl: string | null; iconUrl: string | null; description: string | null; isHotOffer: boolean; isActive: boolean;
  };
  if (editId) {
    try {
      editing = await db.game.findUnique({
        where: { id: editId },
        select: { id: true, name: true, slug: true, imageUrl: true, iconUrl: true, description: true, isHotOffer: true, isActive: true },
      });
    } catch {
      editing = null;
    }
  }
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast
    ? toast === "updated"
      ? "Data berhasil diupdate"
      : toast === "error"
      ? "Terjadi kesalahan saat menyimpan data"
      : "Data berhasil disimpan"
    : undefined;

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <GameManager games={games} editing={editing} />
      </div>
    </div>
  );
}
