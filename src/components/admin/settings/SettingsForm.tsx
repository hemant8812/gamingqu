"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save as SaveIcon } from "lucide-react";
import { ImageUploadField } from "@/components/shared/ImageUploadField";

type Initial = {
  siteName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  footerDisclaimer?: string | null;
  footerCopyright?: string | null;
  footerLegalAddress?: string | null;
  footerRegNumber?: string | null;
  badgeMastercardUrl?: string | null;
  badgeVisaUrl?: string | null;
  badgePciUrl?: string | null;
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
        router.push("/admin/settings?toast=error&tab=general");
        return;
      }
      router.push("/admin/settings?toast=saved&tab=general");
    } catch {
      router.push("/admin/settings?toast=error&tab=general");
    } finally {
      setBusy(false);
    }
  };

  const inputClassName = "w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 hover:border-brand-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-all";

  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-300 mb-2">Website Name</label>
          <input
            id="siteName"
            name="siteName"
            type="text"
            required
            placeholder="e.g. ArcaneBoost"
            className={inputClassName}
            defaultValue={initial.siteName ?? ""}
          />
        </div>
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            placeholder="e.g. Boost your game"
            className={inputClassName}
            defaultValue={initial.tagline ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="e.g. contact@arcaneboost.com"
            className={inputClassName}
            defaultValue={initial.contactEmail ?? ""}
          />
        </div>
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            placeholder="e.g. +62-812-xxx-xxx"
            className={inputClassName}
            defaultValue={initial.contactPhone ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadField id="logo" name="logo" label="Logo" previewHeight={120} initialUrl={initial.logoUrl ?? null} />
        <ImageUploadField id="favicon" name="favicon" label="Favicon" previewHeight={120} initialUrl={initial.faviconUrl ?? null} />
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="h-11 px-5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          disabled={busy}
        >
          {busy && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
          <SaveIcon className="h-4 w-4" />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
}
