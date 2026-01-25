"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, XCircle, Plus, Trash2 } from "lucide-react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { GameSelect } from "@/components/admin/games/GameSelect";
import { CategorySelect } from "@/components/admin/categories/CategorySelect";

type GameOption = { id: string; name: string };
type CategoryOption = { id: string; name: string; gameId: string };
type Editing = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  gameId: string;
  categoryId?: string | null;
  features?: string[] | null;
  price: string;
  isHotOffer: boolean;
} | null;

export function ServiceModal({ games, categories, editing }: { games: GameOption[]; categories: CategoryOption[]; editing?: Editing }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  
  const isCreate = searchParams.has("create");
  const [visible, setVisible] = useState(!!editing || isCreate);
  const [selectedGame, setSelectedGame] = useState<string>(editing?.gameId ?? "");
  const [features, setFeatures] = useState<string[]>(editing?.features ?? []);
  const canAddFeature = features.length < 3;
  
  // Handle visibility and URL cleanup
  useEffect(() => {
    if (editing || isCreate) {
      if (window.location.search.includes("create") || window.location.search.includes("edit")) {
        const url = new URL(window.location.href);
        url.searchParams.delete("create");
        url.searchParams.delete("edit");
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [editing, isCreate]);

  // Handle dialog open/close based on visibility
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (visible) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
        if (dialog.open) {
            dialog.close();
        }
    }
  }, [visible, editing]);

  const closeModal = () => {
    setVisible(false);
    setSelectedGame("");
    setFeatures([]);
    // Sync with router to ensure clean state on navigation
    router.replace("/admin/services");
  };

  const addFeature = () => {
    if (!canAddFeature) return;
    setFeatures((f) => [...f, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures((f) => f.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      fd.set("features", JSON.stringify(features.filter((x) => x.trim().length > 0).slice(0, 3)));
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/services", { method, body: fd });
      const ok = res.ok;
      const toast = editing ? "updated" : "saved";
      
      if (!ok) {
        setBusy(false);
        return;
      }
      
      router.replace(`/admin/services?toast=${ok ? toast : "error"}`);
    } catch {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box w-11/12 max-w-5xl bg-base-100 text-base-content p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50 sticky top-0 z-10 backdrop-blur-sm">
            <h3 className="font-bold text-lg">{editing ? "Edit Layanan" : "Tambah Layanan"}</h3>
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
                <XCircle className="h-5 w-5" />
            </button>
        </div>
        
        <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label htmlFor="name" className="label">
                        <span className="label-text font-semibold">Nama Layanan</span>
                    </label>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Contoh: Rank Boost PvP"
                    className="input input-bordered w-full"
                    defaultValue={editing?.name ?? ""}
                    />
                </div>
                <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} className="mt-0" />
            </div>
            {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GameSelect games={games} name="gameId" label="Nama Game" onChange={setSelectedGame} initialValue={editing?.gameId} />
                <CategorySelect categories={categories} name="categoryId" label="Nama Kategori (opsional)" gameId={selectedGame} initialValue={editing?.categoryId ?? null} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col h-full">
                    <label className="label">
                        <span className="label-text font-semibold">Deskripsi</span>
                    </label>
                    <div className="mt-1 flex-1">
                        <RichTextEditor name="description" placeholder="Deskripsi layanan" initialHtml={editing?.description ?? ""} />
                    </div>
                </div>
                
                <div className="flex flex-col h-full">
                    <ImageUploadField id="image" name="image" label="Gambar" previewHeight={200} initialUrl={editing?.imageUrl ?? null} />
                </div>
            </div>
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Features</span>
                </label>
                <div className="mt-2 space-y-2">
                    {features.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={v}
                            onChange={(e) => {
                            const val = e.target.value;
                            setFeatures((f) => f.map((x, idx) => (idx === i ? val : x)));
                            }}
                            placeholder={`Feature ${i + 1}`}
                            className="input input-bordered w-full"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature(i)}
                            className="btn btn-square btn-ghost btn-sm text-error"
                            title="Hapus feature"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    ))}
                    {canAddFeature && (
                    <button
                        type="button"
                        onClick={addFeature}
                        className="btn btn-sm btn-ghost gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Feature</span>
                    </button>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-box">
                <div className="form-control">
                    <label htmlFor="price" className="label">
                        <span className="label-text font-semibold">Price</span>
                    </label>
                    <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    required
                    defaultValue={editing?.price ?? ""}
                    />
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4 mt-8">
                        <span className="label-text font-semibold">Hot offers</span>
                        <input 
                            id="isHotOffer" 
                            name="isHotOffer" 
                            type="checkbox" 
                            className="toggle toggle-error" 
                            defaultChecked={editing?.isHotOffer ?? false} 
                        />
                    </label>
                </div>
            </div>

            <div className="modal-action border-t border-base-200 pt-4 mt-6">
                <button type="button" onClick={closeModal} className="btn btn-ghost gap-2">
                    Batal
                </button>
                <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={busy}
                >
                    {busy && <span className="loading loading-spinner loading-sm"></span>}
                    <SaveIcon className="h-4 w-4" />
                    <span>{editing ? "Update Data" : "Simpan Layanan"}</span>
                </button>
            </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
