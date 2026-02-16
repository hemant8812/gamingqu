import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { FiLock } from "react-icons/fi";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { ArrowLeft } from "lucide-react";
import { JobsTabs } from "@/components/booster/JobsTabs";
import { db } from "@/lib/prisma";

export const metadata = {
  title: "Booster Jobs | GamingQu",
};

export default async function BoosterJobsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isBooster = role === "BOOSTER";

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-4">
            <FiLock className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view booster jobs.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!isBooster) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  const activeJobs = [
    { id: "ORD-001", title: "Diamond Boost", game: "League of Legends", status: "In Progress" as const, progress: 65, price: "$99.99" },
    { id: "ORD-014", title: "Ranked Placement", game: "Valorant", status: "Pending" as const, progress: 10, price: "$29.99" },
  ];

  let availableJobs: Array<{ id: string; title: string; game: string; price: string; createdAt: string; payload?: string }> = [];
  try {
    const list = await db.order.findMany({
      where: { status: "PAID", fulfillmentStatus: "PENDING" },
      select: {
        code: true,
        items: true,
        boosterPay: true,
        currency: true,
        serviceSlug: true,
        createdAt: true,
        payload: true,
        service: { select: { name: true, game: { select: { name: true } } } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    });
    availableJobs = list.map((o) => {
      const title = o.service?.name ?? o.serviceSlug;
      const game = o.service?.game?.name ?? "";
      const amount = typeof o.boosterPay === "number" ? o.boosterPay : Number.parseFloat(String(o.boosterPay));
      const price = new Intl.NumberFormat("en-US", { style: "currency", currency: o.currency, maximumFractionDigits: 2 }).format(amount);
      const payloadStr = typeof o.payload === "string" ? o.payload : JSON.stringify(o.payload ?? {});
      return { id: o.code, title, game, price, createdAt: new Date(o.createdAt as unknown as string).toISOString(), payload: payloadStr };
    });
  } catch {}

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-8 self-start">
            <BoosterSidebar active="jobs" />
          </aside>
          <main>
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Jobs</h1>
                <div className="text-sm text-gray-400">Manage your active work and accept new jobs</div>
              </div>
              <Link href="/booster" className="btn btn-gaming btn-sm !rounded-md inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Overview</span>
              </Link>
            </div>

            <JobsTabs available={availableJobs.map((j) => ({ id: j.id, title: j.title, game: j.game, price: j.price, createdAt: j.createdAt, payload: j.payload }))} active={activeJobs} />
          </main>
        </div>
      </div>
    </div>
  );
}
