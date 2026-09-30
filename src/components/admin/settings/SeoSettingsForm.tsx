"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save as SaveIcon, Search as SearchIcon, MapPin as MapPinIcon, Phone as PhoneIcon } from "lucide-react";

type Initial = {
  siteName?: string | null;
  tagline?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  shortDescription?: string | null;
  legalAddress?: string | null;
  regNumber?: string | null;
  smTelegramUrl?: string | null;
  smYoutubeUrl?: string | null;
  smDiscordUrl?: string | null;
  smFacebookUrl?: string | null;
};

export function SeoSettingsForm({ initial }: { initial: Initial }) {
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
        router.push("/admin/settings?toast=error&tab=seo");
        return;
      }
      router.push("/admin/settings?toast=saved&tab=seo");
    } catch {
      router.push("/admin/settings?toast=error&tab=seo");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 hover:border-brand-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-all";
  const textarea = "w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 hover:border-brand-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-all resize-none";

  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <SearchIcon className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-white">Website Meta</span>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="siteName" className="block text-xs font-medium text-gray-300 mb-1">Site Name (Title)</label>
              <input id="siteName" name="siteName" type="text" className={input} placeholder="e.g. ArcaneBoost" defaultValue={initial.siteName ?? ""} />
            </div>
            <div>
              <label htmlFor="tagline" className="block text-xs font-medium text-gray-300 mb-1">Tagline (Description)</label>
              <input id="tagline" name="tagline" type="text" className={input} placeholder="e.g. Boost your game" defaultValue={initial.tagline ?? ""} />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <PhoneIcon className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-white">Contact</span>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="contactEmail" className="block text-xs font-medium text-gray-300 mb-1">Contact Email</label>
              <input id="contactEmail" name="contactEmail" type="email" className={input} placeholder="e.g. contact@arcaneboost.com" defaultValue={initial.contactEmail ?? ""} />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
              <input id="contactPhone" name="contactPhone" type="text" className={input} placeholder="e.g. +62-812-xxx-xxx" defaultValue={initial.contactPhone ?? ""} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPinIcon className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-white">Organization</span>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="footerShortDescription" className="block text-xs font-medium text-gray-300 mb-1">Short Description</label>
              <textarea id="footerShortDescription" name="footerShortDescription" className={`${textarea} min-h-24`} placeholder="Write short description" defaultValue={initial.shortDescription ?? ""} />
            </div>
            <div>
              <label htmlFor="footerRegNumber" className="block text-xs font-medium text-gray-300 mb-1">Reg Number</label>
              <input id="footerRegNumber" name="footerRegNumber" type="text" className={input} placeholder="e.g. HE395043" defaultValue={initial.regNumber ?? ""} />
            </div>
            <div>
              <label htmlFor="footerLegalAddress" className="block text-xs font-medium text-gray-300 mb-1">Legal Address</label>
              <textarea id="footerLegalAddress" name="footerLegalAddress" className={`${textarea} min-h-20`} placeholder="e.g. Diagorou 4, Kermia Building, 3rd floor, Nicosia, Cyprus." defaultValue={initial.legalAddress ?? ""} />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <SearchIcon className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-white">Social Links (sameAs)</span>
          </div>
          <div className="space-y-3">
            <input name="smTelegramUrl" type="url" className={input} placeholder="Telegram URL" defaultValue={initial.smTelegramUrl ?? ""} />
            <input name="smYoutubeUrl" type="url" className={input} placeholder="YouTube URL" defaultValue={initial.smYoutubeUrl ?? ""} />
            <input name="smDiscordUrl" type="url" className={input} placeholder="Discord URL" defaultValue={initial.smDiscordUrl ?? ""} />
            <input name="smFacebookUrl" type="url" className={input} placeholder="Facebook URL" defaultValue={initial.smFacebookUrl ?? ""} />
          </div>
        </div>
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
