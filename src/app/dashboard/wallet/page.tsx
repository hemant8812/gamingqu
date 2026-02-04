import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { MemberSidebar } from "@/components/dashboard/MemberSidebar";
import React from "react";

function formatDateTimeEnglish(d: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
}

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to access your wallet.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }
  if (!isMember) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for members only.</p>
        </div>
      </div>
    );
  }
  const wallet = await db.wallet.findUnique({
    where: { userId: session.user.id },
    select: { id: true, balance: true, currency: true, isActive: true, createdAt: true },
  });
  const walletId = wallet?.id ?? null;
  const txs = walletId
    ? await db.walletTransaction.findMany({
        where: { walletId },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: { id: true, type: true, amount: true, description: true, orderId: true, createdAt: true, order: { select: { code: true } } },
      })
    : [];
  const balanceStr = `$${Number.parseFloat((wallet?.balance ?? 0).toString()).toFixed(2)}`;
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="lg:block">
            <MemberSidebar active="wallet" />
          </aside>
          <main>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Wallet</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-white">{balanceStr}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/20">
                  <WalletIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Currency</p>
                  <p className="text-3xl font-bold text-white">{wallet?.currency ?? "USD"}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                  <ArrowDownCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="text-3xl font-bold text-white">{wallet?.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                  <ArrowUpCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Wallet Transactions</h2>
              </div>
              <div className="px-4 py-2">
                <div className="hidden md:grid md:grid-cols-[220px_120px_160px_1fr] gap-3 px-3 py-2 text-xs text-gray-400">
                  <span>DATE</span>
                  <span>TYPE</span>
                  <span>AMOUNT</span>
                  <span>DETAILS</span>
                </div>
                <div className="divide-y divide-white/5">
                  {txs.length === 0 ? (
                    <div className="px-6 py-14 flex flex-col items-center justify-center text-center">
                      <WalletIcon className="h-10 w-10 text-purple-400 mb-3" />
                      <div className="text-sm text-gray-400">No wallet transactions yet</div>
                    </div>
                  ) : (
                    txs.map((t) => {
                      const amount = Number.parseFloat(t.amount.toString());
                      const isCredit = t.type === "CREDIT";
                      const iconCls = isCredit ? "text-emerald-400" : "text-red-400";
                      const Icon = isCredit ? ArrowUpCircle : ArrowDownCircle;
                      const amountStr = `${isCredit ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;
                      return (
                        <div key={t.id} className="px-3 py-3 hover:bg-white/[0.03]">
                          <div className="grid grid-cols-1 md:grid-cols-[220px_120px_160px_1fr] gap-3 items-center">
                            <div className="text-sm text-white">{formatDateTimeEnglish(new Date(t.createdAt))}</div>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${iconCls}`} />
                              <span className={isCredit ? "text-emerald-400 text-sm font-medium" : "text-red-400 text-sm font-medium"}>
                                {isCredit ? "Credit" : "Debit"}
                              </span>
                            </div>
                            <div className={isCredit ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>{amountStr}</div>
                            <div className="text-sm text-gray-300">
                              {t.order?.code ? (
                                <Link href={`/dashboard/orders?order=${encodeURIComponent(t.order.code)}`} className="text-blue-400 hover:text-blue-300">
                                  Linked to order {t.order.code}
                                </Link>
                              ) : (
                                <span>{t.description ?? "-"}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
