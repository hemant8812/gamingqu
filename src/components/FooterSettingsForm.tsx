"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save as SaveIcon } from "lucide-react";

type Initial = {
  disclaimer?: string | null;
  copyright?: string | null;
  legalAddress?: string | null;
  regNumber?: string | null;
  badgeMastercardUrl?: string | null;
  badgeVisaUrl?: string | null;
  badgePciUrl?: string | null;
};

export function FooterSettingsForm({ initial }: { initial: Initial }) {
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
        router.push("/admin/settings?toast=error&tab=footer");
        return;
      }
      router.push("/admin/settings?toast=saved&tab=footer");
    } catch {
      router.push("/admin/settings?toast=error&tab=footer");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="footerDisclaimer" className="block text-sm font-semibold">Disclaimer</label>
          <textarea
            id="footerDisclaimer"
            name="footerDisclaimer"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white min-h-24"
            placeholder="Tulis disclaimer di sini"
            defaultValue={initial.disclaimer ?? ""}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="footerCopyright" className="block text-sm font-semibold">Copyright</label>
            <input
              id="footerCopyright"
              name="footerCopyright"
              type="text"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              placeholder="Contoh: © Gamingqu 2018-2026. All rights reserved."
              defaultValue={initial.copyright ?? ""}
            />
          </div>
          <div>
            <label htmlFor="footerRegNumber" className="block text-sm font-semibold">Reg Number</label>
            <input
              id="footerRegNumber"
              name="footerRegNumber"
              type="text"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              placeholder="Contoh: HE395043"
              defaultValue={initial.regNumber ?? ""}
            />
          </div>
        </div>
        <div>
          <label htmlFor="footerLegalAddress" className="block text-sm font-semibold">Alamat Legal</label>
          <textarea
            id="footerLegalAddress"
            name="footerLegalAddress"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white min-h-20"
            placeholder="Contoh: Diagorou 4, Kermia Building, 3rd floor, Nicosia, Cyprus."
            defaultValue={initial.legalAddress ?? ""}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="badgeMastercardUrl" className="block text-sm font-semibold">Badge Mastercard URL</label>
            <input
              id="badgeMastercardUrl"
              name="badgeMastercardUrl"
              type="url"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              placeholder="https://..."
              defaultValue={initial.badgeMastercardUrl ?? ""}
            />
          </div>
          <div>
            <label htmlFor="badgeVisaUrl" className="block text-sm font-semibold">Badge Visa URL</label>
            <input
              id="badgeVisaUrl"
              name="badgeVisaUrl"
              type="url"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              placeholder="https://..."
              defaultValue={initial.badgeVisaUrl ?? ""}
            />
          </div>
          <div>
            <label htmlFor="badgePciUrl" className="block text-sm font-semibold">Badge PCI DSS URL</label>
            <input
              id="badgePciUrl"
              name="badgePciUrl"
              type="url"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              placeholder="https://..."
              defaultValue={initial.badgePciUrl ?? ""}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          disabled={busy}
        >
          <SaveIcon className="h-4 w-4" />
          <span>Simpan Footer</span>
        </button>
      </div>
    </form>
  );
}
