import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { FiBarChart2, FiTrendingUp, FiDollarSign, FiShoppingCart } from "react-icons/fi";
import { db } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
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

  let totalRevenue = "$0";
  let totalOrders = 0;
  let avgOrderValue = "$0";
  let revenueSeries: Array<{ date: string; value: number }> = [];
  let ordersByGame: Array<{ label: string; count: number }> = [];
  let conversionRate = "0%";
  let netTrendText = "+0% vs yesterday";
  let netTrendUp = true;
  try {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 29);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const [revenueAgg, ordersCount, paidOrders, totalOrders30, netTodayAgg, netYesterdayAgg] = await Promise.all([
      db.order.aggregate({
        _sum: { items: true, boosterPay: true },
        where: { status: "PAID" },
      }),
      db.order.count({ where: { status: "PAID" } }),
      db.order.findMany({
        where: { status: "PAID", createdAt: { gte: start } },
        select: {
          createdAt: true,
          items: true,
          boosterPay: true,
          service: { select: { game: { select: { name: true } } } },
        },
        orderBy: [{ createdAt: "asc" }],
        take: 5000,
      }),
      db.order.count({ where: { createdAt: { gte: start } } }),
      db.order.aggregate({
        _sum: { items: true, boosterPay: true },
        where: { status: "PAID", createdAt: { gte: todayStart } },
      }),
      db.order.aggregate({
        _sum: { items: true, boosterPay: true },
        where: { status: "PAID", createdAt: { gte: yesterdayStart, lt: todayStart } },
      }),
    ]);
    const totalItems = Number.parseFloat(((revenueAgg._sum.items ?? 0) as unknown as { toString: () => string } | number).toString());
    const totalBooster = Number.parseFloat(((revenueAgg._sum.boosterPay ?? 0) as unknown as { toString: () => string } | number).toString());
    const total = totalItems - totalBooster;
    totalRevenue = `$${total.toFixed(2)}`;
    totalOrders = ordersCount;
    avgOrderValue = `$${(ordersCount > 0 ? total / ordersCount : 0).toFixed(2)}`;
    const paidCount30 = paidOrders.length;
    conversionRate = `${totalOrders30 > 0 ? Math.round((paidCount30 / totalOrders30) * 100) : 0}%`;
    const netToday = Number.parseFloat(((netTodayAgg._sum.items ?? 0) as unknown as { toString: () => string } | number).toString()) -
      Number.parseFloat(((netTodayAgg._sum.boosterPay ?? 0) as unknown as { toString: () => string } | number).toString());
    const netYesterday = Number.parseFloat(((netYesterdayAgg._sum.items ?? 0) as unknown as { toString: () => string } | number).toString()) -
      Number.parseFloat(((netYesterdayAgg._sum.boosterPay ?? 0) as unknown as { toString: () => string } | number).toString());
    const pct = (a: number, b: number) => {
      if (b === 0) return a > 0 ? 100 : 0;
      return Math.round(((a - b) / b) * 100);
    };
    const netPct = pct(netToday, netYesterday);
    netTrendText = `${netPct >= 0 ? "+" : ""}${netPct}% vs yesterday`;
    netTrendUp = netPct >= 0;
    const dayKeys = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    const dayMap = new Map<string, number>();
    for (const o of paidOrders) {
      const k = new Date(o.createdAt).toISOString().slice(0, 10);
      const itemsNum = Number.parseFloat((o.items as unknown as { toString: () => string } | number).toString());
      const boosterNum = Number.parseFloat((o.boosterPay as unknown as { toString: () => string } | number).toString());
      const v = itemsNum - boosterNum;
      dayMap.set(k, (dayMap.get(k) ?? 0) + v);
    }
    revenueSeries = dayKeys.map((k) => ({ date: k, value: dayMap.get(k) ?? 0 }));
    const gameMap = new Map<string, number>();
    for (const o of paidOrders) {
      const g = o.service?.game?.name ?? "Unknown";
      gameMap.set(g, (gameMap.get(g) ?? 0) + 1);
    }
    ordersByGame = Array.from(gameMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  } catch {
    // keep defaults
  }

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Sales and performance statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Net Profit</p>
                <p className="text-3xl font-bold text-white">{totalRevenue}</p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${netTrendUp ? "text-emerald-400" : "text-red-400"}`}>
                  <FiTrendingUp className={`h-4 w-4 ${!netTrendUp ? "rotate-180" : ""}`} />
                  {netTrendText}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FiDollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-white">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
                <FiShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Net Profit per Order</p>
                <p className="text-3xl font-bold text-white">{avgOrderValue}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <FiBarChart2 className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">{conversionRate}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center text-accent-400">
                <FiTrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Net Profit Overview</h3>
            <div className="h-56 bg-ink-900 rounded-xl border border-white/5 p-3">
              {revenueSeries.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiBarChart2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No data</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-end gap-1">
                    {(() => {
                      const max = Math.max(...revenueSeries.map((d) => d.value), 1);
                      return revenueSeries.map((d) => (
                        <div
                          key={d.date}
                          className="flex-1 bg-brand-500/40 hover:bg-brand-500/60 rounded-t-md"
                          style={{ height: `${Math.max(4, Math.round((d.value / max) * 100))}%` }}
                          title={`${d.date}: $${d.value.toFixed(2)}`}
                        />
                      ));
                    })()}
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500 flex justify-between">
                    <span>{revenueSeries[0]?.date}</span>
                    <span>{revenueSeries[revenueSeries.length - 1]?.date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Orders by Game</h3>
            <div className="h-56 bg-ink-900 rounded-xl border border-white/5 p-3">
              {ordersByGame.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiBarChart2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No data</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(() => {
                    const max = Math.max(...ordersByGame.map((d) => d.count), 1);
                    return ordersByGame.map((d) => (
                      <div key={d.label} className="flex items-center gap-3">
                        <div className="w-28 truncate text-xs text-gray-300">{d.label}</div>
                        <div className="flex-1 h-4 bg-white/5 rounded-md overflow-hidden">
                          <div
                            className="h-full bg-emerald-500/50"
                            style={{ width: `${Math.round((d.count / max) * 100)}%` }}
                            title={`${d.label}: ${d.count}`}
                          />
                        </div>
                        <div className="w-10 text-xs text-gray-300 text-right">{d.count}</div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
