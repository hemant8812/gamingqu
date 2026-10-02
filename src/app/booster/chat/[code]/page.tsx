import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/prisma";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { OrderChat } from "@/components/chat/OrderChat";
import { getBoosterId } from "@/lib/boosterJobs";

export const metadata = { title: "Order chat" };

export default async function BoosterChatPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const me = await getBoosterId();
  if (!me) notFound();
  // Boosters can only open chats for orders they took.
  const order = await db.order.findFirst({
    where: { code, boosterId: me },
    select: { code: true, characterName: true, contactDiscord: true, service: { select: { name: true, game: { select: { name: true } } } } },
  });
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="orders" />
          </aside>
          <main className="min-w-0 space-y-4">
            <Link href="/booster/orders" className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to orders
            </Link>
            <div className="surface p-5">
              <div className="text-xs text-brand-300">{order.service?.game?.name}</div>
              <h1 className="text-2xl font-bold">{order.service?.name}</h1>
              <div className="mt-1 font-mono text-sm text-gray-400">{order.code}</div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-300">
                <span>Character: <b className="text-white">{order.characterName ?? "-"}</b></span>
                <span>Discord: <b className="text-white">{order.contactDiscord ?? "-"}</b></span>
              </div>
            </div>
            <OrderChat code={order.code} title="Chat with customer" />
          </main>
        </div>
      </div>
    </div>
  );
}
