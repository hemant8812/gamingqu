import { getServerSession } from "next-auth";
import Link from "next/link";
import { Fragment } from "react";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import {
  Home,
  ShoppingCart,
  User,
  Wallet,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  Shield,
  Eye,
  Search as SearchIcon,
} from "lucide-react";

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

function StatusBadge({ status }: { status: "In Progress" | "Completed" | "Pending" | "Cancelled" }) {
  const cls =
    status === "Completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "Pending"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "Cancelled"
      ? "bg-red-500/20 text-red-400"
      : "bg-blue-500/20 text-blue-400";
  const Icon =
    status === "Completed" ? CheckCircle : status === "Pending" ? Clock : status === "Cancelled" ? Shield : Shield;
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-lg ${cls}`}>
      <Icon className="h-4 w-4" />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: "CREATED" | "PENDING" | "PAID" | "CANCELED" | "FAILED" }) {
  const cls =
    status === "PAID"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "PENDING" || status === "CREATED"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "CANCELED" || status === "FAILED"
      ? "bg-red-500/20 text-red-400"
      : "bg-blue-500/20 text-blue-400";
  const Icon =
    status === "PAID" ? CheckCircle : status === "PENDING" || status === "CREATED" ? Clock : Shield;
  const label =
    status === "PAID"
      ? "Paid"
      : status === "PENDING"
      ? "Pending"
      : status === "CREATED"
      ? "Created"
      : status === "CANCELED"
      ? "Canceled"
      : "Failed";
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-lg ${cls}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

function FulfillmentBadge({ status }: { status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" }) {
  const cls =
    status === "COMPLETED"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "PENDING"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "CANCELED"
      ? "bg-red-500/20 text-red-400"
      : "bg-blue-500/20 text-blue-400";
  const Icon =
    status === "COMPLETED" ? CheckCircle : status === "PENDING" ? Clock : Shield;
  const label =
    status === "COMPLETED"
      ? "Completed"
      : status === "PENDING"
      ? "Pending"
      : status === "ACCEPTED"
      ? "Accepted"
      : status === "IN_PROGRESS"
      ? "In Progress"
      : "Canceled";
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-lg ${cls}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

export default async function MyOrdersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view your orders.</p>
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
  const sp = searchParams ? await searchParams : {};
  const orderParam = sp?.order;
  const orderCodeFilter = typeof orderParam === "string" ? orderParam : Array.isArray(orderParam) ? orderParam[0] ?? undefined : undefined;
  const filterParam = sp?.filter;
  const filterUpper = typeof filterParam === "string" ? filterParam.toUpperCase() : "ALL";
  const qParam = sp?.q;
  const q = typeof qParam === "string" ? qParam.trim() : "";
  const list = await db.order.findMany({
    where: { userId: session.user.id },
    select: {
      code: true,
      serviceSlug: true,
      amount: true,
      items: true,
      fee: true,
      boosterPay: true,
      status: true,
      fulfillmentStatus: true,
      methodSlug: true,
      contactEmail: true,
      contactDiscord: true,
      characterName: true,
      payload: true,
      createdAt: true,
      service: { select: { name: true, game: { select: { name: true } } } },
    },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });
  const selected = orderCodeFilter ? list.find((o) => o.code === orderCodeFilter) : undefined;
  const rows = list.map((o) => {
    const status =
      o.fulfillmentStatus === "COMPLETED"
        ? "Completed"
        : o.fulfillmentStatus === "IN_PROGRESS"
        ? "In Progress"
        : o.fulfillmentStatus === "ACCEPTED"
        ? "In Progress"
        : o.fulfillmentStatus === "CANCELED" || o.status === "CANCELED" || o.status === "FAILED"
        ? "Cancelled"
        : "Pending";
    const percent =
      o.fulfillmentStatus === "COMPLETED"
        ? 100
        : o.fulfillmentStatus === "IN_PROGRESS"
        ? 60
        : o.fulfillmentStatus === "ACCEPTED"
        ? 10
        : 0;
    const price = `$${Number.parseFloat(o.items.toString()).toFixed(2)}`;
    const title = o.service?.name ?? o.serviceSlug;
    const game = o.service?.game?.name ?? "";
    return { id: o.code, title, game, status, percent, price, fulfillment: o.fulfillmentStatus };
  });
  let filteredRows = rows;
  if (filterUpper === "IN_PROGRESS") {
    filteredRows = rows.filter(
      (o) => o.fulfillment === "PENDING" || o.fulfillment === "ACCEPTED" || o.fulfillment === "IN_PROGRESS"
    );
  } else if (filterUpper === "COMPLETED") {
    filteredRows = rows.filter((o) => o.fulfillment === "COMPLETED");
  } else if (filterUpper === "CANCELED") {
    filteredRows = rows.filter((o) => o.fulfillment === "CANCELED");
  }
  if (q) {
    const ql = q.toLowerCase();
    filteredRows = filteredRows.filter(
      (o) =>
        o.id.toLowerCase().includes(ql) ||
        (o.title ?? "").toLowerCase().includes(ql) ||
        (o.game ?? "").toLowerCase().includes(ql)
    );
  }
  const currentFilter = (filterUpper ?? "ALL") as "ALL" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  const tabCls = (name: "ALL" | "IN_PROGRESS" | "COMPLETED" | "CANCELED") =>
    currentFilter === name
      ? "h-9 px-4 inline-flex items-center justify-center rounded-xl text-sm bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-white border border-white/10 shadow-lg shadow-black/20 ring-1 ring-white/10"
      : "h-9 px-4 inline-flex items-center justify-center rounded-xl text-sm bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10";
  const hrefFor = (name: "ALL" | "IN_PROGRESS" | "COMPLETED" | "CANCELED") => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (orderCodeFilter) params.set("order", orderCodeFilter);
    if (name !== "ALL") params.set("filter", name);
    return `/dashboard/orders?${params.toString()}`;
  };
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="lg:block">
            <nav className="bg-[#0F172A] border border-white/10 rounded-2xl p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
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
          </aside>
          <main>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">My Orders</h1>
              <Link href="/" className="btn btn-gaming btn-sm">New Order</Link>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <form action="/dashboard/orders" method="get" className="relative w-80 max-w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    name="q"
                    defaultValue={q}
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-9 pr-3 h-10 bg-[#0A0E17] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  {currentFilter !== "ALL" ? <input type="hidden" name="filter" value={currentFilter} /> : null}
                  {orderCodeFilter ? <input type="hidden" name="order" value={orderCodeFilter} /> : null}
                </form>
                <div className="flex items-center gap-2">
                  <Link href={hrefFor("ALL")} className={tabCls("ALL")} aria-pressed={currentFilter === "ALL"}>
                    All
                  </Link>
                  <Link href={hrefFor("IN_PROGRESS")} className={tabCls("IN_PROGRESS")} aria-pressed={currentFilter === "IN_PROGRESS"}>
                    In progress
                  </Link>
                  <Link href={hrefFor("COMPLETED")} className={tabCls("COMPLETED")} aria-pressed={currentFilter === "COMPLETED"}>
                    Completed
                  </Link>
                  <Link href={hrefFor("CANCELED")} className={tabCls("CANCELED")} aria-pressed={currentFilter === "CANCELED"}>
                    Canceled
                  </Link>
                </div>
              </div>
              <div className="px-4 py-2">
                <div className="hidden md:grid md:grid-cols-[240px_140px_200px_120px_120px] gap-3 px-3 py-2 text-xs text-gray-400">
                  <span>ORDER</span>
                  <span>STATUS ORDER</span>
                  <span>PROGRESS</span>
                  <span>PRICE</span>
                  <span>ACTIONS</span>
                </div>
                <div className="divide-y divide-white/5">
                  {filteredRows.length === 0 ? (
                    <div className="px-6 py-14 flex flex-col items-center justify-center text-center">
                      {currentFilter === "COMPLETED" ? (
                        <CheckCircle className="h-10 w-10 text-emerald-400 mb-3" />
                      ) : currentFilter === "CANCELED" ? (
                        <Shield className="h-10 w-10 text-red-400 mb-3" />
                      ) : currentFilter === "IN_PROGRESS" ? (
                        <Clock className="h-10 w-10 text-yellow-400 mb-3" />
                      ) : (
                        <ShoppingCart className="h-10 w-10 text-blue-400 mb-3" />
                      )}
                      <div className="text-sm text-gray-400">
                        {currentFilter === "COMPLETED"
                          ? "No completed orders yet"
                          : currentFilter === "CANCELED"
                          ? "No canceled orders yet"
                          : currentFilter === "IN_PROGRESS"
                          ? "No active orders yet"
                          : "You don't have any orders yet"}
                      </div>
                    </div>
                  ) : (
                    filteredRows.map((o) => (
                      <div key={o.id} className="px-3 py-3 hover:bg-white/[0.03]">
                        <div className="grid grid-cols-1 md:grid-cols-[240px_140px_200px_120px_120px] gap-3 items-center">
                          <div>
                            <div className="text-xs text-gray-400">{o.id}</div>
                            <div className="mt-1">
                              <div className="text-[11px] text-gray-500 uppercase tracking-wide">Service</div>
                              <div className="text-white font-medium leading-tight">{o.title}</div>
                              {o.game && <div className="text-xs text-gray-500">{o.game}</div>}
                            </div>
                          </div>
                          <div>
                            <StatusBadge status={o.status} />
                          </div>
                          <div>
                            {o.status === "In Progress" || o.status === "Completed" ? (
                              <>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${o.percent}%` }} />
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{o.percent}%</div>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">-</span>
                            )}
                          </div>
                          <div className="text-emerald-400 font-semibold">{o.price}</div>
                          <div className="flex items-center gap-2">
                            {selected?.code === o.id ? (
                              <Link href="/dashboard/orders" className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm flex items-center justify-center" aria-label={`Close ${o.id}`}>
                                Close
                              </Link>
                            ) : (
                              <Link href={`/dashboard/orders?order=${encodeURIComponent(o.id)}`} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-300" aria-label={`View ${o.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                        {selected?.code === o.id && (
                          <div className="mt-3 rounded-2xl border border-white/10 bg-[#0F172A] p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Order Status</div>
                                  <div className="text-sm text-white"><FulfillmentBadge status={selected.fulfillmentStatus as "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"} /></div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Payment Status</div>
                                  <div className="text-sm text-white"><PaymentBadge status={selected.status as "CREATED" | "PENDING" | "PAID" | "CANCELED" | "FAILED"} /></div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Email</div>
                                  <div className="text-sm text-white">{selected.contactEmail ?? "-"}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Discord</div>
                                  <div className="text-sm text-white">{selected.contactDiscord ?? "-"}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Character</div>
                                  <div className="text-sm text-white">{selected.characterName ?? "-"}</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Payment Method</div>
                                  <div className="text-sm text-white">{selected.methodSlug.toUpperCase()}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Items</div>
                                  <div className="text-sm text-white">${Number.parseFloat(selected.items.toString()).toFixed(2)}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Fee</div>
                                  <div className="text-sm text-white">${Number.parseFloat(selected.fee.toString()).toFixed(2)}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Total</div>
                                  <div className="text-sm text-emerald-400 font-semibold">${Number.parseFloat(selected.amount.toString()).toFixed(2)}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Created At</div>
                                  <div className="text-sm text-white">{formatDateTimeEnglish(new Date(selected.createdAt))}</div>
                                </div>
                              </div>
                              <div className="rounded-xl bg-[#0A0E17] border border-white/10 p-4">
                                {(() => {
                                  const p = selected.payload as unknown as {
                                    range?: { from?: number; to?: number };
                                    selectedOptions?: Array<{ title: string; values: string[] }>;
                                  };
                                  const rows: Array<{ label: string; value: string }> = [];
                                  const range = p?.range;
                                  if (range && (range.from != null || range.to != null)) {
                                    const from = range.from != null ? String(range.from) : "-";
                                    const to = range.to != null ? String(range.to) : "-";
                                    rows.push({ label: "Level", value: `${from}–${to}` });
                                  }
                                  const opts: Array<{ title: string; values: string[] }> = Array.isArray(p?.selectedOptions) ? p.selectedOptions : [];
                                  for (const opt of opts) {
                                    const v = Array.isArray(opt.values) ? opt.values.join(", ") : "-";
                                    rows.push({ label: opt.title, value: v });
                                  }
                                  if (rows.length === 0) {
                                    return <div className="text-sm text-gray-400">No extra options</div>;
                                  }
                                  return (
                                    <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2">
                                      {rows.map((r, i) => (
                                        <Fragment key={i}>
                                          <div className="text-xs text-gray-500">{r.label}</div>
                                          <div className="text-sm text-white font-medium text-right">{r.value}</div>
                                        </Fragment>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
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
