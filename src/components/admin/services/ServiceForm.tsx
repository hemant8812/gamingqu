"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save as SaveIcon, Plus, ChevronDown, ChevronUp } from "lucide-react";
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

export function ServiceForm({ games, categories, editing }: { games: GameOption[]; categories: CategoryOption[]; editing?: Editing }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(!!editing);
  const [busy, setBusy] = useState(false);
  const [selectedGame, setSelectedGame] = useState<number | undefined>(editing?.gameId ?? undefined);
  const [features, setFeatures] = useState<string[]>(editing?.features ?? []);
  const canAddFeature = features.length < 3;
  const addFeature = () => {
    if (!canAddFeature) return;
    setFeatures((f) => [...f, ""]);
  };
  return (
    <form
      onSubmit={async (e) => {
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
          router.replace(`/admin/services?toast=${ok ? toast : "error"}`);
        } catch {
          router.replace("/admin/services?toast=error");
        } finally {
          setBusy(false);
        }
      }}
      method="post"
      encType="multipart/form-data"
      className="card bg-base-100 shadow-xl border border-base-200"
    >
      <div className="card-body p-6">
        <div className="flex items-center justify-between cursor-pointer select-none mb-4" onClick={() => setIsOpen(!isOpen)}>
            <h3 className="card-title text-lg">{editing ? "Edit Layanan" : "Tambah Layanan"}</h3>
            {isOpen ? <ChevronUp className="h-5 w-5 opacity-50" /> : <ChevronDown className="h-5 w-5 opacity-50" />}
        </div>
        <div className={isOpen ? "space-y-4" : "hidden"}>
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
            <div className="form-control">
            <label className="label">
                <span className="label-text font-semibold">Deskripsi</span>
            </label>
            <div className="mt-1">
                <RichTextEditor name="description" placeholder="Deskripsi layanan" initialHtml={editing?.description ?? ""} />
            </div>
            </div>
            <div>
            <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} initialUrl={editing?.imageUrl ?? null} />
            </div>
            <div className="form-control">
            <label className="label">
                <span className="label-text font-semibold">Features</span>
            </label>
            <div className="mt-2 space-y-2">
                {features.map((v, i) => (
                <input
                    key={i}
                    type="text"
                    value={v}
                    onChange={(e) => {
                    const val = e.target.value;
                    setFeatures((f) => f.map((x, idx) => (idx === i ? val : x)));
                    }}
                    placeholder={`Feature ${i + 1}`}
                    className="input input-bordered w-full"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex justify-end">
            <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={busy}
            >
                <SaveIcon className="h-4 w-4" />
                <span>{editing ? "Update Layanan" : "Simpan Layanan"}</span>
            </button>
            </div>
        </div>
      </div>
    </form>
  );
}
