import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { OrderStatus, OrderFulfillmentStatus } from "@/generated/prisma/client";
import { AdminOrdersTable } from "@/components/admin/orders/AdminOrdersTable";
import Link from "next/link";
import { X } from "lucide-react";
import { Fragment } from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PageToast } from "@/components/shared/PageToast";
import { parseToast } from "@/lib/page-utils";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { PaymentBadge, FulfillmentBadge } from "@/components/shared/StatusBadge";
import { formatDateTimeID } from "@/lib/datetime";

 

export default async function AdminOrdersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
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

  const sp = searchParams ? await searchParams : {};
  const orderParam = sp?.order;
  const orderCode = typeof orderParam === "string" ? orderParam : Array.isArray(orderParam) ? orderParam[0] ?? "" : "";
  const pageRaw = sp?.page;
  const pageStr = typeof pageRaw === "string" ? pageRaw : Array.isArray(pageRaw) ? pageRaw[0] ?? "1" : "1";
  let page = Number.parseInt(pageStr || "1", 10);
  const pageSize = 5;
  const totalCount = await db.order.count();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  const orders = await db.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      code: true,
      user: { select: { id: true, username: true } },
      service: { select: { name: true, game: { select: { name: true } } } },
      methodSlug: true,
      status: true,
      fulfillmentStatus: true,
      items: true,
      fee: true,
      amount: true,
      currency: true,
      contactEmail: true,
      contactDiscord: true,
      characterName: true,
      createdAt: true,
    },
  });

  const uiOrders = orders.map((o) => ({
    code: o.code,
    user: o.user ? { id: o.user.id, username: o.user.username } : null,
    service: o.service
      ? { name: o.service.name, game: o.service.game ? { name: o.service.game.name } : null }
      : null,
    methodSlug: o.methodSlug,
    status: o.status,
    fulfillmentStatus: o.fulfillmentStatus,
    items: Number.parseFloat(o.items.toString()),
    fee: Number.parseFloat(o.fee.toString()),
    amount: Number.parseFloat(o.amount.toString()),
    currency: o.currency,
    contactEmail: o.contactEmail ?? null,
    contactDiscord: o.contactDiscord ?? null,
    characterName: o.characterName ?? null,
    createdAt: o.createdAt.toISOString(),
  }));

  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage =
    toast === "bp_changed"
      ? "Booster Pay updated successfully"
      : toast === "canceled"
      ? "Payment canceled"
      : toast === "status_changed"
      ? "Order status updated successfully"
      : toast === "fulfillment_changed"
      ? "Fulfillment status updated successfully"
      : toast === "error"
      ? "Operation failed"
      : undefined;
  const selected = orderCode
    ? await db.order.findUnique({
        where: { code: orderCode },
        select: {
          code: true,
          id: true,
          user: { select: { id: true, username: true } },
          service: { select: { name: true, game: { select: { name: true } } } },
          methodSlug: true,
          status: true,
          fulfillmentStatus: true,
          items: true,
          fee: true,
          amount: true,
          boosterPay: true,
          currency: true,
          contactEmail: true,
          contactDiscord: true,
          characterName: true,
          payload: true,
          createdAt: true,
        },
      })
    : null;

  async function cancelPaymentAction(formData: FormData) {
    "use server";
    const code = String(formData.get("code") || "");
    if (!code) return;
    try {
      const order = await db.order.findUnique({ where: { code }, select: { id: true, status: true } });
      if (!order) return;
      if (order.status !== "PENDING") return;
      await db.order.update({ where: { id: order.id }, data: { status: "CANCELED" } });
      await db.payment.updateMany({ where: { orderId: order.id }, data: { status: "CANCELED" } });
    } catch {
      /* ignore */
    }
    revalidatePath("/admin/orders");
    redirect(`/admin/orders?order=${encodeURIComponent(code)}&toast=canceled`);
  }

  async function changeBoosterPayAction(formData: FormData) {
    "use server";
    const code = String(formData.get("code") || "");
    const boosterPayStr = String(formData.get("boosterPay") || "").trim();
    const boosterPay = Number.parseFloat(boosterPayStr);
    if (!code || Number.isNaN(boosterPay)) return;
    try {
      const order = await db.order.findUnique({ where: { code }, select: { id: true } });
      if (!order) return;
      await db.order.update({ where: { id: order.id }, data: { boosterPay } });
    } catch {
      /* ignore */
    }
    revalidatePath("/admin/orders");
    redirect(`/admin/orders?order=${encodeURIComponent(code)}&toast=bp_changed`);
  }

  async function changeOrderStatusAction(formData: FormData) {
    "use server";
    const code = String(formData.get("code") || "");
    const status = String(formData.get("status") || "") as OrderStatus;
    if (!code || !status) return;
    try {
      const order = await db.order.findUnique({ where: { code }, select: { id: true } });
      if (!order) return;
      await db.order.update({ where: { id: order.id }, data: { status } });
      if (status === "PAID") {
        await db.payment.updateMany({
          where: { orderId: order.id },
          data: { status: "CAPTURED" },
        });
      }
    } catch {
      /* ignore */
    }
    revalidatePath("/admin/orders");
    redirect(`/admin/orders?order=${encodeURIComponent(code)}&toast=status_changed`);
  }

  async function changeFulfillmentStatusAction(formData: FormData) {
    "use server";
    const code = String(formData.get("code") || "");
    const fulfillmentStatus = String(formData.get("fulfillmentStatus") || "") as OrderFulfillmentStatus;
    if (!code || !fulfillmentStatus) return;
    try {
      const order = await db.order.findUnique({ where: { code }, select: { id: true } });
      if (!order) return;
      await db.order.update({ where: { id: order.id }, data: { fulfillmentStatus } });
    } catch {
      /* ignore */
    }
    revalidatePath("/admin/orders");
    redirect(`/admin/orders?order=${encodeURIComponent(code)}&toast=fulfillment_changed`);
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
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400">Manage customer orders</p>
        </div>
        <PageToast message={toastMessage} type={toastType} />

        {selected && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-ink-800 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="w-full">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">Order</div>
                  <div className="text-xs text-gray-500">{formatDateTimeID(new Date(selected.createdAt))}</div>
                </div>
                <div className="text-xl font-bold text-white">{selected.code}</div>
              </div>
              <Link
                href={`/admin/orders`}
                aria-label="Close detail"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </Link>
            </div>
            <div className="p-6 space-y-6">
              <div className="rounded-xl bg-ink-900 border border-white/10 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 items-start">
                  <div className="space-y-2 min-w-0 md:col-span-2">
                    <div className="text-xs text-gray-500">User</div>
                    <div className="text-sm text-white">{selected.user?.username ?? "-"}</div>
                    <div className="text-xs text-gray-500">{selected.user?.id ?? "-"}</div>
                  </div>
                  <div className="space-y-2 min-w-0 md:col-span-3">
                    <div className="text-xs text-gray-500">Service</div>
                    <div className="text-sm text-white break-words">{selected.service?.name ?? selected.service?.game?.name ?? "-"}</div>
                    {selected.service?.game?.name && <div className="text-xs text-gray-500 break-words">{selected.service.game.name}</div>}
                  </div>
                  <div className="space-y-2 min-w-0 md:col-span-2">
                    <div className="text-xs text-gray-500">Statuses</div>
                    <div className="flex flex-col gap-2">
                      <PaymentBadge status={selected.status} />
                      <FulfillmentBadge status={selected.fulfillmentStatus} />
                    </div>
                  </div>
                  <div className="min-w-0 md:col-span-2">
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 items-start">
                      <div>
                        <div className="text-xs text-gray-500">Payment</div>
                        <div className="text-sm text-white">{selected.methodSlug.toUpperCase()}</div>
                        <div className="text-sm text-emerald-400 font-semibold">
                          {selected.currency === "USD" ? "$" : ""}{Number.parseFloat(String(selected.amount)).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Booster Pay</div>
                        <div className="text-sm text-brand-400 font-semibold">
                          {selected.currency === "USD" ? "$" : ""}{Number.parseFloat(String(selected.boosterPay)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 min-w-0 md:col-span-2">
                    <div className="text-xs text-gray-500">Contact</div>
                    <div className="text-sm text-white break-words">{selected.contactEmail ?? "-"}</div>
                    <div className="text-sm text-white break-words">{selected.contactDiscord ?? "-"}</div>
                  </div>
                  <div className="space-y-2 min-w-0 md:col-span-1">
                    <div className="text-xs text-gray-500">Character</div>
                    <div className="text-sm text-white break-words">{selected.characterName ?? "-"}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
                <div className="md:col-span-8 rounded-xl bg-ink-900 border border-white/10 p-4">
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
                <div className="md:col-span-2 rounded-xl bg-ink-900 border border-white/10 p-4 space-y-4">
                  {/* Change Payment Status */}
                  <form action={changeOrderStatusAction} className="space-y-2">
                    <input type="hidden" name="code" value={selected.code} />
                    <div className="text-xs text-gray-500 font-bold">Payment Status</div>
                    <select
                      name="status"
                      defaultValue={selected.status}
                      className="w-full h-9 px-2 rounded-lg bg-ink-800 border border-white/10 text-white text-sm"
                    >
                      <option value="CREATED">CREATED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="CANCELED">CANCELED</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                    <SubmitButton className="w-full h-9 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold" pendingClassName="opacity-75 cursor-wait">
                      Update Status
                    </SubmitButton>
                  </form>

                  {/* Change Fulfillment Status */}
                  <form action={changeFulfillmentStatusAction} className="space-y-2">
                    <input type="hidden" name="code" value={selected.code} />
                    <div className="text-xs text-gray-500 font-bold">Fulfillment Status</div>
                    <select
                      name="fulfillmentStatus"
                      defaultValue={selected.fulfillmentStatus}
                      className="w-full h-9 px-2 rounded-lg bg-ink-800 border border-white/10 text-white text-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                    <SubmitButton className="w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold" pendingClassName="opacity-75 cursor-wait">
                      Update Fulfillment
                    </SubmitButton>
                  </form>

                  {selected.status === "PENDING" && (
                    <form action={cancelPaymentAction} className="space-y-2">
                      <input type="hidden" name="code" value={selected.code} />
                      <SubmitButton className="w-full h-9 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold" pendingClassName="opacity-75 cursor-wait">
                        Cancel Payment
                      </SubmitButton>
                    </form>
                  )}

                  <form action={changeBoosterPayAction} className="space-y-2">
                    <input type="hidden" name="code" value={selected.code} />
                    <div className="text-xs text-gray-500 font-bold">Change Booster Pay</div>
                    <input
                      type="number"
                      name="boosterPay"
                      defaultValue={Number.parseFloat(String(selected.boosterPay))}
                      step="0.01"
                      className="w-full h-9 px-3 rounded-lg bg-ink-800 border border-white/10 text-white text-sm"
                    />
                    <SubmitButton className="w-full h-9 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold" pendingClassName="opacity-75 cursor-wait">
                      Change Booster Pay
                    </SubmitButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <AdminOrdersTable orders={uiOrders} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
