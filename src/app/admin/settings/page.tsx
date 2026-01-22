import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";
import { PageToast } from "@/components/PageToast";

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
  const setting = await db.websiteSetting.findUnique({ where: { id: "singleton" } });
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <p className="mt-2 text-sm text-zinc-400">Pengaturan umum website.</p>
        <section className="mt-6">
          <SettingsForm initial={{
            siteName: setting?.siteName ?? "Gamingqu",
            tagline: setting?.tagline ?? "",
            logoUrl: setting?.logoUrl ?? null,
            faviconUrl: setting?.faviconUrl ?? null,
            contactEmail: setting?.contactEmail ?? "",
            contactPhone: setting?.contactPhone ?? "",
          }} />
        </section>
      </div>
    </div>
  );
}
