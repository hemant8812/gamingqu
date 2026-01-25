"use client";
import { useState } from "react";
import { Settings as SettingsIcon, Code2 as CodeIcon, Layout as LayoutIcon } from "lucide-react";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { FooterSettingsForm } from "@/components/admin/settings/FooterSettingsForm";
import { EmbedSettings } from "@/components/admin/settings/EmbedSettings";

type SettingCore = {
    siteName?: string | null;
    tagline?: string | null;
    logoUrl?: string | null;
    faviconUrl?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
} | null;

type FooterInitial = {
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
} | null;

type Props = {
    initialTab?: string;
    setting: SettingCore;
    footer: FooterInitial;
};

export function AdminSettingsTabs({ initialTab, setting, footer }: Props) {
    const [activeTab, setActiveTab] = useState(initialTab === "footer" ? "footer" : initialTab === "embed" ? "embed" : "general");

    return (
        <div>
            <div role="tablist" className="tabs tabs-lifted">
                <a 
                    role="tab" 
                    className={`tab ${activeTab === "general" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("general")}
                >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    General
                </a>
                <a 
                    role="tab" 
                    className={`tab ${activeTab === "footer" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("footer")}
                >
                    <LayoutIcon className="w-4 h-4 mr-2" />
                    Footer
                </a>
                <a 
                    role="tab" 
                    className={`tab ${activeTab === "embed" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("embed")}
                >
                    <CodeIcon className="w-4 h-4 mr-2" />
                    Embed
                </a>
            </div>
            
            <div className="mt-6">
                {activeTab === "general" && (
                    <SettingsForm initial={{
                        siteName: setting?.siteName ?? "Gamingqu",
                        tagline: setting?.tagline ?? "",
                        logoUrl: setting?.logoUrl ?? null,
                        faviconUrl: setting?.faviconUrl ?? null,
                        contactEmail: setting?.contactEmail ?? "",
                        contactPhone: setting?.contactPhone ?? ""
                    }} />
                )}
                {activeTab === "footer" && (
                    <FooterSettingsForm initial={{
                        logoUrl: setting?.logoUrl ?? "",
                        disclaimer: footer?.disclaimer ?? "",
                        shortDescription: footer?.shortDescription ?? "",
                        copyright: footer?.copyright ?? "",
                        legalAddress: footer?.legalAddress ?? "",
                        regNumber: footer?.regNumber ?? "",
                        smTelegramUrl: footer?.smTelegramUrl ?? "",
                        smYoutubeUrl: footer?.smYoutubeUrl ?? "",
                        smDiscordUrl: footer?.smDiscordUrl ?? "",
                        smFacebookUrl: footer?.smFacebookUrl ?? "",
                        badgeMastercardUrl: footer?.badgeMastercardUrl ?? "",
                        badgeVisaUrl: footer?.badgeVisaUrl ?? "",
                        badgePciUrl: footer?.badgePciUrl ?? "",
                        navHomeTitle: footer?.navHomeTitle ?? "",
                        navHomeUrl: footer?.navHomeUrl ?? "",
                        navAboutTitle: footer?.navAboutTitle ?? "",
                        navAboutUrl: footer?.navAboutUrl ?? "",
                        navFaqTitle: footer?.navFaqTitle ?? "",
                        navFaqUrl: footer?.navFaqUrl ?? "",
                        navBoosterTitle: footer?.navBoosterTitle ?? "",
                        navBoosterUrl: footer?.navBoosterUrl ?? "",
                        legal1Title: footer?.legal1Title ?? "",
                        legal1Url: footer?.legal1Url ?? "",
                        legal2Title: footer?.legal2Title ?? "",
                        legal2Url: footer?.legal2Url ?? "",
                        legal3Title: footer?.legal3Title ?? "",
                        legal3Url: footer?.legal3Url ?? "",
                        legal4Title: footer?.legal4Title ?? "",
                        legal4Url: footer?.legal4Url ?? "",
                        pmVisaUrl: footer?.pmVisaUrl ?? "",
                        pmMastercardUrl: footer?.pmMastercardUrl ?? "",
                        pmGpayUrl: footer?.pmGpayUrl ?? "",
                        pmApplePayUrl: footer?.pmApplePayUrl ?? "",
                        pmPaypalUrl: footer?.pmPaypalUrl ?? "",
                        pmStripeUrl: footer?.pmStripeUrl ?? "",
                    }} />
                )}
                {activeTab === "embed" && (
                    <EmbedSettings />
                )}
            </div>
        </div>
    );
}
