import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  let enabled = new Set<string>();
  try {
    const perms = await db.adminPermission.findMany({ orderBy: { key: "asc" } });
    enabled = new Set(perms.filter((p) => p.enabled).map((p) => p.key));
  } catch {
    enabled = new Set();
  }

  // Fetch stats for dashboard
  let stats = {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: "$0",
    totalGames: 0,
  };

  try {
    const [userCount, gameCount] = await Promise.all([
      db.user.count(),
      db.game.count(),
    ]);
    stats = {
      totalUsers: userCount,
      totalOrders: 0,
      totalRevenue: "$0",
      totalGames: gameCount,
    };
  } catch {
    // Keep default stats
  }

  return <AdminDashboardClient enabled={enabled} stats={stats} />;
}
