import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const perms = await db.adminPermission.findMany({ orderBy: { key: "asc" } });
  const enabled = new Set(perms.filter((p) => p.enabled).map((p) => p.key));

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-zinc-400">Role: {role}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {enabled.has("users") && (
          <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Manajemen Users</h2>
            <p className="text-zinc-400 text-sm mt-2">Panel untuk melihat dan mengelola users.</p>
          </section>
        )}
        {enabled.has("boosters") && (
          <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Manajemen Boosters</h2>
            <p className="text-zinc-400 text-sm mt-2">Panel untuk daftar booster dan pengajuan.</p>
          </section>
        )}
        {enabled.has("orders") && (
          <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-zinc-400 text-sm mt-2">Panel pesanan dari member.</p>
          </section>
        )}
        {enabled.has("analytics") && (
          <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="text-zinc-400 text-sm mt-2">Statistik penjualan dan performa.</p>
          </section>
        )}
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        Akses panel admin diatur oleh Super Admin melalui izin.
      </p>
    </div>
  );
}
