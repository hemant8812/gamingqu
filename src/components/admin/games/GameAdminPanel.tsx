"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
import { Save as SaveIcon, Search as SearchIcon } from "lucide-react";

type GameItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isHotOffer: boolean;
  isActive: boolean;
};

type Props = {
  games: GameItem[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
};

export function GameAdminPanel({ games, createAction, updateAction }: Props) {
  const [selected, setSelected] = useState<GameItem | null>(null);
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q)
    );
  }, [games, query]);

  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <form
        key={selected?.id ?? "new"}
        action={selected ? updateAction : createAction}
        encType="multipart/form-data"
        className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">Nama Game</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Contoh: World of Warcraft"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
            defaultValue={selected?.name ?? ""}
          />
          <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={selected?.slug ?? ""} />
          {selected && <input type="hidden" name="id" defaultValue={selected.id} />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} initialUrl={selected?.imageUrl ?? null} />
          <ImageUploadField id="icon" name="icon" label="Icon" previewHeight={160} initialUrl={selected?.iconUrl ?? null} />
        </div>
        <div>
          <label className="block text-sm font-semibold">Deskripsi</label>
          <div className="mt-1">
            <RichTextEditor name="description" placeholder="Deskripsi dan format bebas" initialHtml={selected?.description ?? ""} />
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Gunakan toolbar di atas untuk Bold, Link, garis baru, dan menyisipkan gambar via URL.
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <input id="isHotOffer" name="isHotOffer" type="checkbox" className="peer sr-only" defaultChecked={selected?.isHotOffer ?? false} />
            <label
              htmlFor="isHotOffer"
              className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
              aria-label="Hot Offer"
            />
            <span className="text-sm font-semibold">Hot Offer</span>
          </div>
          <div className="flex items-center gap-3">
            <input id="isActive" name="isActive" type="checkbox" className="peer sr-only" defaultChecked={selected?.isActive ?? true} />
            <label
              htmlFor="isActive"
              className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
              aria-label="Aktif"
            />
            <span className="text-sm font-semibold">Aktif</span>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <SaveIcon className="h-4 w-4" />
            <span>{selected ? "Update Data" : "Simpan Game"}</span>
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Data Game</h2>
          <div className="relative w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari game"
              className="bg-zinc-900 border border-zinc-800 rounded-md h-9 px-3 pl-9 text-sm text-white w-full"
              aria-label="Pencarian game"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {list.length === 0 && (
            <div className="text-sm text-zinc-400">Belum ada data</div>
          )}
          {list.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelected(g)}
              className="w-full text-left flex items-center gap-4 rounded-xl border border-zinc-900 bg-black p-3 hover:bg-zinc-900/40"
            >
              <div className="w-16 h-16 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
                {g.imageUrl ? (
                  <Image src={g.imageUrl} alt={g.name} width={64} height={64} className="object-cover w-16 h-16" />
                ) : (
                  <div className="text-xs text-zinc-500">No image</div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{g.name}</div>
                <div className="text-xs text-zinc-500">{g.slug}</div>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-md ${g.isActive ? "bg-green-600" : "bg-zinc-700"} text-white`}>{g.isActive ? "Aktif" : "Nonaktif"}</span>
                  {g.isHotOffer && <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white">Hot Offer</span>}
                </div>
              </div>
              <div className="w-10 h-10 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
                {g.iconUrl ? (
                  <Image src={g.iconUrl} alt="icon" width={40} height={40} className="object-cover w-10 h-10" />
                ) : (
                  <div className="text-[10px] text-zinc-500">No icon</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
