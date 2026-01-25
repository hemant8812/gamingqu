"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, XCircle } from "lucide-react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";

type GameOption = { id: string; name: string };
type Editing = {
  id: string;
  name: string;
  slug: string;
  gameId: string;
  isActive: boolean;
} | null;

export function CategoryModal({ editing, games }: { editing: Editing; games: GameOption[] }) {
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
    router.replace("/admin/categories");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", { method, body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBusy(false);
        return;
      }
      const toast = typeof data?.toast === "string" ? data.toast : editing ? "updated" : "saved";
      router.push(`/admin/categories?toast=${toast}`);
    } catch {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box w-11/12 max-w-lg bg-base-100 text-base-content p-0 overflow-visible max-h-none">
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50">
            <h3 className="font-bold text-lg">{editing ? "Edit Kategori" : "Tambah Kategori"}</h3>
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
                <XCircle className="h-5 w-5" />
            </button>
        </div>
        
        <form onSubmit={onSubmit} method="post" className="p-6 space-y-4">
            <div className="form-control">
                <label htmlFor="name" className="label">
                    <span className="label-text font-semibold">Nama Kategori</span>
                </label>
                <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Contoh: Rank Boost"
                className="input input-bordered w-full"
                defaultValue={editing?.name ?? ""}
                />
                <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} />
                {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
            </div>
            
            <div className="form-control">
                <label htmlFor="gameId" className="label">
                    <span className="label-text font-semibold">Nama Game</span>
                </label>
                <select
                id="gameId"
                name="gameId"
                required
                className="select select-bordered w-full"
                defaultValue={editing?.gameId ?? ""}
                >
                <option value="" disabled>Pilih Game</option>
                {games.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
                </select>
            </div>

            <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 mt-2">
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
                    <span>{editing ? "Update Data" : "Simpan Kategori"}</span>
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
