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
        <div className="text-sm text-zinc-400">Belum ada data</div>
      )}
      {categories.map((c) => (
        <div key={c.id} className="flex items-center gap-4 rounded-xl border border-zinc-900 bg-black p-3 hover:bg-zinc-900/40">
           <div className="w-10 h-10 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
             {c.game.iconUrl ? (
               <Image src={c.game.iconUrl} alt={c.game.name} width={40} height={40} className="object-cover w-10 h-10" />
             ) : (
               <div className="text-[10px] text-zinc-500">No icon</div>
             )}
           </div>
          <div className="flex-1">
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-zinc-500">{c.slug} • {c.game.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-md ${c.isActive ? "bg-green-600" : "bg-zinc-700"} text-white`}>{c.isActive ? "Aktif" : "Nonaktif"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/admin/categories?edit=${c.id}`}
              aria-label="Edit"
              className="inline-flex items-center justify-center rounded-md bg-zinc-800 p-2 hover:bg-zinc-700 text-white"
            >
              <Pencil className="h-4 w-4" />
            </a>
            <button
              aria-label="Hapus"
              onClick={() => onDelete(c.id)}
              className="inline-flex items-center justify-center rounded-md bg-red-600 p-2 hover:bg-red-500 text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
