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
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const sp = searchParams ? await searchParams : {};
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast ? (toast === "error" ? "Gagal menyimpan benner" : "Benner berhasil disimpan") : undefined;
  const items = await db.banner.findMany({
    select: { id: true, title: true, subtitle: true, buttonLink: true, buttonImageUrl: true, order: true, isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />
        <BennerManager items={items} canAdd={items.length < 10} />
      </div>
    </div>
  );
}
