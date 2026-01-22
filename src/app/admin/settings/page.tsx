import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";
import { PageToast } from "@/components/PageToast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmbedSettings } from "@/components/EmbedSettings";
import { Settings as SettingsIcon, Code2 as CodeIcon, Layout as LayoutIcon } from "lucide-react";
import { FooterSettingsForm } from "@/components/FooterSettingsForm";

type FooterSetting = {
  disclaimer?: string | null;
  shortDescription?: string | null;
  copyright?: string | null;
  legalAddress?: string | null;
  regNumber?: string | null;
  smTelegramUrl?: string | null;
  smYoutubeUrl?: string | null;
  smDiscordUrl?: string | null;
  smFacebookUrl?: string | null;
  badgeMastercardUrl?: string | null;
  badgeVisaUrl?: string | null;
  badgePciUrl?: string | null;
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
  isActive?: boolean | null;
};

export default async function AdminSettingsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const toastParam = sp?.toast;
  const toast = typeof toastParam === "string" ? toastParam : Array.isArray(toastParam) ? toastParam[0] ?? undefined : undefined;
  const toastMessage = toast ? (toast === "error" ? "Terjadi kesalahan saat menyimpan pengaturan" : "Pengaturan berhasil disimpan") : undefined;
  const toastType = toast === "error" ? "error" : "success";
  const tabParam = sp?.tab;
  const tab = typeof tabParam === "string" ? tabParam : Array.isArray(tabParam) ? tabParam[0] ?? undefined : undefined;
  const setting = await db.websiteSetting.findUnique({
    where: { id: "singleton" },
    select: { siteName: true, tagline: true, logoUrl: true, faviconUrl: true, contactEmail: true, contactPhone: true },
  });
  let footer: FooterSetting | null = null;
  try {
    footer = await db.footerSetting.findUnique({
      where: { id: "singleton" },
      select: {
        disclaimer: true,
        shortDescription: true,
        copyright: true,
        legalAddress: true,
        regNumber: true,
        smTelegramUrl: true,
        smYoutubeUrl: true,
        smDiscordUrl: true,
        smFacebookUrl: true,
        badgeMastercardUrl: true,
        badgeVisaUrl: true,
        badgePciUrl: true,
        navHomeTitle: true,
        navHomeUrl: true,
        navAboutTitle: true,
        navAboutUrl: true,
        navFaqTitle: true,
        navFaqUrl: true,
        navBoosterTitle: true,
        navBoosterUrl: true,
        legal1Title: true,
        legal1Url: true,
        legal2Title: true,
        legal2Url: true,
        legal3Title: true,
        legal3Url: true,
        legal4Title: true,
        legal4Url: true,
        pmVisaUrl: true,
        pmMastercardUrl: true,
        pmGpayUrl: true,
        pmApplePayUrl: true,
        pmPaypalUrl: true,
        pmStripeUrl: true,
        isActive: true,
      },
    });
    if (!footer) {
      footer = await db.footerSetting.findFirst({
        where: {
          OR: [
            { disclaimer: { not: null } },
            { copyright: { not: null } },
            { legalAddress: { not: null } },
            { regNumber: { not: null } },
            { badgeMastercardUrl: { not: null } },
            { badgeVisaUrl: { not: null } },
            { badgePciUrl: { not: null } },
            { navHomeTitle: { not: null } },
            { navHomeUrl: { not: null } },
            { navAboutTitle: { not: null } },
            { navAboutUrl: { not: null } },
            { navFaqTitle: { not: null } },
            { navFaqUrl: { not: null } },
            { navBoosterTitle: { not: null } },
            { navBoosterUrl: { not: null } },
            { legal1Title: { not: null } },
            { legal1Url: { not: null } },
            { legal2Title: { not: null } },
            { legal2Url: { not: null } },
            { legal3Title: { not: null } },
            { legal3Url: { not: null } },
            { legal4Title: { not: null } },
            { legal4Url: { not: null } },
            { pmVisaUrl: { not: null } },
            { pmMastercardUrl: { not: null } },
            { pmGpayUrl: { not: null } },
            { pmApplePayUrl: { not: null } },
            { pmPaypalUrl: { not: null } },
            { pmStripeUrl: { not: null } },
            { shortDescription: { not: null } },
            { smTelegramUrl: { not: null } },
            { smYoutubeUrl: { not: null } },
            { smDiscordUrl: { not: null } },
            { smFacebookUrl: { not: null } },
          ],
        },
        select: {
          disclaimer: true,
          shortDescription: true,
          copyright: true,
          legalAddress: true,
          regNumber: true,
          smTelegramUrl: true,
          smYoutubeUrl: true,
          smDiscordUrl: true,
          smFacebookUrl: true,
          badgeMastercardUrl: true,
          badgeVisaUrl: true,
          badgePciUrl: true,
          navHomeTitle: true,
          navHomeUrl: true,
          navAboutTitle: true,
          navAboutUrl: true,
          navFaqTitle: true,
          navFaqUrl: true,
          navBoosterTitle: true,
          navBoosterUrl: true,
          legal1Title: true,
          legal1Url: true,
          legal2Title: true,
          legal2Url: true,
          legal3Title: true,
          legal3Url: true,
          legal4Title: true,
          legal4Url: true,
          pmVisaUrl: true,
          pmMastercardUrl: true,
          pmGpayUrl: true,
          pmApplePayUrl: true,
          pmPaypalUrl: true,
          pmStripeUrl: true,
          isActive: true,
        },
        orderBy: { updatedAt: "desc" },
      });
    }
  } catch {
    footer = null;
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <p className="mt-2 text-sm text-zinc-400">Pengaturan umum dan embed kode.</p>
        <section className="mt-6">
          <Tabs defaultValue={tab === "footer" ? "footer" : tab === "embed" ? "embed" : "general"}>
            <TabsList>
              <TabsTrigger value="general">
                <SettingsIcon />
                <span>Umum</span>
              </TabsTrigger>
              <TabsTrigger value="footer">
                <LayoutIcon />
                <span>Footer</span>
              </TabsTrigger>
              <TabsTrigger value="embed">
                <CodeIcon />
                <span>Embed</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <SettingsForm initial={{
                siteName: setting?.siteName ?? "Gamingqu",
                tagline: setting?.tagline ?? "",
                logoUrl: setting?.logoUrl ?? null,
                faviconUrl: setting?.faviconUrl ?? null,
                contactEmail: setting?.contactEmail ?? "",
                contactPhone: setting?.contactPhone ?? ""
              }} />
            </TabsContent>
            <TabsContent value="footer" className="mt-4">
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
            </TabsContent>
            <TabsContent value="embed" className="mt-4">
              <EmbedSettings />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
