import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { PageToast } from "@/components/shared/PageToast";
import { CategoryManager } from "@/components/admin/categories/CategoryManager";
import { normalizeQuery, parseToast } from "@/lib/page-utils";
import { getSimpleGames } from "@/lib/selects";

async function getCategories(q?: string) {
  try {
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
        gameId: true,
        game: { select: { id: true, name: true, iconUrl: true } },
      },
    });
    return list;
  } catch {
    return [];
  }
}

export default async function AdminCategoriesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const q = normalizeQuery(sp, "q", 64);
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast
    ? toast === "updated"
      ? "Kategori berhasil diupdate"
      : toast === "deleted"
      ? "Kategori berhasil dihapus"
      : toast === "error"
      ? "Gagal menyimpan kategori"
      : "Kategori berhasil disimpan"
    : undefined;
    
  const games = await getSimpleGames();
  const categories = await getCategories(q || undefined);
  
  const editParam = sp?.edit;
  const editId = typeof editParam === "string" ? editParam : Array.isArray(editParam) ? editParam[0] ?? null : null;
  let editing = null as null | { id: string; name: string; slug: string; gameId: string; isActive: boolean };
  
  if (editId) {
    try {
      const found = await db.category.findUnique({
        where: { id: editId },
        select: { id: true, name: true, slug: true, gameId: true, isActive: true },
      });
      if (found) editing = found;
    } catch {
      editing = null;
    }
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <CategoryManager categories={categories} games={games} editing={editing} />
      </div>
    </div>
  );
}
