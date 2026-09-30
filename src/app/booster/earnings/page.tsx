import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { FiLock } from "react-icons/fi";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { DollarSign, TrendingUp, Wallet, ArrowLeft } from "lucide-react";
import { db } from "@/lib/prisma";
import { EarningsTabs } from "@/components/booster/EarningsTabs";

export const metadata = {
  title: "Booster Earnings",
};

export default async function BoosterEarningsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isBooster = role === "BOOSTER";

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-4">
            <FiLock className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view your earnings.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!isBooster) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  let available = 0;
  let total = 0;
  let month = 0;
  let pending = 0;
  let walletCurrency = "USD";
  let creditsList: Array<{ id: number; amount: number; createdAt: Date; description?: string | null; orderCode?: string | null }> = [];
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true, balance: true, currency: true },
    });
    available = wallet ? Number.parseFloat(wallet.balance.toString()) : 0;
    walletCurrency = wallet?.currency ?? "USD";
    const walletId = wallet?.id ?? null;
    if (walletId) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const credits = await db.walletTransaction.findMany({
        where: { walletId, type: "CREDIT" },
        select: { id: true, amount: true, createdAt: true, description: true, order: { select: { code: true } } },
        orderBy: { createdAt: "desc" },
        take: 1000,
      });
      total = credits.reduce((s, t) => s + Number.parseFloat(t.amount.toString()), 0);
      month = credits.filter((t) => t.createdAt >= startOfMonth).reduce((s, t) => s + Number.parseFloat(t.amount.toString()), 0);
      creditsList = credits.slice(0, 100).map((t) => ({ id: t.id, amount: Number.parseFloat(t.amount.toString()), createdAt: t.createdAt, description: t.description ?? null, orderCode: t.order?.code ?? null }));
    }
    const agg = await db.boosterWithdrawal.aggregate({
      where: { userId: session.user.id, status: { in: ["PENDING", "PROCESSING"] } },
      _sum: { amount: true },
    });
    pending = Number.parseFloat((agg._sum.amount ?? 0).toString());
  } catch {}
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  const summary = {
    total: money.format(total),
    month: money.format(month),
    pending: money.format(pending),
    available: `$${Number.parseFloat((available ?? 0).toString()).toFixed(2)}`,
  };

  const withdrawals = await db.boosterWithdrawal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      createdAt: true,
      account: { select: { providerName: true, type: true } },
    },
  });

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="earnings" />
          </aside>
          <main>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">Earnings</h1>
                <div className="text-sm text-gray-400">Track payouts and your booster revenue</div>
              </div>
              <Link href="/booster" className="btn btn-gaming btn-sm !rounded-md inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Overview</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-white">{summary.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-white">{summary.month}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 ring-1 ring-brand-500/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-white">{summary.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/20">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <EarningsTabs availableBalance={summary.available} withdrawals={withdrawals.map((w) => ({ id: w.id, amount: Number.parseFloat(w.amount.toString()), currency: w.currency, status: w.status, createdAt: w.createdAt, account: { providerName: w.account?.providerName ?? "", type: w.account?.type ?? "BANK" } }))} credits={creditsList} walletCurrency={walletCurrency} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
