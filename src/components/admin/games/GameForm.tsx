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
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold">Nama Game</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Contoh: World of Warcraft"
          className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
          defaultValue={editing?.name ?? ""}
        />
        <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} />
        {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} initialUrl={editing?.imageUrl ?? null} />
        <ImageUploadField id="icon" name="icon" label="Icon" previewHeight={160} initialUrl={editing?.iconUrl ?? null} />
      </div>
      <div>
        <label className="block text-sm font-semibold">Deskripsi</label>
        <div className="mt-1">
          <RichTextEditor name="description" placeholder="Deskripsi dan format bebas" initialHtml={editing?.description ?? ""} />
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          Gunakan toolbar di atas untuk Bold, Link, garis baru, dan menyisipkan gambar via URL.
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <input id="isHotOffer" name="isHotOffer" type="checkbox" className="peer sr-only" defaultChecked={editing?.isHotOffer ?? false} />
          <label
            htmlFor="isHotOffer"
            className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
            aria-label="Hot Offer"
          >
          </label>
          <span className="text-sm font-semibold">Hot Offer</span>
        </div>
        <div className="flex items-center gap-3">
          <input id="isActive" name="isActive" type="checkbox" className="peer sr-only" defaultChecked={editing?.isActive ?? true} />
          <label
            htmlFor="isActive"
            className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
            aria-label="Aktif"
          >
          </label>
          <span className="text-sm font-semibold">Aktif</span>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          disabled={busy}
        >
          <SaveIcon className="h-4 w-4" />
          <span>{editing ? "Update Data" : "Simpan Game"}</span>
        </button>
      </div>
    </form>
  );
}

