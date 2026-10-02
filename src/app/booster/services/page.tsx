import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicePicker } from "@/components/booster/ServicePicker";
import { db } from "@/lib/prisma";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { PageToast } from "@/components/shared/PageToast";
import { getBoosterId, getBoosterServiceIds } from "@/lib/boosterJobs";
import { saveServices } from "@/lib/boosterActions";

export const metadata = {
  title: "My Services",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BoosterServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const boosterId = await getBoosterId();
  if (!boosterId) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  const sp = await searchParams;
  const saved = sp.toast === "saved";

  const [mine, games] = await Promise.all([
    getBoosterServiceIds(boosterId),
    db.game.findMany({
      where: { isActive: true, services: { some: { isActive: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        services: { where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <PageToast message={saved ? "Your services are saved" : undefined} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="services" />
          </aside>
          <main className="min-w-0">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">My Services</h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Tap the services you can do, then save. The Orders page will only show you orders for these services.
                </p>
              </div>
              <Link href="/booster/orders" className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]">
                Go to orders <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {games.length === 0 ? (
              <div className="surface p-10 text-center text-gray-400">No services are available yet.</div>
            ) : (
              <form action={saveServices} className="space-y-4">
                <input type="hidden" name="back" value="/booster/services" />
                <ServicePicker games={games} initial={mine} />
                <div className="sticky bottom-4 flex justify-end">
                  <button type="submit" className="btn btn-gaming h-11 rounded-xl px-6 shadow-lg">
                    Save my services
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
