import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

export type ChatViewer = { id: string; role: "customer" | "booster" | "admin" };

// Who may read and write this order's chat: its customer, its booster, or an admin.
export async function getChatAccess(code: string): Promise<{ orderId: number; viewer: ChatViewer } | null> {
  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || !code) return null;
  const order = await db.order.findUnique({ where: { code }, select: { id: true, userId: true, boosterId: true } });
  if (!order) return null;
  if (user.role === "ADMIN" || user.role === "SUPERADMIN") return { orderId: order.id, viewer: { id: user.id, role: "admin" } };
  if (order.boosterId && order.boosterId === user.id) return { orderId: order.id, viewer: { id: user.id, role: "booster" } };
  if (order.userId && order.userId === user.id) return { orderId: order.id, viewer: { id: user.id, role: "customer" } };
  return null;
}

export async function getMessages(orderId: number) {
  return db.orderMessage.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
    take: 200,
    select: { id: true, body: true, createdAt: true, sender: { select: { id: true, username: true, role: true } } },
  });
}
