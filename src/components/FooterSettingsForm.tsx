"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Save as SaveIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Initial = {
  logoUrl?: string | null;
  disclaimer?: string | null;
  shortDescription?: string | null;
  copyright?: string | null;
  legalAddress?: string | null;
  regNumber?: string | null;
  badgeMastercardUrl?: string | null;
  badgeVisaUrl?: string | null;
  badgePciUrl?: string | null;
  smTelegramUrl?: string | null;
  smYoutubeUrl?: string | null;
  smDiscordUrl?: string | null;
  smFacebookUrl?: string | null;
  navHomeTitle?: string | null;
  navHomeUrl?: string | null;
  navAboutTitle?: string | null;
  navAboutUrl?: string | null;
  navFaqTitle?: string | null;
  navFaqUrl?: string | null;
  navBoosterTitle?: string | null;
  navBoosterUrl?: string | null;
  legal1Title?: string | null;
  legal1Url?: string | null;
  legal2Title?: string | null;
  legal2Url?: string | null;
  legal3Title?: string | null;
  legal3Url?: string | null;
  legal4Title?: string | null;
  legal4Url?: string | null;
  pmVisaUrl?: string | null;
  pmMastercardUrl?: string | null;
  pmGpayUrl?: string | null;
  pmApplePayUrl?: string | null;
  pmPaypalUrl?: string | null;
  pmStripeUrl?: string | null;
};

export function FooterSettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pmPreviews, setPmPreviews] = useState({
    pmVisa: initial.pmVisaUrl ?? "",
    pmMastercard: initial.pmMastercardUrl ?? "",
    pmGpay: initial.pmGpayUrl ?? "",
    pmApplePay: initial.pmApplePayUrl ?? "",
    pmPaypal: initial.pmPaypalUrl ?? "",
    pmStripe: initial.pmStripeUrl ?? "",
  });
  const hasFooter2Data =
    [
      initial.disclaimer,
      initial.copyright,
      initial.legalAddress,
      initial.regNumber,
      initial.badgeMastercardUrl,
      initial.badgeVisaUrl,
      initial.badgePciUrl,
    ].some((v) => !!(typeof v === "string" ? v.trim().length > 0 : v));
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
  useEffect(() => {
    return () => {
      Object.values(pmPreviews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [pmPreviews]);
  const handlePreviewChange =
    (key: keyof typeof pmPreviews) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPmPreviews((prev) => {
        const previousUrl = prev[key];
        if (previousUrl && previousUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previousUrl);
        }
        return { ...prev, [key]: url };
      });
    };
  const inputClassName =
    "rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40";
  const textareaClassName =
    "mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40";
  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-6">
      <Tabs defaultValue={hasFooter2Data ? "footer2" : "footer1"}>
        <TabsList>
          <TabsTrigger value="footer1">Footer 1</TabsTrigger>
          <TabsTrigger value="footer2">Footer 2</TabsTrigger>
        </TabsList>
        <TabsContent value="footer1" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 rounded-xl border border-zinc-900 bg-zinc-950/60 p-4">
              <label className="block text-sm font-semibold">Gamingqu Links</label>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-zinc-500">
                <span>Judul</span>
                <span>URL</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <input name="navHomeTitle" type="text" className={inputClassName} placeholder="Home" defaultValue={initial.navHomeTitle ?? ""} />
                  <input name="navHomeUrl" type="url" className={inputClassName} placeholder="/" defaultValue={initial.navHomeUrl ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="navAboutTitle" type="text" className={inputClassName} placeholder="About Us" defaultValue={initial.navAboutTitle ?? ""} />
                  <input name="navAboutUrl" type="url" className={inputClassName} placeholder="/about" defaultValue={initial.navAboutUrl ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="navFaqTitle" type="text" className={inputClassName} placeholder="FAQ" defaultValue={initial.navFaqTitle ?? ""} />
                  <input name="navFaqUrl" type="url" className={inputClassName} placeholder="/faq" defaultValue={initial.navFaqUrl ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="navBoosterTitle" type="text" className={inputClassName} placeholder="Become a Booster" defaultValue={initial.navBoosterTitle ?? ""} />
                  <input name="navBoosterUrl" type="url" className={inputClassName} placeholder="/booster/apply" defaultValue={initial.navBoosterUrl ?? ""} />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="footerShortDescription" className="block text-sm font-semibold">Deskripsi Singkat</label>
                <textarea
                  id="footerShortDescription"
                  name="footerShortDescription"
                  className={`${textareaClassName} min-h-24`}
                  placeholder="Tulis deskripsi singkat di bawah logo"
                  defaultValue={initial.shortDescription ?? ""}
                />
              </div>
            </div>
            <div className="lg:col-span-1 rounded-xl border border-zinc-900 bg-zinc-950/60 p-4">
              <label className="block text-sm font-semibold">Legal Links</label>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-zinc-500">
                <span>Judul</span>
                <span>URL</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <input name="legal1Title" type="text" className={inputClassName} placeholder="Terms and Conditions" defaultValue={initial.legal1Title ?? ""} />
                  <input name="legal1Url" type="url" className={inputClassName} placeholder="/terms" defaultValue={initial.legal1Url ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="legal2Title" type="text" className={inputClassName} placeholder="Privacy Policy" defaultValue={initial.legal2Title ?? ""} />
                  <input name="legal2Url" type="url" className={inputClassName} placeholder="/privacy" defaultValue={initial.legal2Url ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="legal3Title" type="text" className={inputClassName} placeholder="Refund Policy" defaultValue={initial.legal3Title ?? ""} />
                  <input name="legal3Url" type="url" className={inputClassName} placeholder="/refund" defaultValue={initial.legal3Url ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="legal4Title" type="text" className={inputClassName} placeholder="Cookie Policy" defaultValue={initial.legal4Title ?? ""} />
                  <input name="legal4Url" type="url" className={inputClassName} placeholder="/cookies" defaultValue={initial.legal4Url ?? ""} />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-semibold">Link Sosial Media</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <input name="smTelegramUrl" type="url" className={inputClassName} placeholder="Telegram URL" defaultValue={initial.smTelegramUrl ?? ""} />
                  <input name="smYoutubeUrl" type="url" className={inputClassName} placeholder="YouTube URL" defaultValue={initial.smYoutubeUrl ?? ""} />
                  <input name="smDiscordUrl" type="url" className={inputClassName} placeholder="Discord Invite URL" defaultValue={initial.smDiscordUrl ?? ""} />
                  <input name="smFacebookUrl" type="url" className={inputClassName} placeholder="Facebook Page URL" defaultValue={initial.smFacebookUrl ?? ""} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 rounded-xl border border-zinc-900 bg-zinc-950/60 p-4">
              <label className="block text-sm font-semibold">Payment Methods (upload)</label>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "pmVisa", id: "pmVisa", name: "pmVisa", label: "Gambar 1", alt: "Payment Method 1" },
                  { key: "pmMastercard", id: "pmMastercard", name: "pmMastercard", label: "Gambar 2", alt: "Payment Method 2" },
                  { key: "pmGpay", id: "pmGpay", name: "pmGpay", label: "Gambar 3", alt: "Payment Method 3" },
                  { key: "pmApplePay", id: "pmApplePay", name: "pmApplePay", label: "Gambar 4", alt: "Payment Method 4" },
                  { key: "pmPaypal", id: "pmPaypal", name: "pmPaypal", label: "Gambar 5", alt: "Payment Method 5" },
                  { key: "pmStripe", id: "pmStripe", name: "pmStripe", label: "Gambar 6", alt: "Payment Method 6" },
                ].map((field) => {
                  const previewUrl = pmPreviews[field.key as keyof typeof pmPreviews];
                  return (
                    <div key={field.key} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 space-y-2">
                      <label htmlFor={field.id} className="text-xs font-semibold text-zinc-200">{field.label}</label>
                      <div className="relative h-20 rounded-md border border-zinc-800 bg-zinc-900/40 flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                          <Image src={previewUrl} alt={field.alt} fill sizes="160px" className="object-contain p-2" unoptimized />
                        ) : (
                          <span className="text-[11px] text-zinc-500">Preview</span>
                        )}
                      </div>
                      <input
                        id={field.id}
                        name={field.name}
                        type="file"
                        accept="image/*"
                        onChange={handlePreviewChange(field.key as keyof typeof pmPreviews)}
                        className="block w-full text-xs text-white file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:text-white hover:file:bg-zinc-700"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="footer2" className="mt-4">
          <div className="space-y-6">
            <div>
              <label htmlFor="footerDisclaimer" className="block text-sm font-semibold">Disclaimer</label>
              <textarea
                id="footerDisclaimer"
                name="footerDisclaimer"
                className={`${textareaClassName} min-h-24`}
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
                  className={textareaClassName}
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
                  className={textareaClassName}
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
                className={`${textareaClassName} min-h-20`}
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
                  className={textareaClassName}
                  placeholder="https://..."
                  defaultValue={initial.badgeMastercardUrl ?? ""}
                />
                {initial.badgeMastercardUrl ? (
                  <Image src={initial.badgeMastercardUrl} alt="Mastercard SecureCode" width={96} height={32} className="mt-2 h-8 w-auto" unoptimized />
                ) : null}
              </div>
              <div>
                <label htmlFor="badgeVisaUrl" className="block text-sm font-semibold">Badge Visa URL</label>
                <input
                  id="badgeVisaUrl"
                  name="badgeVisaUrl"
                  type="url"
                  className={textareaClassName}
                  placeholder="https://..."
                  defaultValue={initial.badgeVisaUrl ?? ""}
                />
                {initial.badgeVisaUrl ? (
                  <Image src={initial.badgeVisaUrl} alt="Verified by Visa" width={96} height={32} className="mt-2 h-8 w-auto" unoptimized />
                ) : null}
              </div>
              <div>
                <label htmlFor="badgePciUrl" className="block text-sm font-semibold">Badge PCI DSS URL</label>
                <input
                  id="badgePciUrl"
                  name="badgePciUrl"
                  type="url"
                  className={textareaClassName}
                  placeholder="https://..."
                  defaultValue={initial.badgePciUrl ?? ""}
                />
                {initial.badgePciUrl ? (
                  <Image src={initial.badgePciUrl} alt="PCI DSS" width={96} height={32} className="mt-2 h-8 w-auto" unoptimized />
                ) : null}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
