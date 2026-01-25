"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Save as SaveIcon } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("footer1");
  const [pmPreviews, setPmPreviews] = useState({
    pmVisa: initial.pmVisaUrl ?? "",
    pmMastercard: initial.pmMastercardUrl ?? "",
    pmGpay: initial.pmGpayUrl ?? "",
    pmApplePay: initial.pmApplePayUrl ?? "",
    pmPaypal: initial.pmPaypalUrl ?? "",
    pmStripe: initial.pmStripeUrl ?? "",
  });

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

  const inputClassName = "input input-bordered input-sm w-full";
  const textareaClassName = "textarea textarea-bordered w-full";

  return (
    <form onSubmit={onSubmit} method="post" encType="multipart/form-data" className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body p-6">
        <div role="tablist" className="tabs tabs-lifted">
            <a 
                role="tab" 
                className={`tab ${activeTab === "footer1" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("footer1")}
            >
                Footer 1
            </a>
            <a 
                role="tab" 
                className={`tab ${activeTab === "footer2" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("footer2")}
            >
                Footer 2
            </a>
        </div>
        
        <div className="mt-6">
            {activeTab === "footer1" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 rounded-box border border-base-300 bg-base-200/50 p-4">
                    <label className="block text-sm font-semibold mb-2">Gamingqu Links</label>
                    <div className="grid grid-cols-2 gap-2 text-[11px] opacity-70 mb-2">
                        <span>Judul</span>
                        <span>URL</span>
                    </div>
                    <div className="space-y-3">
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
                        <label htmlFor="footerShortDescription" className="block text-sm font-semibold mb-2">Deskripsi Singkat</label>
                        <textarea
                        id="footerShortDescription"
                        name="footerShortDescription"
                        className={`${textareaClassName} min-h-24`}
                        placeholder="Tulis deskripsi singkat di bawah logo"
                        defaultValue={initial.shortDescription ?? ""}
                        />
                    </div>
                    </div>
                    
                    <div className="lg:col-span-1 rounded-box border border-base-300 bg-base-200/50 p-4">
                    <label className="block text-sm font-semibold mb-2">Legal Links</label>
                    <div className="grid grid-cols-2 gap-2 text-[11px] opacity-70 mb-2">
                        <span>Judul</span>
                        <span>URL</span>
                    </div>
                    <div className="space-y-3">
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
                        <label className="block text-sm font-semibold mb-2">Link Sosial Media</label>
                        <div className="grid grid-cols-2 gap-3">
                        <input name="smTelegramUrl" type="url" className={inputClassName} placeholder="Telegram URL" defaultValue={initial.smTelegramUrl ?? ""} />
                        <input name="smYoutubeUrl" type="url" className={inputClassName} placeholder="YouTube URL" defaultValue={initial.smYoutubeUrl ?? ""} />
                        <input name="smDiscordUrl" type="url" className={inputClassName} placeholder="Discord Invite URL" defaultValue={initial.smDiscordUrl ?? ""} />
                        <input name="smFacebookUrl" type="url" className={inputClassName} placeholder="Facebook Page URL" defaultValue={initial.smFacebookUrl ?? ""} />
                        </div>
                    </div>
                    </div>
                    
                    <div className="lg:col-span-1 rounded-box border border-base-300 bg-base-200/50 p-4">
                    <label className="block text-sm font-semibold mb-2">Payment Methods (upload)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <div key={field.key} className="rounded-box border border-base-300 bg-base-100 p-3 space-y-2">
                            <label htmlFor={field.id} className="text-xs font-semibold">{field.label}</label>
                            <div className="relative h-20 rounded-md border border-base-300 bg-base-200 flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                <Image src={previewUrl} alt={field.alt} fill sizes="160px" className="object-contain p-2" unoptimized />
                                ) : (
                                <span className="text-[11px] opacity-50">Preview</span>
                                )}
                            </div>
                            <input
                                id={field.id}
                                name={field.name}
                                type="file"
                                accept="image/*"
                                onChange={handlePreviewChange(field.key as keyof typeof pmPreviews)}
                                className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                            />
                            </div>
                        );
                        })}
                    </div>
                    </div>
                </div>
            )}
            
            {activeTab === "footer2" && (
                <div className="space-y-6">
                    <div>
                    <label htmlFor="footerDisclaimer" className="block text-sm font-semibold mb-2">Disclaimer</label>
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
                        <label htmlFor="footerCopyright" className="block text-sm font-semibold mb-2">Copyright</label>
                        <input
                        id="footerCopyright"
                        name="footerCopyright"
                        type="text"
                        className={inputClassName}
                        placeholder="Contoh: © Gamingqu 2018-2026. All rights reserved."
                        defaultValue={initial.copyright ?? ""}
                        />
                    </div>
                    <div>
                        <label htmlFor="footerRegNumber" className="block text-sm font-semibold mb-2">Reg Number</label>
                        <input
                        id="footerRegNumber"
                        name="footerRegNumber"
                        type="text"
                        className={inputClassName}
                        placeholder="Contoh: HE395043"
                        defaultValue={initial.regNumber ?? ""}
                        />
                    </div>
                    </div>
                    <div>
                    <label htmlFor="footerLegalAddress" className="block text-sm font-semibold mb-2">Alamat Legal</label>
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
                        <label htmlFor="badgeMastercardUrl" className="block text-sm font-semibold mb-2">Badge Mastercard URL</label>
                        <input
                        id="badgeMastercardUrl"
                        name="badgeMastercardUrl"
                        type="url"
                        className={inputClassName}
                        placeholder="https://..."
                        defaultValue={initial.badgeMastercardUrl ?? ""}
                        />
                        {initial.badgeMastercardUrl ? (
                        <Image src={initial.badgeMastercardUrl} alt="Mastercard SecureCode" width={96} height={32} className="mt-2 h-8 w-auto" unoptimized />
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="badgeVisaUrl" className="block text-sm font-semibold mb-2">Badge Visa URL</label>
                        <input
                        id="badgeVisaUrl"
                        name="badgeVisaUrl"
                        type="url"
                        className={inputClassName}
                        placeholder="https://..."
                        defaultValue={initial.badgeVisaUrl ?? ""}
                        />
                        {initial.badgeVisaUrl ? (
                        <Image src={initial.badgeVisaUrl} alt="Verified by Visa" width={96} height={32} className="mt-2 h-8 w-auto" unoptimized />
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="badgePciUrl" className="block text-sm font-semibold mb-2">Badge PCI DSS URL</label>
                        <input
                        id="badgePciUrl"
                        name="badgePciUrl"
                        type="url"
                        className={inputClassName}
                        placeholder="https://..."
                        defaultValue={initial.badgePciUrl ?? ""}
                        />
                        {initial.badgePciUrl ? (
                        <Image src={initial.badgePciUrl} alt="PCI DSS" width={96} height={32} className="mt-2 h-8 w-auto" unoptimized />
                        ) : null}
                    </div>
                    </div>
                </div>
            )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="btn btn-primary gap-2"
            disabled={busy}
          >
            {busy && <span className="loading loading-spinner loading-sm"></span>}
            <SaveIcon className="h-4 w-4" />
            <span>Simpan Footer</span>
          </button>
        </div>
      </div>
    </form>
  );
}
