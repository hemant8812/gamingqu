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
    const ok = typeof window !== "undefined" ? window.confirm("Delete this category?") : true;
    if (!ok) return;
    const fd = new FormData();
    fd.set("id", id);
    const res = await fetch("/api/admin/categories", { method: "DELETE", body: fd });
    router.replace(`/admin/categories?toast=${res.ok ? "deleted" : "error"}`);
  };

  return (
    <div className="space-y-3">
      {categories.length === 0 && (
        <div className="text-gray-500 text-center py-12">No categories found</div>
      )}
      {categories.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-4 p-3 bg-[#0A0E17] hover:bg-white/5 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
            {c.game.iconUrl ? (
              <Image src={c.game.iconUrl} alt={c.game.name} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <div className="text-[10px] text-gray-500">No icon</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{c.name}</div>
            <div className="text-sm text-gray-500 truncate">{c.slug} • {c.game.name}</div>
            <div className="mt-1">
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${c.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                {c.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/admin/categories?edit=${c.id}`}
              aria-label="Edit"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </a>
            <button
              aria-label="Delete"
              onClick={() => onDelete(c.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
