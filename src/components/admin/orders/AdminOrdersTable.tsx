"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { Eye, Shield } from "lucide-react";
import { useCallback } from "react";
import { PaymentBadge, FulfillmentBadge } from "@/components/shared/StatusBadge";
import { PaginationNumbers } from "@/components/shared/PaginationNumbers";
import { formatDateTimeID } from "@/lib/datetime";

type OrderItem = {
  code: string;
  user?: { id: string; username: string | null } | null;
  booster?: string | null;
  service?: { name: string | null; game?: { name: string | null } | null } | null;
  methodSlug: string;
  status: "CREATED" | "PENDING" | "PAID" | "CANCELED" | "FAILED";
  fulfillmentStatus: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "WAITING_CONFIRM" | "COMPLETED" | "CANCELED";
  items: unknown;
  fee: unknown;
  amount: unknown;
  currency: string;
  contactEmail?: string | null;
  contactDiscord?: string | null;
  characterName?: string | null;
  createdAt: string | Date;
};

export function AdminOrdersTable({ orders, page = 1, totalPages = 1 }: { orders: OrderItem[]; page?: number; totalPages?: number }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return orders;
    const ql = q.toLowerCase();
    return orders.filter((o) => {
      const code = o.code.toLowerCase();
      const user = (o.user?.username ?? "").toLowerCase();
      const uid = (o.user?.id ?? "").toLowerCase();
      const svc = (o.service?.name ?? "").toLowerCase();
      const game = (o.service?.game?.name ?? "").toLowerCase();
      const method = (o.methodSlug ?? "").toLowerCase();
      return (
        code.includes(ql) ||
        user.includes(ql) ||
        uid.includes(ql) ||
        svc.includes(ql) ||
        game.includes(ql) ||
        method.includes(ql)
      );
    });
  }, [orders, q]);

  const onExport = useCallback(() => {
    const url = q ? `/api/admin/orders/export?q=${encodeURIComponent(q)}` : `/api/admin/orders/export`;
    window.location.href = url;
  }, [q]);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            aria-label="Search orders"
            placeholder="Search orders..."
            className="w-full pl-12 pr-4 h-12 bg-ink-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-colors"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button
          onClick={onExport}
          className="h-12 px-6 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors"
        >
          <FiDownload className="h-5 w-5" />
          Export
        </button>
      </div>
      <div className="bg-ink-800 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            {totalPages > 1 && <PaginationNumbers page={page} totalPages={totalPages} basePath={"/admin/orders"} />}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500">
            <Shield className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg">No matching orders</p>
            <p className="text-sm">Try another search keyword</p>
          </div>
        ) : (
          <div className="px-4 py-4">
            <div className="hidden md:grid md:grid-cols-[180px_160px_220px_140px_140px_120px_120px] gap-3 px-3 py-2 text-xs text-gray-400">
              <span>ORDER</span>
              <span>USER</span>
              <span>SERVICE</span>
              <span>PAYMENT</span>
              <span>FULFILLMENT</span>
              <span>ITEMS</span>
              <span>TOTAL</span>
            </div>
            <div className="divide-y divide-white/5">
              {filtered.map((o) => (
                <div key={o.code} className="px-3 py-3 hover:bg-white/[0.03]">
                  <div className="grid grid-cols-1 md:grid-cols-[180px_160px_220px_140px_140px_120px_120px] gap-3 items-center">
                    <div>
                      <div className="text-xs text-gray-400">{o.code}</div>
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-1">Created</div>
                      <div className="text-xs text-white">{formatDateTimeID(new Date(o.createdAt))}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white">{o.user?.username ?? "-"}</div>
                      <div className="text-[11px] text-gray-500">Booster: {o.booster ?? "—"}</div>
                      <div className="text-xs text-gray-500">{o.user?.id ?? "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white">{o.service?.name ?? o.service?.game?.name ?? "-"}</div>
                      {o.service?.game?.name && <div className="text-xs text-gray-500">{o.service.game.name}</div>}
                    </div>
                    <div>
                      <PaymentBadge status={o.status} />
                    </div>
                    <div>
                      <FulfillmentBadge status={o.fulfillmentStatus} />
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      {o.currency === "USD" ? "$" : ""}{Number.parseFloat(String(o.items)).toFixed(2)}
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      {o.currency === "USD" ? "$" : ""}{Number.parseFloat(String(o.amount)).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Payment Method</div>
                      <div className="text-sm text-white">{o.methodSlug.toUpperCase()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Discord</div>
                      <div className="text-sm text-white">{o.contactDiscord ?? "-"}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Character</div>
                      <div className="text-sm text-white">{o.characterName ?? "-"}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <Link
                      href={`/admin/orders?order=${encodeURIComponent(o.code)}`}
                      className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-200"
                      aria-label={`View details for ${o.code}`}
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && <div className="mt-6"><PaginationNumbers page={page} totalPages={totalPages} basePath={"/admin/orders"} /></div>}
          </div>
        )}
      </div>
    </>
  );
}
