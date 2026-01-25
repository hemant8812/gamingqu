"use client";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, XCircle } from "lucide-react";
import Image from "next/image";

type Item = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  buttonLink?: string | null;
  buttonImageUrl?: string | null;
  order?: number | null;
  isActive?: boolean | null;
};

export function BennerModal({ editing, isOpen, onClose }: { editing: Item | null, isOpen: boolean, onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, editing]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const file = fd.get("buttonImage") as File | null;
      if (file && file.size > 10 * 1024 * 1024) {
        alert("File too large (max 10MB)");
        setBusy(false);
        return;
      }
      
      if (editing) {
        fd.set("mode", "UPDATE");
        fd.set("id", editing.id);
      } else {
        fd.set("mode", "CREATE");
      }
      
      const res = await fetch("/api/admin/benner", { method: "POST", body: fd });
      if (res.ok) {
        window.location.assign(`/admin/benner?toast=${res.ok ? "success" : "error"}`);
      } else {
        setBusy(false);
      }
    } catch {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleClose}>
      <div className="modal-box w-11/12 max-w-lg bg-base-100 text-base-content p-0 overflow-visible max-h-none">
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50">
            <h3 className="font-bold text-lg">{editing ? "Edit Benner" : "Tambah Benner"}</h3>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                <XCircle className="h-5 w-5" />
            </button>
        </div>
        
        <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="p-6 space-y-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Judul</span>
                </label>
                <input 
                    name="title" 
                    defaultValue={editing?.title ?? ""} 
                    placeholder="Masukkan judul" 
                    className="input input-bordered w-full" 
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Sub Judul</span>
                </label>
                <textarea 
                    name="subtitle" 
                    defaultValue={editing?.subtitle ?? ""} 
                    rows={3} 
                    placeholder="Tulis sub judul" 
                    className="textarea textarea-bordered w-full" 
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Button Link</span>
                </label>
                <input 
                    name="buttonLink" 
                    defaultValue={editing?.buttonLink ?? ""} 
                    placeholder="https://..." 
                    className="input input-bordered w-full" 
                />
            </div>
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Gambar Button</span>
                </label>
                <div
                    className="relative w-full h-40 overflow-hidden rounded-box border border-base-300 cursor-pointer bg-base-200 hover:bg-base-300 transition-colors"
                    onClick={() => document.getElementById('modal-file-input')?.click()}
                >
                    {preview || editing?.buttonImageUrl ? (
                        <Image src={preview ?? editing?.buttonImageUrl ?? ""} alt="Preview" fill className="object-cover" unoptimized />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-sm opacity-50 gap-2">
                            <span>Klik untuk pilih gambar</span>
                        </div>
                    )}
                    <input 
                        id="modal-file-input"
                        type="file" 
                        name="buttonImage" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                            const f = e.currentTarget.files?.[0];
                            if (f) {
                                const url = URL.createObjectURL(f);
                                setPreview(url);
                            }
                        }} 
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 mt-2">
                    <span className="label-text font-semibold">Active</span>
                    <input 
                        type="checkbox" 
                        name="isActive"
                        className="toggle toggle-success" 
                        defaultChecked={editing?.isActive ?? true}
                        value="true"
                    />
                </label>
            </div>

            <div className="modal-action border-t border-base-200 pt-4 mt-6">
                <button type="button" onClick={onClose} className="btn btn-ghost gap-2">
                    Batal
                </button>
                <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={busy}
                >
                    {busy && <span className="loading loading-spinner loading-sm"></span>}
                    <SaveIcon className="h-4 w-4" />
                    <span>{editing ? "Update Benner" : "Simpan Benner"}</span>
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
