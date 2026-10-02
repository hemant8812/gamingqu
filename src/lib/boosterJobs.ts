import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

export type BoosterJob = {
  id: string; // order code
  title: string;
  game: string;
  price: string;
  createdAt: string;
  payload?: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
};

// Signed-in booster's user id, or null when the user is not a booster.
export async function getBoosterId(): Promise<string | null> {
  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string; role?: string } | undefined;
  return user?.id && user.role === "BOOSTER" ? user.id : null;
}

export async function getBoosterServiceIds(boosterId: string): Promise<number[]> {
  const rows = await db.boosterService.findMany({ where: { userId: boosterId }, select: { serviceId: true } });
  return rows.map((r) => r.serviceId);
}

const jobSelect = {
  code: true,
  boosterPay: true,
  currency: true,
  serviceSlug: true,
  createdAt: true,
  payload: true,
  fulfillmentStatus: true,
  service: { select: { name: true, game: { select: { name: true } } } },
} as const;

type JobRow = {
  code: string;
  boosterPay: unknown;
  currency: string;
  serviceSlug: string;
  createdAt: Date;
  payload: unknown;
  fulfillmentStatus: BoosterJob["status"];
  service: { name: string; game: { name: string } | null } | null;
};

function toJob(o: JobRow): BoosterJob {
  const amount = Number.parseFloat(String(o.boosterPay ?? 0)) || 0;
  let price: string;
  try {
    price = new Intl.NumberFormat("en-US", { style: "currency", currency: o.currency || "USD", maximumFractionDigits: 2 }).format(amount);
  } catch {
    price = `$${amount.toFixed(2)}`;
  }
  return {
    id: o.code,
    title: o.service?.name ?? o.serviceSlug,
    game: o.service?.game?.name ?? "",
    price,
    createdAt: new Date(o.createdAt).toISOString(),
    payload: typeof o.payload === "string" ? o.payload : JSON.stringify(o.payload ?? {}),
    status: o.fulfillmentStatus,
  };
}

// Paid orders nobody has taken yet, limited to the services this booster picked.
export async function getAvailableJobs(serviceIds: number[], take = 50): Promise<BoosterJob[]> {
  if (serviceIds.length === 0) return [];
  const rows = await db.order.findMany({
    where: { status: "PAID", fulfillmentStatus: "PENDING", boosterId: null, serviceId: { in: serviceIds } },
    select: jobSelect,
    orderBy: { createdAt: "desc" },
    take,
  });
  return (rows as unknown as JobRow[]).map(toJob);
}

export async function getMyJobs(boosterId: string, which: "active" | "completed", take = 50): Promise<BoosterJob[]> {
  const rows = await db.order.findMany({
    where: {
      boosterId,
      fulfillmentStatus: which === "active" ? { in: ["ACCEPTED", "IN_PROGRESS"] } : "COMPLETED",
    },
    select: jobSelect,
    orderBy: which === "active" ? { acceptedAt: "desc" } : { completedAt: "desc" },
    take,
  });
  return (rows as unknown as JobRow[]).map(toJob);
}

// Active games with their active services, for the service picker.
export async function getServiceCatalog() {
  return db.game.findMany({
    where: { isActive: true, services: { some: { isActive: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      services: { where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } },
    },
  });
}
