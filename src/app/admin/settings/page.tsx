import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";
import { PageToast } from "@/components/PageToast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmbedSettings } from "@/components/EmbedSettings";
import { Settings as SettingsIcon, Code2 as CodeIcon, Layout as LayoutIcon } from "lucide-react";
import { FooterSettingsForm } from "@/components/FooterSettingsForm";

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
  const footerClient = (db as unknown as Record<string, unknown>)["footerSetting"] as
    | { findUnique: (args: unknown) => Promise<any> }
    | undefined;
  const footer = footerClient
    ? await footerClient.findUnique({
        where: { id: "singleton" },
        select: {
          disclaimer: true,
          copyright: true,
          legalAddress: true,
          regNumber: true,
          badgeMastercardUrl: true,
          badgeVisaUrl: true,
          badgePciUrl: true,
          isActive: true,
        },
      }).catch(() => null)
    : null;
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
                disclaimer: footer?.disclaimer ?? "",
                copyright: footer?.copyright ?? "",
                legalAddress: footer?.legalAddress ?? "",
                regNumber: footer?.regNumber ?? "",
                badgeMastercardUrl: footer?.badgeMastercardUrl ?? "",
                badgeVisaUrl: footer?.badgeVisaUrl ?? "",
                badgePciUrl: footer?.badgePciUrl ?? "",
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
