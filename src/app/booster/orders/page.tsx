import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { FiLock } from "react-icons/fi";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { ArrowLeft } from "lucide-react";
import { JobsTabs } from "@/components/booster/JobsTabs";
import { PageToast } from "@/components/shared/PageToast";
import { getAvailableJobs, getBoosterId, getBoosterServiceIds, getMyJobs } from "@/lib/boosterJobs";
import { acceptJob, completeJob, startJob } from "@/lib/boosterActions";

export const metadata = {
  title: "Orders",
};

export default async function BoosterOrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isBooster = role === "BOOSTER";

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  const boosterId = await getBoosterId();
  if (!boosterId) return null;

  const serviceIds = await getBoosterServiceIds(boosterId).catch(() => [] as number[]);
  const [availableJobs, activeJobs, completedJobs] = await Promise.all([
    getAvailableJobs(serviceIds).catch(() => []),
    getMyJobs(boosterId, "active").catch(() => []),
    getMyJobs(boosterId, "completed").catch(() => []),
  ]);

  const sp = await searchParams;
  const toastKey = typeof sp.toast === "string" ? sp.toast : "";
  const toast: Record<string, { m: string; t: "success" | "error" }> = {
    accepted: { m: "Order taken. You can find it under In process.", t: "success" },
    taken: { m: "Someone else already took this order.", t: "error" },
    started: { m: "Marked as in progress.", t: "success" },
    completed: { m: "Order marked as completed.", t: "success" },
  };

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="orders" />
          </aside>
          <main>
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Orders</h1>
                <div className="text-sm text-gray-400">Paid orders for the services you can do</div>
              </div>
              <Link href="/booster" className="btn btn-gaming btn-sm !rounded-md inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Overview</span>
              </Link>
            </div>

            <PageToast message={toast[toastKey]?.m} type={toast[toastKey]?.t} />
            <JobsTabs
              available={availableJobs}
              active={activeJobs}
              completed={completedJobs}
              hasServices={serviceIds.length > 0}
              back="/booster/orders"
              acceptAction={acceptJob}
              startAction={startJob}
              completeAction={completeJob}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
