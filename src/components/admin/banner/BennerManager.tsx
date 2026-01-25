"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil } from "lucide-react";
import { BennerModal } from "./BennerModal";

type Item = {
  id: string;
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

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus benner ini?")) return;
    const fd = new FormData();
    fd.set("mode", "DELETE");
    fd.set("id", id);
    const res = await fetch("/api/admin/benner", { method: "POST", body: fd });
    window.location.assign(`/admin/benner?toast=${res.ok ? "success" : "error"}`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Benner</h1>
          <p className="mt-2 text-sm opacity-70">Kelola hingga 10 benner untuk halaman utama.</p>
        </div>
        <button
          onClick={openCreate}
          className={`btn btn-primary gap-2 ${!canAdd ? "btn-disabled" : ""}`}
          disabled={!canAdd}
        >
          <Plus className="h-4 w-4" />
          Tambah Benner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.length === 0 && (
            <div className="col-span-full text-center py-10 opacity-50 border border-dashed border-base-300 rounded-box">
                Belum ada benner. Silakan tambah benner baru.
            </div>
        )}
        {items.map((b, i) => (
          <div key={b.id} className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <div className="card-body p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="badge badge-neutral">#{i + 1}</span>
                        <span className={`badge ${b.isActive ? "badge-success" : "badge-ghost"}`}>
                            {b.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openEdit(b)}
                            className="btn btn-square btn-sm btn-ghost hover:bg-base-200"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(b.id)}
                            className="btn btn-square btn-sm btn-error text-white"
                            title="Hapus"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <div className="text-xs opacity-50 font-semibold uppercase tracking-wider">Judul</div>
                        <div className="font-bold truncate">{b.title || "-"}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-50 font-semibold uppercase tracking-wider">Sub Judul</div>
                        <div className="text-sm truncate opacity-80">{b.subtitle || "-"}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-50 font-semibold uppercase tracking-wider">Link</div>
                        <div className="text-sm truncate text-primary">{b.buttonLink || "-"}</div>
                    </div>
                    
                    {b.buttonImageUrl && (
                        <div className="mt-2 relative h-32 w-full rounded-box overflow-hidden border border-base-300 bg-base-200">
                             <Image src={b.buttonImageUrl} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                    )}
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <BennerModal editing={editingItem} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
