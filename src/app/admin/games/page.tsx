import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { GameForm } from "@/components/admin/games/GameForm";
import { PageToast } from "@/components/shared/PageToast";
import { GameList } from "@/components/admin/games/GameList";

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
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const sp = await searchParams;
  const qParam = sp?.q;
  const qRaw = typeof qParam === "string" ? qParam : Array.isArray(qParam) ? qParam[0] ?? "" : "";
  const q = qRaw.trim().slice(0, 64);
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
  const toastParam = sp?.toast;
  const toast = typeof toastParam === "string" ? toastParam : Array.isArray(toastParam) ? toastParam[0] ?? undefined : undefined;
  const toastMessage = toast
    ? toast === "updated"
      ? "Data berhasil diupdate"
      : toast === "error"
      ? "Terjadi kesalahan saat menyimpan data"
      : "Data berhasil disimpan"
    : undefined;
  const toastType = toast === "error" ? "error" : "success";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <h1 className="text-3xl font-bold">Manage Games</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tambah data game: nama, slug otomatis, upload gambar & icon, deskripsi, Hot Offer, status aktif.
        </p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameForm editing={editing ? {
            id: editing.id,
            name: editing.name,
            slug: editing.slug,
            imageUrl: editing.imageUrl ?? null,
            iconUrl: editing.iconUrl ?? null,
            description: editing.description ?? null,
            isHotOffer: editing.isHotOffer,
            isActive: editing.isActive,
          } : null} />

          <GameList games={games} />
        </section>
      </div>
    </div>
  );
}
