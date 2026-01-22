import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { GameForm } from "@/components/GameForm";
import { PageToast } from "@/components/PageToast";
import { GameSearchInput } from "@/components/GameSearchInput";

async function getGames(q?: string) {
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
  const editing = editId ? await db.game.findUnique({ where: { id: editId } }) : null;
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

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Data Game</h2>
              <GameSearchInput />
            </div>
            <div className="mt-4 space-y-3">
              {games.length === 0 && (
                <div className="text-sm text-zinc-400">Belum ada data</div>
              )}
              {games.map((g) => (
                <a key={g.id} href={`/admin/games?edit=${g.id}`} className="flex items-center gap-4 rounded-xl border border-zinc-900 bg-black p-3 hover:bg-zinc-900/40">
                  <div className="w-16 h-16 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {g.imageUrl ? (
                      <Image src={g.imageUrl} alt={g.name} width={64} height={64} className="object-cover w-16 h-16" />
                    ) : (
                      <div className="text-xs text-zinc-500">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{g.name}</div>
                    <div className="text-xs text-zinc-500">{g.slug}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-md ${g.isActive ? "bg-green-600" : "bg-zinc-700"} text-white`}>{g.isActive ? "Aktif" : "Nonaktif"}</span>
                      {g.isHotOffer && <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white">Hot Offer</span>}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {g.iconUrl ? (
                      <Image src={g.iconUrl} alt="icon" width={40} height={40} className="object-cover w-10 h-10" />
                    ) : (
                      <div className="text-[10px] text-zinc-500">No icon</div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
