import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { FiShoppingCart } from "react-icons/fi";
import { db } from "@/lib/prisma";
import { AdminOrdersTable } from "@/components/admin/orders/AdminOrdersTable";

export default async function AdminOrdersPage() {
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

  const orders = await db.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 200,
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

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400">Manage customer orders</p>
        </div>

        <AdminOrdersTable orders={uiOrders} />
      </div>
    </div>
  );
}
