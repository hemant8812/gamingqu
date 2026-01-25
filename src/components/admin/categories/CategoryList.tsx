"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  game: { id: string; name: string; iconUrl: string | null };
};

export function CategoryList({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const onDelete = async (id: string) => {
    const ok = typeof window !== "undefined" ? window.confirm("Hapus kategori ini?") : true;
    if (!ok) return;
    const fd = new FormData();
    fd.set("id", id);
    const res = await fetch("/api/admin/categories", { method: "DELETE", body: fd });
    router.replace(`/admin/categories?toast=${res.ok ? "deleted" : "error"}`);
  };

  return (
    <div className="mt-4 space-y-3">
      {categories.length === 0 && (
        <div className="text-sm opacity-50 text-center py-4">Belum ada data</div>
      )}
      {categories.map((c) => (
        <div key={c.id} className="card card-side bg-base-200 hover:bg-base-300 transition-colors border border-base-300 p-2 items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-base-100 overflow-hidden flex items-center justify-center shrink-0 border border-base-300 ml-2">
             {c.game.iconUrl ? (
               <Image src={c.game.iconUrl} alt={c.game.name} width={40} height={40} className="object-cover w-full h-full" />
             ) : (
               <div className="text-[10px] opacity-50">No icon</div>
             )}
           </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold truncate">{c.name}</div>
            <div className="text-xs opacity-70 truncate">{c.slug} • {c.game.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className={`badge badge-sm ${c.isActive ? "badge-success" : "badge-ghost"}`}>{c.isActive ? "Aktif" : "Nonaktif"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mr-2">
            <a
              href={`/admin/categories?edit=${c.id}`}
              aria-label="Edit"
              className="btn btn-square btn-sm btn-ghost hover:bg-base-100"
            >
              <Pencil className="h-4 w-4" />
            </a>
            <button
              aria-label="Hapus"
              onClick={() => onDelete(c.id)}
              className="btn btn-square btn-sm btn-error text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
