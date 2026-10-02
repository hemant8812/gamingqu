import { getServerSession } from "next-auth";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { getAvailableJobs, getBoosterServiceIds, getMyJobs, type BoosterJob } from "@/lib/boosterJobs";
import { Activity, Briefcase, CheckCircle, ChevronRight, DollarSign, Gamepad2, Star } from "lucide-react";

export const metadata = {
  title: "Booster Dashboard",
};

function StatCard({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: string }) {
  return (
    <div className="surface flex items-center justify-between gap-3 p-5">
      <div className="min-w-0">
        <div className="text-sm text-gray-400">{label}</div>
        <div className="mt-1 truncate font-display text-2xl font-bold text-white tabular-nums">{value}</div>
      </div>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ${tone}`}>{icon}</span>
    </div>
  );
}

function JobLine({ job, right }: { job: BoosterJob; right: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-900/60 p-4">
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{job.title}</div>
        <div className="truncate text-xs text-gray-400">
          <span className="font-mono">{job.id}</span> · {job.game}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">{right}</div>
    </li>
  );
}

export default async function BoosterDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string; name?: string | null; username?: string | null } | undefined;

  if (!user) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-4">
            <FiLock className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to access your booster panel.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }

  if (user.role !== "BOOSTER" || !user.id) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  const me = user.id;
  const name = user.username ?? user.name ?? "Booster";

  const serviceIds = await getBoosterServiceIds(me).catch(() => [] as number[]);
  const [inProcess, available, completedCount, earnings, rating] = await Promise.all([
    getMyJobs(me, "active", 5).catch(() => []),
    getAvailableJobs(serviceIds, 5).catch(() => []),
    db.order.count({ where: { boosterId: me, fulfillmentStatus: "COMPLETED" } }).catch(() => 0),
    db.order.aggregate({ _sum: { boosterPay: true }, where: { boosterId: me, fulfillmentStatus: "COMPLETED" } }).catch(() => null),
    db.review.aggregate({ _avg: { rating: true }, _count: { _all: true }, where: { isPublished: true, order: { boosterId: me } } }).catch(() => null),
  ]);

  const earned = Number.parseFloat(String(earnings?._sum.boosterPay ?? 0)) || 0;
  const earnedText = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(earned);
  const ratingCount = rating?._count._all ?? 0;
  const ratingText = ratingCount > 0 && rating?._avg.rating ? rating._avg.rating.toFixed(2) : "New";

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="overview" />
          </aside>
          <main className="min-w-0 space-y-6">
            <section className="relative overflow-hidden rounded-[1.5rem] border border-brand-500/25 bg-gradient-to-br from-brand-900/60 via-ink-800 to-ink-900 p-6 md:p-8">
              <div className="dot-grid absolute inset-0 opacity-50" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="eyebrow mb-2">Booster dashboard</div>
                  <h1 className="text-3xl font-extrabold md:text-4xl">
                    Welcome, <span className="gradient-text">{name}</span>
                  </h1>
                  <p className="mt-2 text-sm text-gray-300">
                    {serviceIds.length > 0
                      ? `You work on ${serviceIds.length} service${serviceIds.length === 1 ? "" : "s"}.`
                      : "Choose the services you can do to start getting orders."}
                  </p>
                </div>
                <Link href="/booster/orders" className="btn btn-gaming h-11 rounded-xl px-5">
                  Find orders <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="In process" value={String(inProcess.length)} icon={<Activity className="h-5 w-5 text-brand-200" />} tone="bg-brand-500/15 ring-brand-400/30" />
              <StatCard label="Total earnings" value={earnedText} icon={<DollarSign className="h-5 w-5 text-emerald-300" />} tone="bg-emerald-500/15 ring-emerald-400/30" />
              <StatCard label="Rating" value={ratingText} icon={<Star className="h-5 w-5 text-amber-300" />} tone="bg-amber-500/15 ring-amber-400/30" />
              <StatCard label="Completed" value={String(completedCount)} icon={<CheckCircle className="h-5 w-5 text-accent-300" />} tone="bg-accent-500/15 ring-accent-400/30" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <section className="surface p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold"><Activity className="h-5 w-5 text-brand-300" /> In process</h2>
                  <Link href="/booster/orders" className="text-sm text-brand-300 hover:text-white">View all</Link>
                </div>
                {inProcess.length === 0 ? (
                  <p className="rounded-xl border border-white/10 bg-ink-900/60 p-6 text-center text-sm text-gray-400">No orders in process.</p>
                ) : (
                  <ul className="space-y-2">
                    {inProcess.map((j) => (
                      <JobLine
                        key={j.id}
                        job={j}
                        right={
                          <>
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-gray-300 ring-1 ring-white/10">
                              {j.status === "IN_PROGRESS" ? "In progress" : "Accepted"}
                            </span>
                            <span className="font-semibold text-emerald-300 tabular-nums">{j.price}</span>
                          </>
                        }
                      />
                    ))}
                  </ul>
                )}
              </section>

              <section className="surface p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold"><Briefcase className="h-5 w-5 text-lime-glow" /> Available orders</h2>
                  <Link href="/booster/orders" className="text-sm text-brand-300 hover:text-white">See all</Link>
                </div>
                {serviceIds.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-ink-900/60 p-6 text-center">
                    <Gamepad2 className="mx-auto mb-2 h-8 w-8 text-brand-300" />
                    <p className="text-sm text-gray-400">Pick your services to see orders here.</p>
                    <Link href="/booster/services" className="btn btn-gaming btn-sm mt-3 rounded-xl">Choose services</Link>
                  </div>
                ) : available.length === 0 ? (
                  <p className="rounded-xl border border-white/10 bg-ink-900/60 p-6 text-center text-sm text-gray-400">No open orders for your services right now.</p>
                ) : (
                  <ul className="space-y-2">
                    {available.map((j) => (
                      <JobLine
                        key={j.id}
                        job={j}
                        right={
                          <>
                            <span className="font-semibold text-emerald-300 tabular-nums">{j.price}</span>
                            <Link href="/booster/orders" className="btn btn-xs h-8 rounded-lg border-0 bg-lime-glow px-3 font-bold text-ink-900">Get order</Link>
                          </>
                        }
                      />
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
