"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Save as SaveIcon, X, Plus, Trash2 } from "lucide-react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { GameSelect } from "@/components/admin/games/GameSelect";
import { CategorySelect } from "@/components/admin/categories/CategorySelect";

type GameOption = { id: number; name: string };
type CategoryOption = { id: number; name: string; gameId: number };
type Editing = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  gameId: number;
  categoryId?: number | null;
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
  const shouldOpen = !!editing || isCreate;
  const [selectedGame, setSelectedGame] = useState<number | undefined>(editing?.gameId ?? undefined);
  const [features, setFeatures] = useState<string[]>(editing?.features ?? []);
  const [priceValue, setPriceValue] = useState(editing?.price ? parseFloat(editing.price).toFixed(2) : "");
  const canAddFeature = features.length < 3;

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
    setSelectedGame(undefined);
    setFeatures([]);
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

      setBusy(false);
      if (!ok) {
        return;
      }

      router.replace(`/admin/services?toast=${ok ? toast : "error"}`);
    } catch {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box w-11/12 max-w-5xl bg-ink-800 border-0 text-white p-0 max-h-[90vh] rounded-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0 bg-ink-800">
          <h3 className="text-xl font-bold">{editing ? "Edit Service" : "Add Service"}</h3>
          <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Service Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Rank Boost PvP"
                  className="w-full h-11 px-4 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  defaultValue={editing?.name ?? ""}
                />
              </div>
              <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} className="mt-0" />
            </div>
            {editing && <input type="hidden" name="id" defaultValue={String(editing.id)} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GameSelect games={games} name="gameId" label="Game" onChange={setSelectedGame} initialValue={editing?.gameId} />
              <CategorySelect categories={categories} name="categoryId" label="Category (optional)" gameId={selectedGame} initialValue={editing?.categoryId ?? null} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <div className="flex-1">
                  <RichTextEditor name="description" placeholder="Service description" initialHtml={editing?.description ?? ""} />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <ImageUploadField id="image" name="image" label="Image" previewHeight={200} initialUrl={editing?.imageUrl ?? null} />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                  <div className="space-y-2">
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
                          className="flex-1 h-11 px-4 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Remove feature"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {canAddFeature && (
                      <button
                        type="button"
                        onClick={addFeature}
                        className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Feature</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-4 bg-ink-900 rounded-xl">
                    <span className="text-sm font-medium text-gray-300">Hot Offer</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="isHotOffer"
                        name="isHotOffer"
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={editing?.isHotOffer ?? false}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ink-900 rounded-xl">
                    <span className="text-sm font-medium text-gray-300">Active</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={true}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center p-4 bg-ink-900 rounded-xl focus-within:ring-2 focus-within:ring-brand-500 transition-all">
                    <span className="text-sm font-medium text-gray-300 shrink-0">Price</span>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-0 text-white text-right placeholder-gray-500 focus:outline-none"
                      required
                      value={priceValue}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.]/g, "");
                        setPriceValue(raw);
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) setPriceValue(val.toFixed(2));
                        else if (e.target.value === "") setPriceValue("");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-white/10 shrink-0 bg-ink-800">
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
