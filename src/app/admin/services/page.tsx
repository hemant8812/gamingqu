import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { PageToast } from "@/components/shared/PageToast";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { ServiceList } from "@/components/admin/services/ServiceList";
import { GameSearchInput } from "@/components/admin/games/GameSearchInput";

async function getServices(q?: string) {
  try {
    const list = await db.service.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { slug: { startsWith: q } },
              { slug: { contains: q } },
            ],
          }
        : undefined,
      orderBy: [{ createdAt: "desc" }],
      take: 50,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        isHotOffer: true,
        isActive: true,
        imageUrl: true,
        game: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });
    return list.map((s) => ({ ...s, price: s.price.toString() }));
  } catch {
    return [];
  }
}

export default async function AdminServicesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const toastParam = sp?.toast;
  const toast = typeof toastParam === "string" ? toastParam : Array.isArray(toastParam) ? toastParam[0] ?? undefined : undefined;
  const toastMessage = toast
    ? toast === "updated"
      ? "Layanan berhasil diupdate"
      : toast === "deleted"
      ? "Layanan berhasil dihapus"
      : toast === "error"
      ? "Gagal menyimpan layanan"
      : "Layanan berhasil disimpan"
    : undefined;
  const toastType = toast === "error" ? "error" : "success";
  const qParam = sp?.q;
  const qRaw = typeof qParam === "string" ? qParam : Array.isArray(qParam) ? qParam[0] ?? "" : "";
  const q = qRaw.trim().slice(0, 64);
  const games = await (async () => {
    try {
      return await db.game.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
    } catch {
      return [];
    }
  })();
  const categories = await (async () => {
    try {
      return await db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, gameId: true } });
    } catch {
      return [];
    }
  })();
  const services = await getServices(q || undefined);
  const editParam = sp?.edit;
  const editId = typeof editParam === "string" ? editParam : Array.isArray(editParam) ? editParam[0] ?? null : null;
  let editing: any = null;
  if (editId) {
    try {
      editing = await db.service.findUnique({
        where: { id: editId },
        select: { id: true, name: true, slug: true, description: true, imageUrl: true, gameId: true, categoryId: true, features: true, price: true, isHotOffer: true },
      });
    } catch {
      editing = null;
    }
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <h1 className="text-3xl font-bold">Manage Layanan</h1>
        <p className="mt-2 text-sm text-zinc-400">Tambah/kelola layanan: nama, slug, pilih game dan kategori opsional, deskripsi, gambar, features, harga, hot offers.</p>
        <section className="mt-6 grid grid-cols-1 gap-6">
          <ServiceForm games={games} categories={categories} editing={editing ? {
            id: editing.id,
            name: editing.name,
            slug: editing.slug,
            description: editing.description ?? null,
            imageUrl: editing.imageUrl ?? null,
            gameId: editing.gameId,
            categoryId: editing.categoryId ?? null,
            features: Array.isArray(editing.features) ? (editing.features as string[]) : null,
            price: editing.price.toString(),
            isHotOffer: editing.isHotOffer,
          } : null} />
          <Card className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Data Layanan</h2>
              <GameSearchInput placeholder="Cari layanan" />
            </div>
            <ServiceList services={services} />
          </Card>
        </section>
      </div>
    </div>
  );
}
