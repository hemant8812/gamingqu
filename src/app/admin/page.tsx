import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
  }
  let enabled = new Set<string>();
  try {
    const perms = await db.adminPermission.findMany({ orderBy: { key: "asc" } });
    enabled = new Set(perms.filter((p) => p.enabled).map((p) => p.key));
  } catch {
    enabled = new Set();
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm opacity-70">Kelola Users, Boosters, Orders, Analytics; Permissions untuk Super Admin.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {enabled.has("users") && (
            <section className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h2 className="card-title">Manajemen Users</h2>
                <p className="text-sm opacity-70">Panel untuk melihat dan mengelola users.</p>
              </div>
            </section>
          )}
          {enabled.has("boosters") && (
            <section className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h2 className="card-title">Manajemen Boosters</h2>
                <p className="text-sm opacity-70">Panel untuk daftar booster dan pengajuan.</p>
              </div>
            </section>
          )}
          {enabled.has("orders") && (
            <section className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h2 className="card-title">Orders</h2>
                <p className="text-sm opacity-70">Panel pesanan dari member.</p>
              </div>
            </section>
          )}
          {enabled.has("analytics") && (
            <section className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h2 className="card-title">Analytics</h2>
                <p className="text-sm opacity-70">Statistik penjualan dan performa.</p>
              </div>
            </section>
          )}
        </div>
        <p className="mt-8 text-sm opacity-50">
          Akses panel admin diatur oleh Super Admin melalui izin.
        </p>
      </div>
    </div>
  );
}
