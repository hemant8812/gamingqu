"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, X } from "lucide-react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
import { GameSelect } from "@/components/admin/games/GameSelect";

type GameOption = { id: number; name: string };
type Editing = {
  id: number;
  name: string;
  slug: string;
  gameId: number;
  isActive: boolean;
} | null;

export function CategoryModal({ editing, games }: { editing: Editing; games: GameOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);

  const isCreate = searchParams.has("create");
  const shouldOpen = !!editing || isCreate;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open && (editing || isCreate)) {
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
    if (shouldOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [shouldOpen]);

  const closeModal = () => {
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
      <div className="modal-box w-11/12 max-w-lg bg-ink-800 border-0 text-white p-0 overflow-visible max-h-none rounded-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-xl font-bold">{editing ? "Edit Category" : "Add Category"}</h3>
          <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={onSubmit} method="post" className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Rank Boost"
              className="w-full h-11 px-4 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              defaultValue={editing?.name ?? ""}
            />
            <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} />
            {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
          </div>

          <GameSelect games={games} name="gameId" label="Nama Game" initialValue={editing?.gameId} />

          <div className="flex items-center justify-between p-4 bg-ink-900 rounded-xl">
            <span className="text-sm font-medium text-gray-300">Active Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="sr-only peer"
                defaultChecked={editing?.isActive ?? true}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={closeModal} className="h-11 px-5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors">
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
