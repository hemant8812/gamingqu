"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save as SaveIcon } from "lucide-react";
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

export function GameForm({ editing }: { editing: Editing }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
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
        router.push("/admin/games?toast=error");
        return;
      }
      const toast = typeof data?.toast === "string" ? data.toast : editing ? "updated" : "saved";
      router.push(`/admin/games?toast=${toast}`);
    } catch {
      router.push("/admin/games?toast=error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body p-6 space-y-4">
        <h3 className="card-title text-lg">{editing ? "Edit Game" : "Tambah Game"}</h3>
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
            <div className="label">
                <span className="label-text-alt opacity-70">
                    Gunakan toolbar di atas untuk Bold, Link, garis baru, dan menyisipkan gambar via URL.
                </span>
            </div>
        </div>
        <div className="flex items-center gap-8">
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
        <div className="flex justify-end">
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
      </div>
    </form>
  );
}
