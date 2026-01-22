"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save as SaveIcon } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

type Initial = {
  siteName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/settings", { method: "POST", body: fd });
      if (!res.ok) {
        router.push("/admin/settings?toast=error");
        return;
      }
      router.push("/admin/settings?toast=saved");
    } catch {
      router.push("/admin/settings?toast=error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="siteName" className="block text-sm font-semibold">Nama Website</label>
          <input
            id="siteName"
            name="siteName"
            type="text"
            required
            placeholder="Contoh: Gamingqu"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
            defaultValue={initial.siteName ?? ""}
          />
        </div>
        <div>
          <label htmlFor="tagline" className="block text-sm font-semibold">Tagline</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            placeholder="Contoh: Boost your game"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
            defaultValue={initial.tagline ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-semibold">Email Kontak</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="Contoh: contact@gamingqu.com"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
            defaultValue={initial.contactEmail ?? ""}
          />
        </div>
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-semibold">No. Telepon</label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            placeholder="Contoh: +62-812-xxx-xxx"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
            defaultValue={initial.contactPhone ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadField id="logo" name="logo" label="Logo" previewHeight={120} initialUrl={initial.logoUrl ?? null} />
        <ImageUploadField id="favicon" name="favicon" label="Favicon" previewHeight={120} initialUrl={initial.faviconUrl ?? null} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          disabled={busy}
        >
          <SaveIcon className="h-4 w-4" />
          <span>Simpan</span>
        </button>
      </div>
    </form>
  );
}

