"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Save, Eye, X, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Item = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  buttonLink?: string | null;
  buttonImageUrl?: string | null;
  order?: number | null;
  isActive?: boolean | null;
};

type Props = {
  items: Item[];
  canAdd: boolean;
};

export function BennerManager({ items, canAdd }: Props) {
  const [drafts, setDrafts] = useState<number[]>([]);
  const [draftPreview, setDraftPreview] = useState<Record<number, string>>({});
  const [existingPreview, setExistingPreview] = useState<Record<string, string>>({});
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});
  const [draftActive, setDraftActive] = useState<Record<number, boolean>>({});
  const submitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("buttonImage") as File | null;
    if (file && file.size > 10 * 1024 * 1024) return;
    fd.set("mode", "CREATE");
    const res = await fetch("/api/admin/benner", { method: "POST", body: fd });
    window.location.assign(`/admin/benner?toast=${res.ok ? "success" : "error"}`);
  };
  const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("buttonImage") as File | null;
    if (file && file.size > 10 * 1024 * 1024) return;
    fd.set("mode", "UPDATE");
    const res = await fetch("/api/admin/benner", { method: "POST", body: fd });
    window.location.assign(`/admin/benner?toast=${res.ok ? "success" : "error"}`);
  };
  const handleDelete = async (id: string) => {
    const fd = new FormData();
    fd.set("mode", "DELETE");
    fd.set("id", id);
    const res = await fetch("/api/admin/benner", { method: "POST", body: fd });
    window.location.assign(`/admin/benner?toast=${res.ok ? "success" : "error"}`);
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Benner</h1>
          <p className="mt-2 text-sm text-zinc-400">Kelola hingga 10 benner untuk halaman utama.</p>
        </div>
        <button
          onClick={() => canAdd && setDrafts((d) => [...d, Date.now()])}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm ${canAdd ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-zinc-800 text-zinc-400 cursor-not-allowed"}`}
        >
          <Plus className="h-4 w-4" />
          Tambah benner
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.map((b, i) => (
          <div key={b.id} className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-gradient-to-r from-blue-600 via-zinc-950 to-black p-0">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="text-white text-sm font-semibold">Benner #{i + 1}</div>
              <button
                onClick={() => handleDelete(b.id)}
                className="inline-flex items-center justify-center rounded-md bg-red-600 text-white size-8 hover:bg-red-500"
                title="Hapus"
                aria-label="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 pb-5 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-zinc-300 mb-2">Judul</label>
                  <input name="title" defaultValue={b.title ?? ""} placeholder="Masukkan judul" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" form={`update-${b.id}`} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-zinc-300 mb-2">Sub Judul</label>
                  <textarea name="subtitle" defaultValue={b.subtitle ?? ""} rows={3} placeholder="Tulis sub judul" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" form={`update-${b.id}`} />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Button Link</label>
                  <input name="buttonLink" defaultValue={b.buttonLink ?? ""} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" form={`update-${b.id}`} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <label htmlFor={`active-${b.id}`} className="text-sm text-zinc-300">Active</label>
                  <div>
                    <Switch
                      id={`active-${b.id}`}
                      checked={activeMap[b.id] ?? !!b.isActive}
                      onCheckedChange={(v) => setActiveMap((p) => ({ ...p, [b.id]: v }))}
                      className="data-[state=checked]:bg-green-600 h-7 w-14"
                      thumbClassName="size-6"
                    />
                  </div>
                  <input type="hidden" name="isActive" value={(activeMap[b.id] ?? !!b.isActive) ? "true" : "false"} form={`update-${b.id}`} />
                </div>
                {b.buttonImageUrl && (
                  <div className="md:col-span-2">
                    <div
                      className="mt-2 relative w-full h-36 md:h-40 overflow-hidden rounded-xl ring-1 ring-white/10 cursor-pointer"
                      onClick={() => document.getElementById(`file-${b.id}`)?.click()}
                    >
                      <Image src={existingPreview[b.id] ?? b.buttonImageUrl} alt="Preview" fill className="object-cover" unoptimized />
                      <input id={`file-${b.id}`} type="file" name="buttonImage" accept="image/*" className="sr-only" onChange={(e) => {
                        const f = e.currentTarget.files?.[0];
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setExistingPreview((p) => ({ ...p, [b.id]: url }));
                        }
                      }} />
                    </div>
                  </div>
                )}
                {!b.buttonImageUrl && (
                  <div className="md:col-span-2">
                    <div
                      className="mt-2 relative w-full h-36 md:h-40 overflow-hidden rounded-xl ring-1 ring-white/10 bg-gradient-to-r from-blue-600 via-zinc-900 to-black cursor-pointer"
                      onClick={() => document.getElementById(`file-${b.id}`)?.click()}
                    >
                      <input id={`file-${b.id}`} type="file" name="buttonImage" accept="image/*" className="sr-only" onChange={(e) => {
                        const f = e.currentTarget.files?.[0];
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setExistingPreview((p) => ({ ...p, [b.id]: url }));
                        }
                      }} />
                      {existingPreview[b.id] && <Image src={existingPreview[b.id]} alt="Preview" fill className="object-cover" unoptimized />}
                      {!existingPreview[b.id] && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                          Klik untuk pilih gambar
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <form id={`update-${b.id}`} onSubmit={submitUpdate} className="flex items-center justify-between gap-3">
                <input type="hidden" name="id" value={b.id} />
                <Link href="/" className="inline-flex items-center gap-2 rounded-md bg-zinc-800 text-white px-4 py-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Preview
                </Link>
                <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-500">
                  <Save className="h-4 w-4" />
                  Simpan
                </button>
              </form>
            </div>
          </div>
        ))}
        {drafts.map((key) => (
          <div key={key} className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-gradient-to-r from-blue-600 via-zinc-950 to-black p-0">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="text-white text-sm font-semibold">Benner baru</div>
              <button
                onClick={() => setDrafts((d) => d.filter((k) => k !== key))}
                className="inline-flex items-center gap-2 rounded-md bg-zinc-800 text-white px-3 py-1 text-xs"
              >
                <X className="h-4 w-4" />
                Batal
              </button>
            </div>
            <form onSubmit={submitCreate} className="px-5 pb-5 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-zinc-300 mb-2">Judul</label>
                  <input name="title" placeholder="Masukkan judul" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-zinc-300 mb-2">Sub Judul</label>
                  <textarea name="subtitle" rows={3} placeholder="Tulis sub judul" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Button Link</label>
                  <input name="buttonLink" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <label htmlFor={`draft-active`} className="text-sm text-zinc-300">Active</label>
                  <div>
                    <Switch
                      id={`draft-active`}
                      checked={draftActive[key] ?? true}
                      onCheckedChange={(v) => setDraftActive((p) => ({ ...p, [key]: v }))}
                      className="data-[state=checked]:bg-green-600 h-7 w-14"
                      thumbClassName="size-6"
                    />
                  </div>
                  <input type="hidden" name="isActive" value={(draftActive[key] ?? true) ? "true" : "false"} />
                </div>
                {draftPreview[key] && (
                  <div className="md:col-span-2">
                    <div
                      className="mt-2 relative w-full h-36 md:h-40 overflow-hidden rounded-xl ring-1 ring-white/10 cursor-pointer"
                      onClick={() => document.getElementById(`draft-file-${key}`)?.click()}
                    >
                      <Image src={draftPreview[key]} alt="Preview" fill className="object-cover" unoptimized />
                      <input
                        id={`draft-file-${key}`}
                        type="file"
                        name="buttonImage"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.currentTarget.files?.[0];
                          if (f) {
                            const url = URL.createObjectURL(f);
                            setDraftPreview((p) => ({ ...p, [key]: url }));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
                {!draftPreview[key] && (
                  <div className="md:col-span-2">
                    <div
                      className="mt-2 relative w-full h-36 md:h-40 overflow-hidden rounded-xl ring-1 ring-white/10 bg-gradient-to-r from-blue-600 via-zinc-900 to-black cursor-pointer"
                      onClick={() => document.getElementById(`draft-file-${key}`)?.click()}
                    >
                      <input
                        id={`draft-file-${key}`}
                        type="file"
                        name="buttonImage"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.currentTarget.files?.[0];
                          if (f) {
                            const url = URL.createObjectURL(f);
                            setDraftPreview((p) => ({ ...p, [key]: url }));
                          }
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                        Klik untuk pilih gambar
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-3">
                <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-500">
                  <Save className="h-4 w-4" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
