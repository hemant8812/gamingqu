"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { getBoosterId, getBoosterServiceIds } from "@/lib/boosterJobs";

// Pages that show the order list; actions send the booster back to the one they used.
const BACK_PAGES = new Set(["/booster", "/booster/orders"]);

function backTo(formData: FormData) {
  const back = String(formData.get("back") ?? "");
  return BACK_PAGES.has(back) ? back : "/booster/orders";
}

function done(formData: FormData, toast: string): never {
  revalidatePath("/booster");
  revalidatePath("/booster/orders");
  redirect(`${backTo(formData)}?toast=${toast}`);
}

// Take an open order. The update only matches while nobody else has it,
// so two boosters clicking at once cannot both get the same order.
export async function acceptJob(formData: FormData) {
  const me = await getBoosterId();
  const code = String(formData.get("code") ?? "");
  if (!me || !code) return;
  const serviceIds = await getBoosterServiceIds(me);
  const res = await db.order.updateMany({
    where: { code, status: "PAID", fulfillmentStatus: "PENDING", boosterId: null, serviceId: { in: serviceIds } },
    data: { boosterId: me, fulfillmentStatus: "ACCEPTED", acceptedAt: new Date() },
  });
  done(formData, res.count ? "accepted" : "taken");
}

export async function startJob(formData: FormData) {
  const me = await getBoosterId();
  const code = String(formData.get("code") ?? "");
  if (!me || !code) return;
  await db.order.updateMany({ where: { code, boosterId: me, fulfillmentStatus: "ACCEPTED" }, data: { fulfillmentStatus: "IN_PROGRESS" } });
  done(formData, "started");
}

export async function completeJob(formData: FormData) {
  const me = await getBoosterId();
  const code = String(formData.get("code") ?? "");
  if (!me || !code) return;
  await db.order.updateMany({
    where: { code, boosterId: me, fulfillmentStatus: { in: ["ACCEPTED", "IN_PROGRESS"] } },
    data: { fulfillmentStatus: "COMPLETED", completedAt: new Date() },
  });
  done(formData, "completed");
}

// Replace the booster's list of services they can do.
export async function saveServices(formData: FormData) {
  const me = await getBoosterId();
  if (!me) return;
  const picked = formData
    .getAll("serviceId")
    .map((v) => Number.parseInt(String(v), 10))
    .filter((n) => Number.isFinite(n));
  const valid = await db.service.findMany({ where: { id: { in: picked }, isActive: true }, select: { id: true } });
  await db.$transaction([
    db.boosterService.deleteMany({ where: { userId: me } }),
    db.boosterService.createMany({ data: valid.map((s) => ({ userId: me, serviceId: s.id })), skipDuplicates: true }),
  ]);
  revalidatePath("/booster/services");
  const back = String(formData.get("back") ?? "");
  if (back === "/booster/services") {
    revalidatePath("/booster");
    revalidatePath("/booster/orders");
    redirect("/booster/services?toast=saved");
  }
  done(formData, "saved");
}
