"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { getChatAccess } from "@/lib/orderChat";

const MAX_LENGTH = 2000;

export async function postOrderMessage(formData: FormData) {
  const code = String(formData.get("code") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, MAX_LENGTH);
  if (!code || !body) return;
  const access = await getChatAccess(code);
  if (!access) return;
  await db.orderMessage.create({ data: { orderId: access.orderId, senderId: access.viewer.id, body } });
  revalidatePath("/dashboard/orders");
  revalidatePath(`/booster/chat/${code}`);
  revalidatePath("/admin/orders");
}
