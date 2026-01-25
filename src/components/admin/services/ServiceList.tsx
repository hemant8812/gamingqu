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
    const ok = typeof window !== "undefined" ? window.confirm("Hapus layanan ini?") : true;
    if (!ok) return;
    const fd = new FormData();
    fd.set("id", id);
    const res = await fetch("/api/admin/services", { method: "DELETE", body: fd });
    router.replace(`/admin/services?toast=${res.ok ? "deleted" : "error"}`);
  };
  return (
    <div className="mt-4 space-y-3">
      {services.length === 0 && (
        <div className="text-sm opacity-50 text-center py-4">Belum ada data</div>
      )}
      {services.map((s) => (
        <div key={s.id} className="card card-side bg-base-200 hover:bg-base-300 transition-colors border border-base-300 p-2 items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-base-100 overflow-hidden flex items-center justify-center shrink-0 border border-base-300 ml-2">
            {s.imageUrl ? (
              <Image src={s.imageUrl} alt={s.name} width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <div className="text-xs opacity-50">No image</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold truncate">{s.name}</div>
            <div className="text-xs opacity-70 truncate">{s.game.name}{s.category?.name ? ` • ${s.category.name}` : ""}</div>
            <div className="mt-1 flex items-center gap-2 text-xs flex-wrap">
              <span className={`badge badge-sm ${s.isActive ? "badge-success" : "badge-ghost"}`}>{s.isActive ? "Aktif" : "Nonaktif"}</span>
              {s.isHotOffer && <span className="badge badge-sm badge-error text-white">Hot Offer</span>}
              <span className="badge badge-sm badge-info text-white">${Number(s.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mr-2">
            <a
              href={`/admin/services?edit=${s.id}`}
              aria-label="Edit"
              className="btn btn-square btn-sm btn-ghost hover:bg-base-100"
            >
              <Pencil className="h-4 w-4" />
            </a>
            <button
              aria-label="Hapus"
              onClick={() => onDelete(s.id)}
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
