"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ServiceItem = {
  id: number;
  name: string;
  slug: string;
  price: string;
  isHotOffer: boolean;
  isActive: boolean;
  imageUrl?: string | null;
  game: { id: number; name: string };
  category?: { id: number; name: string } | null;
};

export function ServiceList({ services }: { services: ServiceItem[] }) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isConfirmOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isConfirmOpen]);
  const openConfirm = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch("/api/admin/services", { method: "DELETE", body: JSON.stringify({ id: deleteId }) });
    router.replace(`/admin/services?toast=${res.ok ? "deleted" : "error"}`);
    setIsConfirmOpen(false);
    setDeleteId(null);
  };
  return (
    <>
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
              <Image src={s.imageUrl} alt={s.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
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
              onClick={() => openConfirm(s.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box bg-[#0F172A] border-0 text-white rounded-2xl">
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <AlertTriangle className="h-10 w-10 text-yellow-400" />
          <h3 className="font-bold text-xl">Delete Service</h3>
          <p className="text-sm text-gray-400">Are you sure you want to delete this service?</p>
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(false)}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/60">
        <button onClick={() => setIsConfirmOpen(false)}>close</button>
      </form>
    </dialog>
    </>
  );
}
