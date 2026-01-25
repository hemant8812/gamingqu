import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getFooterSettings, getWebsiteSettingCore } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { PageToast } from "@/components/shared/PageToast";
import { EmbedSettings } from "@/components/admin/settings/EmbedSettings";
import { Settings as SettingsIcon, Code2 as CodeIcon, Layout as LayoutIcon } from "lucide-react";
import { FooterSettingsForm } from "@/components/admin/settings/FooterSettingsForm";
import { parseToast } from "@/lib/page-utils";
import { AdminSettingsTabs } from "@/components/admin/settings/AdminSettingsTabs";

export default async function AdminSettingsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast ? (toast === "error" ? "Terjadi kesalahan saat menyimpan pengaturan" : "Pengaturan berhasil disimpan") : undefined;
  const tabParam = sp?.tab;
  const tab = typeof tabParam === "string" ? tabParam : Array.isArray(tabParam) ? tabParam[0] ?? undefined : undefined;
  const setting = await getWebsiteSettingCore();
  const footer = await getFooterSettings();
  
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <p className="mt-2 text-sm opacity-70">Pengaturan umum dan embed kode.</p>
        <section className="mt-6">
            <AdminSettingsTabs 
                initialTab={tab}
                setting={setting}
                footer={footer}
            />
        </section>
      </div>
    </div>
  );
}
