"use client";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, X } from "lucide-react";
import Image from "next/image";

type Item = {
  id: number;
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
    setBusy(false);
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
        fd.set("id", String(editing.id));
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
      <div className="modal-box w-11/12 max-w-lg bg-ink-800 border-0 text-white p-0 max-h-[90vh] overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 z-10 bg-ink-800/95 backdrop-blur-sm">
          <h3 className="text-xl font-bold">{editing ? "Edit Banner" : "Add Banner"}</h3>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={onSubmit} method="post" encType="multipart/form-data">
          <div className="p-6 space-y-5 overflow-y-auto" style={{ maxHeight: "calc(90vh - 132px)" }}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                name="title"
                defaultValue={editing?.title ?? ""}
                placeholder="Enter title"
                className="w-full h-11 px-4 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <textarea
                name="subtitle"
                defaultValue={editing?.subtitle ?? ""}
                rows={3}
                placeholder="Write subtitle"
                className="w-full px-4 py-3 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Button Link</label>
              <input
                name="buttonLink"
                defaultValue={editing?.buttonLink ?? ""}
                placeholder="https://..."
                className="w-full h-11 px-4 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Button Image</label>
              <div
                className="relative w-full h-40 overflow-hidden rounded-xl cursor-pointer bg-ink-900 hover:bg-white/5 transition-colors"
                onClick={() => document.getElementById('modal-file-input')?.click()}
              >
                {preview || editing?.buttonImageUrl ? (
                  <Image src={preview ?? editing?.buttonImageUrl ?? ""} alt="Preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-gray-500 gap-2">
                    <span>Click to select image</span>
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

            <div className="flex items-center justify-between p-4 bg-ink-900 rounded-xl">
              <span className="text-sm font-medium text-gray-300">Active Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  className="sr-only peer"
                  defaultChecked={editing?.isActive ?? true}
                  value="true"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t border-white/10 sticky bottom-0 z-10 bg-ink-800/95 backdrop-blur-sm">
            <button type="button" onClick={handleClose} className="h-11 px-5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={busy}
            >
              {busy && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              <SaveIcon className="h-4 w-4" />
              <span>{editing ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/60">
        <button>close</button>
      </form>
    </dialog>
  );
}
