"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, AlertTriangle, X } from "lucide-react";
import { BennerModal } from "./BennerModal";

type Item = {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  buttonLink?: string | null;
  buttonImageUrl?: string | null;
  order?: number | null;
  isActive?: boolean | null;
};

type Props = {
  items: Item[];
  canAdd: boolean;
};

export function BennerManager({ items, canAdd }: Props) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

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
    const fd = new FormData();
    fd.set("mode", "DELETE");
    fd.set("id", String(deleteId));
    const res = await fetch("/api/admin/benner", { method: "POST", body: fd });
    window.location.assign(`/admin/benner?toast=${res.ok ? "success" : "error"}`);
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Banner Settings</h1>
          <p className="mt-2 text-gray-400">Manage up to 10 banners for the homepage.</p>
        </div>
        <button
          onClick={openCreate}
          className={`h-10 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors ${!canAdd ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!canAdd}
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl bg-ink-800">
            No banners yet. Add a new banner to get started.
          </div>
        )}
        {items.map((b, i) => (
          <div key={b.id} className="bg-ink-800 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-white/10 text-gray-300">
                    #{i + 1}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${b.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openConfirm(b.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Title</div>
                  <div className="font-semibold text-white truncate">{b.title || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Subtitle</div>
                  <div className="text-sm text-gray-400 truncate">{b.subtitle || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Link</div>
                  <div className="text-sm text-brand-400 truncate">{b.buttonLink || "-"}</div>
                </div>

                {b.buttonImageUrl && (
                  <div className="mt-2 relative h-32 w-full rounded-xl overflow-hidden bg-ink-900">
                    <Image src={b.buttonImageUrl} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BennerModal editing={editingItem} isOpen={isModalOpen} onClose={closeModal} />
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box bg-ink-800 border-0 text-white rounded-2xl">
          <div className="flex flex-col items-center text-center gap-2 mb-4">
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
            <h3 className="font-bold text-xl">Delete Banner</h3>
            <p className="text-sm text-gray-400">Are you sure you want to delete this banner?</p>
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
    </div>
  );
}
