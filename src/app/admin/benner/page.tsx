import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PageToast } from "@/components/shared/PageToast";
import { BennerManager } from "@/components/admin/banner/BennerManager";
import { db } from "@/lib/prisma";
import { parseToast } from "@/lib/page-utils";

export default async function AdminBennerPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }
  const sp = searchParams ? await searchParams : {};
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast ? (toast === "error" ? "Failed to save banner" : "Banner saved successfully") : undefined;
  const items = await db.banner.findMany({
    select: { id: true, title: true, subtitle: true, buttonLink: true, buttonImageUrl: true, order: true, isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <BennerManager items={items} canAdd={items.length < 10} />
      </div>
    </div>
  );
}
