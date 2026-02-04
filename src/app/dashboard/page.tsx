import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { Home, ShoppingCart, User, Wallet, Star, MessageSquare, Settings, LogOut, Activity, CheckCircle, Shield, ChevronRight, Eye, Clock, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { FiLock } from "react-icons/fi";
import { db } from "@/lib/prisma";
import { MemberSidebar } from "@/components/dashboard/MemberSidebar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-4">
            <FiLock className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to access your dashboard.</p>
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
  const name = session.user?.name ?? session.user?.username ?? "Member";
  let stats = { active: 0, completed: 0, wallet: "$0.00", reviews: 0 };
  let recentTxs: Array<{ id: number; type: "CREDIT" | "DEBIT"; amount: string; createdAt: Date; orderCode?: string | null; description?: string | null }> = [];
  let recentReviews: Array<{ id: number; rating: number; title?: string | null; comment?: string | null; isPublished: boolean; createdAt: Date; serviceName?: string | null; gameName?: string | null; orderCode?: string | null }> = [];
  try {
    const [activeCount, completedCount] = await Promise.all([
      db.order.count({ where: { userId: session.user.id, fulfillmentStatus: { in: ["PENDING", "ACCEPTED", "IN_PROGRESS"] } } }),
      db.order.count({ where: { userId: session.user.id, fulfillmentStatus: "COMPLETED" } }),
    ]);
    const wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true, balance: true, currency: true },
    });
    const reviewsCount = await db.review.count({ where: { userId: session.user.id, isPublished: true } });
    if (wallet?.id) {
      const txs = await db.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, type: true, amount: true, createdAt: true, description: true, order: { select: { code: true } } },
      });
      recentTxs = txs.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount.toString(),
        createdAt: t.createdAt,
        orderCode: t.order?.code ?? null,
        description: t.description ?? null,
      }));
    }
    const revs = await db.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        isPublished: true,
        createdAt: true,
        service: { select: { name: true, game: { select: { name: true } } } },
        order: { select: { code: true } },
      },
    });
    recentReviews = revs.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title ?? null,
      comment: r.comment ?? null,
      isPublished: r.isPublished,
      createdAt: r.createdAt,
      serviceName: r.service?.name ?? null,
      gameName: r.service?.game?.name ?? null,
      orderCode: r.order?.code ?? null,
    }));
    stats = {
      active: activeCount,
      completed: completedCount,
      wallet: `$${Number.parseFloat((wallet?.balance ?? 0).toString()).toFixed(2)}`,
      reviews: reviewsCount,
    };
  } catch {
    // keep defaults
  }
  const orders = [
    { id: "ORD-001", title: "Diamond Boost", game: "League of Legends", booster: "ProPlayer123", price: "$99.99", status: "In Progress", percent: 65 },
    { id: "ORD-002", title: "Mythic +15 Carry", game: "World of Warcraft", booster: null, price: "$29.99", status: "Completed", percent: 100 },
    { id: "ORD-003", title: "Immortal to Radiant", game: "Valorant", booster: null, price: "$79.99", status: "Pending", percent: 0 },
  ];
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="lg:hidden mb-4">
          <details className="rounded-2xl border border-white/10 bg-[#0F172A]">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
              <span className="flex items-center gap-3 text-white">
                <Home className="h-4 w-4" />
                <span>Menu Dashboard</span>
              </span>
              <ChevronRight className="h-4 w-4" />
            </summary>
            <nav className="p-3">
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/wallet" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/reviews" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Star className="h-4 w-4" />
                    <span>Reviews</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
              <div className="border-t border-white/10 mt-4 pt-4">
                <button type="button" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </details>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-8 self-start">
            <MemberSidebar active="overview" />
          </aside>
          <main>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {String(name)}!</h1>
                <p className="text-gray-400">Here&apos;s what&apos;s happening with your orders</p>
              </div>
              <Link href="/" className="btn btn-gaming btn-sm">Browse Services</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-white">{stats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Wallet Balance</p>
                  <p className="text-3xl font-bold text-white">{stats.wallet}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/20">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Reviews Given</p>
                  <p className="text-3xl font-bold text-white">{stats.reviews}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 ring-1 ring-pink-500/20">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Active Orders</h3>
                  <Link href="/dashboard/orders" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300" aria-label="View all">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="p-4 md:p-6 space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-2xl border border-white/10 bg-[#0A0E17] p-4 md:p-5 transition-colors hover:bg-white/[0.04]">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="text-xs text-gray-500">{o.id}</div>
                          <div className="text-white font-semibold">{o.title}</div>
                          <div className="text-sm text-gray-500">{o.game}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-xl ring-1 ring-white/10 ${
                            o.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" :
                            o.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/20 text-blue-400"
                          }`}>
                            {o.status === "Completed" ? <CheckCircle className="h-4 w-4" /> : o.status === "Pending" ? <Clock className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                            {o.status}
                          </span>
                          <button type="button" className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5" aria-label={`View details ${o.id}`}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${o.percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{o.percent}%</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-400">Booster: </span>
                          <span className="text-white">{o.booster ?? "-"}</span>
                        </div>
                        <div className="text-emerald-400 font-semibold">{o.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Recent Wallet Transactions</h3>
                  <Link href="/dashboard/wallet" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300" aria-label="View wallet">
                    View Wallet <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="px-4 py-2">
                  <div className="hidden md:grid md:grid-cols-[220px_120px_160px_1fr] gap-3 px-3 py-2 text-xs text-gray-400">
                    <span>DATE</span>
                    <span>TYPE</span>
                    <span>AMOUNT</span>
                    <span>DETAILS</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {recentTxs.length === 0 ? (
                      <div className="px-6 py-10 text-center text-sm text-gray-400">No wallet transactions yet</div>
                    ) : (
                      recentTxs.map((t) => {
                        const isCredit = t.type === "CREDIT";
                        const Icon = isCredit ? ArrowUpCircle : ArrowDownCircle;
                        const iconCls = isCredit ? "text-emerald-400" : "text-red-400";
                        const amountNum = Number.parseFloat(t.amount);
                        const amountStr = `${isCredit ? "+" : "-"}$${Math.abs(amountNum).toFixed(2)}`;
                        return (
                          <div key={t.id} className="px-3 py-3 hover:bg-white/[0.03]">
                            <div className="grid grid-cols-1 md:grid-cols-[220px_120px_160px_1fr] gap-3 items-center">
                              <div className="text-sm text-white">{new Date(t.createdAt).toLocaleString("en-GB", { hour12: false })}</div>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${iconCls}`} />
                                <span className={isCredit ? "text-emerald-400 text-sm font-medium" : "text-red-400 text-sm font-medium"}>
                                  {isCredit ? "Credit" : "Debit"}
                                </span>
                              </div>
                              <div className={isCredit ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>{amountStr}</div>
                              <div className="text-sm text-gray-300">
                                {t.orderCode ? (
                                  <Link href={`/dashboard/orders?order=${encodeURIComponent(t.orderCode)}`} className="text-blue-400 hover:text-blue-300">
                                    Linked to order {t.orderCode}
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
              </section>
              <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Your Reviews</h3>
                  <Link href="/dashboard/reviews" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300" aria-label="View reviews">
                    View Reviews <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="px-4 py-2">
                  <div className="hidden md:grid md:grid-cols-[220px_160px_1fr_160px] gap-3 px-3 py-2 text-xs text-gray-400">
                    <span>DATE</span>
                    <span>RATING</span>
                    <span>DETAILS</span>
                    <span>STATUS</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {recentReviews.length === 0 ? (
                      <div className="px-6 py-10 text-center text-sm text-gray-400">You haven&apos;t written any reviews yet</div>
                    ) : (
                      recentReviews.map((r) => {
                        return (
                          <div key={r.id} className="px-3 py-3 hover:bg-white/[0.03]">
                            <div className="grid grid-cols-1 md:grid-cols-[220px_160px_1fr_160px] gap-3 items-center">
                              <div className="text-sm text-white">{new Date(r.createdAt).toLocaleString("en-GB", { hour12: false })}</div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "text-yellow-400" : "text-gray-600"}`} />
                                ))}
                              </div>
                              <div className="text-sm">
                                <div className="text-white font-medium">{r.title ?? r.serviceName ?? "Unknown service"}</div>
                                <div className="text-xs text-gray-500">{r.gameName ?? ""}</div>
                                {r.orderCode ? (
                                  <div className="text-xs mt-1">
                                    <Link href={`/dashboard/orders?order=${encodeURIComponent(r.orderCode)}`} className="text-blue-400 hover:text-blue-300">View order</Link>
                                  </div>
                                ) : null}
                                {r.comment ? <div className="text-gray-300 mt-1">{r.comment}</div> : null}
                              </div>
                              <div className={r.isPublished ? "text-emerald-400 text-sm font-semibold" : "text-yellow-400 text-sm font-semibold"}>
                                {r.isPublished ? "Published" : "Draft"}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
