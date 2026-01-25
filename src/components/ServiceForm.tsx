 "use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
 import { Save as SaveIcon, Plus, ChevronDown, ChevronUp } from "lucide-react";
 import { AutoSlugField } from "@/components/AutoSlugField";
 import { ImageUploadField } from "@/components/ImageUploadField";
 import { RichTextEditor } from "@/components/RichTextEditor";
 import { GameSelect } from "@/components/GameSelect";
 import { CategorySelect } from "@/components/CategorySelect";
 
type GameOption = { id: string; name: string };
type CategoryOption = { id: string; name: string; gameId: string };
type Editing = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  gameId: string;
  categoryId?: string | null;
  features?: string[] | null;
  price: string;
  isHotOffer: boolean;
} | null;
 
export function ServiceForm({ games, categories, editing }: { games: GameOption[]; categories: CategoryOption[]; editing?: Editing }) {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(true);
   const [busy, setBusy] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>(editing?.gameId ?? "");
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
      className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6"
    >
      <div className="flex items-center justify-between cursor-pointer select-none mb-4" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-bold text-white">{editing ? "Edit Layanan" : "Tambah Layanan"}</h3>
        {isOpen ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
      </div>
      <div className={isOpen ? "space-y-4" : "hidden"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">Nama Layanan</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Contoh: Rank Boost PvP"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
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
       <div>
         <label className="block text-sm font-semibold">Deskripsi</label>
         <div className="mt-1">
          <RichTextEditor name="description" placeholder="Deskripsi layanan" initialHtml={editing?.description ?? ""} />
         </div>
       </div>
       <div>
        <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} initialUrl={editing?.imageUrl ?? null} />
       </div>
       <div>
         <label className="block text-sm font-semibold">Features</label>
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
               className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
             />
           ))}
           {canAddFeature && (
             <button
               type="button"
               onClick={addFeature}
               className="inline-flex items-center gap-2 rounded-md bg-zinc-800 text-white px-3 py-2 text-sm hover:bg-zinc-700"
             >
               <Plus className="h-4 w-4" />
               <span>Tambah Feature</span>
             </button>
           )}
         </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
           <label htmlFor="price" className="block text-sm font-semibold">Price</label>
           <input
             id="price"
             name="price"
             type="number"
             step="0.01"
             min="0"
             placeholder="0.00"
             className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
            required
            defaultValue={editing?.price ?? ""}
           />
         </div>
         <div className="flex items-center gap-3">
          <input id="isHotOffer" name="isHotOffer" type="checkbox" className="peer sr-only" defaultChecked={editing?.isHotOffer ?? false} />
           <label
             htmlFor="isHotOffer"
             className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-orange-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
             aria-label="Hot offers"
           />
           <span className="text-sm font-semibold">Hot offers</span>
         </div>
       </div>
       <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          disabled={busy}
        >
          <SaveIcon className="h-4 w-4" />
         <span>{editing ? "Update Layanan" : "Simpan Layanan"}</span>
        </button>
      </div>
      </div>
    </form>
   );
 }
