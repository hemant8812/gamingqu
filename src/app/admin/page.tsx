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
  type DashboardStats = {
    totalUsers: 0 | number;
    totalOrders: 0 | number;
    totalRevenue: string;
    totalGames: 0 | number;
    usersTrendText?: string;
    usersTrendUp?: boolean;
    ordersTrendText?: string;
    ordersTrendUp?: boolean;
    revenueTrendText?: string;
    revenueTrendUp?: boolean;
  };
  let stats: DashboardStats = {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: "$0",
    totalGames: 0,
  };

  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const [userCount, gameCount, ordersCount, revenueAgg, usersToday, usersYesterday, ordersToday, ordersYesterday, revenueTodayAgg, revenueYesterdayAgg] = await Promise.all([
      db.user.count(),
      db.game.count(),
      db.order.count(),
      db.order.aggregate({
        _sum: { items: true },
        where: { status: "PAID" },
      }),
      db.user.count({ where: { createdAt: { gte: todayStart } } }),
      db.user.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
      db.order.count({ where: { createdAt: { gte: todayStart } } }),
      db.order.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
      db.order.aggregate({
        _sum: { items: true },
        where: { status: "PAID", createdAt: { gte: todayStart } },
      }),
      db.order.aggregate({
        _sum: { items: true },
        where: { status: "PAID", createdAt: { gte: yesterdayStart, lt: todayStart } },
      }),
    ]);
    const pct = (a: number, b: number) => {
      if (b === 0) return a > 0 ? 100 : 0;
      return Math.round(((a - b) / b) * 100);
    };
    const usersPct = pct(usersToday, usersYesterday);
    const ordersPct = pct(ordersToday, ordersYesterday);
    const revToday = Number.parseFloat(((revenueTodayAgg._sum.items ?? 0) as unknown as { toString: () => string } | number).toString());
    const revYesterday = Number.parseFloat(((revenueYesterdayAgg._sum.items ?? 0) as unknown as { toString: () => string } | number).toString());
    const revenuePct = pct(revToday, revYesterday);
    stats = {
      totalUsers: userCount,
      totalOrders: ordersCount,
      totalRevenue: `$${Number.parseFloat(((revenueAgg._sum.items ?? 0) as unknown as { toString: () => string } | number).toString()).toFixed(2)}`,
      totalGames: gameCount,
      usersTrendText: `${usersPct >= 0 ? "+" : ""}${usersPct}% vs yesterday`,
      usersTrendUp: usersPct >= 0,
      ordersTrendText: `${ordersPct >= 0 ? "+" : ""}${ordersPct}% vs yesterday`,
      ordersTrendUp: ordersPct >= 0,
      revenueTrendText: `${revenuePct >= 0 ? "+" : ""}${revenuePct}% vs yesterday`,
      revenueTrendUp: revenuePct >= 0,
    };
  } catch {
    // Keep default stats
  }

  return <AdminDashboardClient enabled={enabled} isSuperAdmin={role === "SUPERADMIN"} stats={stats} />;
}
