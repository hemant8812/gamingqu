import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getFooterSettings, getWebsiteSettingCore } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { PageToast } from "@/components/shared/PageToast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmbedSettings } from "@/components/admin/settings/EmbedSettings";
import { Settings as SettingsIcon, Code2 as CodeIcon, Layout as LayoutIcon } from "lucide-react";
import { FooterSettingsForm } from "@/components/admin/settings/FooterSettingsForm";
import { parseToast } from "@/lib/page-utils";

export default async function AdminSettingsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast ? (toast === "error" ? "Terjadi kesalahan saat menyimpan pengaturan" : "Pengaturan berhasil disimpan") : undefined;
  const tabParam = sp?.tab;
  const tab = typeof tabParam === "string" ? tabParam : Array.isArray(tabParam) ? tabParam[0] ?? undefined : undefined;
  const setting = await getWebsiteSettingCore();
  const footer = await getFooterSettings();
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
