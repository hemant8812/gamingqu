import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { PageToast } from "@/components/shared/PageToast";
import { GameSearchInput } from "@/components/admin/games/GameSearchInput";
import { CategoryList } from "@/components/admin/categories/CategoryList";

async function getCategories(q?: string) {
  const list = await db.category.findMany({
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
      isActive: true,
      game: { select: { id: true, name: true, iconUrl: true } },
    },
  });
  return list;
}

export default async function AdminCategoriesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const qParam = sp?.q;
  const qRaw = typeof qParam === "string" ? qParam : Array.isArray(qParam) ? qParam[0] ?? "" : "";
  const q = qRaw.trim().slice(0, 64);
  const toastParam = sp?.toast;
  const toast = typeof toastParam === "string" ? toastParam : Array.isArray(toastParam) ? toastParam[0] ?? undefined : undefined;
  const toastMessage = toast
    ? toast === "updated"
      ? "Kategori berhasil diupdate"
      : toast === "deleted"
      ? "Kategori berhasil dihapus"
      : toast === "error"
      ? "Gagal menyimpan kategori"
      : "Kategori berhasil disimpan"
    : undefined;
  const toastType = toast === "error" ? "error" : "success";
  const games = await db.game.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const categories = await getCategories(q || undefined);
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <h1 className="text-3xl font-bold">Manage Kategori</h1>
        <p className="mt-2 text-sm text-zinc-400">Form kategori: nama, slug otomatis, pilih game.</p>
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryForm games={games} />
          <Card className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Data Kategori</h2>
              <GameSearchInput placeholder="Cari kategori" />
            </div>
            <CategoryList categories={categories} />
          </Card>
        </section>
      </div>
    </div>
  );
}
