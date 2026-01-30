"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  price: string;
  isHotOffer: boolean;
  isActive: boolean;
  imageUrl?: string | null;
  game: { id: string; name: string };
  category?: { id: string; name: string } | null;
};

export function ServiceList({ services }: { services: ServiceItem[] }) {
  const router = useRouter();
  const onDelete = async (id: string) => {
    const ok = typeof window !== "undefined" ? window.confirm("Delete this service?") : true;
    if (!ok) return;
    const fd = new FormData();
    fd.set("id", id);
    const res = await fetch("/api/admin/services", { method: "DELETE", body: fd });
    router.replace(`/admin/services?toast=${res.ok ? "deleted" : "error"}`);
  };
  return (
    <div className="space-y-3">
      {services.length === 0 && (
        <div className="text-gray-500 text-center py-12">No services found</div>
      )}
      {services.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-4 p-3 bg-[#0A0E17] hover:bg-white/5 rounded-xl transition-colors"
        >
          <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
            {s.imageUrl ? (
              <Image src={s.imageUrl} alt={s.name} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <div className="text-xs text-gray-500">No image</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{s.name}</div>
            <div className="text-sm text-gray-500 truncate">{s.game.name}{s.category?.name ? ` • ${s.category.name}` : ""}</div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${s.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                {s.isActive ? "Active" : "Inactive"}
              </span>
              {s.isHotOffer && (
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-red-500/20 text-red-400">
                  Hot Offer
                </span>
              )}
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-blue-500/20 text-blue-400">
                ${Number(s.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/admin/services?edit=${s.id}`}
              aria-label="Edit"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </a>
            <button
              aria-label="Delete"
              onClick={() => onDelete(s.id)}
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
