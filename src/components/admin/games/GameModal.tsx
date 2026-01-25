"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, XCircle } from "lucide-react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { RichTextEditor } from "@/components/shared/RichTextEditor";

type Editing = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  description?: string | null;
  isHotOffer: boolean;
  isActive: boolean;
} | null;

export function GameModal({ editing }: { editing: Editing }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  
  const isCreate = searchParams.has("create");
  const [visible, setVisible] = useState(() => !!editing || isCreate);
  
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (visible) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [visible]);

  const closeModal = () => {
    setVisible(false);
    router.replace("/admin/games");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/games", { method, body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBusy(false);
        return;
      }
      const toast = typeof data?.toast === "string" ? data.toast : editing ? "updated" : "saved";
      router.push(`/admin/games?toast=${toast}`);
    } catch {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box w-11/12 max-w-4xl bg-base-100 text-base-content p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50 sticky top-0 z-10 backdrop-blur-sm">
            <h3 className="font-bold text-lg">{editing ? "Edit Game" : "Tambah Game"}</h3>
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
                <XCircle className="h-5 w-5" />
            </button>
        </div>
        
        <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="p-6 space-y-4">
            <div className="form-control">
                <label htmlFor="name" className="label">
                    <span className="label-text font-semibold">Nama Game</span>
                </label>
                <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Contoh: World of Warcraft"
                className="input input-bordered w-full"
                defaultValue={editing?.name ?? ""}
                />
                <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} />
                {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} initialUrl={editing?.imageUrl ?? null} />
                <ImageUploadField id="icon" name="icon" label="Icon" previewHeight={160} initialUrl={editing?.iconUrl ?? null} />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Deskripsi</span>
                </label>
                <div className="mt-1">
                <RichTextEditor name="description" placeholder="Deskripsi dan format bebas" initialHtml={editing?.description ?? ""} />
                </div>
            </div>
            <div className="flex items-center gap-8 bg-base-200/50 p-4 rounded-box">
                <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                        <span className="label-text font-semibold">Hot Offer</span>
                        <input 
                            id="isHotOffer" 
                            name="isHotOffer" 
                            type="checkbox" 
                            className="toggle toggle-error" 
                            defaultChecked={editing?.isHotOffer ?? false} 
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                        <span className="label-text font-semibold">Aktif</span>
                        <input 
                            id="isActive" 
                            name="isActive" 
                            type="checkbox" 
                            className="toggle toggle-success" 
                            defaultChecked={editing?.isActive ?? true} 
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
                    <span>{editing ? "Update Data" : "Simpan Game"}</span>
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
