import { getServerSession } from "next-auth";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { JobsTabs } from "@/components/booster/JobsTabs";
import { PageToast } from "@/components/shared/PageToast";
import { getAvailableJobs, getBoosterServiceIds, getMyJobs } from "@/lib/boosterJobs";
import { acceptJob, completeJob, startJob } from "@/lib/boosterActions";
import { CalendarClock, Gamepad2, KeyRound, LifeBuoy, MessageSquare, ScrollText, TrendingUp, UserRound, Wallet } from "lucide-react";

export const metadata = {
  title: "Booster Dashboard",
};

// Level is based on completed orders.
const LEVELS = [
  { name: "New booster", short: "NEW", min: 0 },
  { name: "Pro booster", short: "PRO", min: 10 },
  { name: "Main booster", short: "MAIN", min: 50 },
];

const TOASTS: Record<string, { m: string; t: "success" | "error" }> = {
  accepted: { m: "Order taken. You can find it under In process.", t: "success" },
  taken: { m: "Someone else already took this order.", t: "error" },
  started: { m: "Marked as in progress.", t: "success" },
  completed: { m: "Order marked as completed.", t: "success" },
};

function money(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] py-3 last:border-0">
      <span className="flex items-center gap-2.5 text-sm text-gray-300">
        <span className="text-gray-500">{icon}</span>
        {label}
      </span>
      <span className="font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}

function AccountLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-gray-200 transition-colors hover:border-brand-500/40 hover:text-white">
      <span className="text-brand-300">{icon}</span>
      {label}
    </Link>
  );
}

export default async function BoosterDashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string; name?: string | null; username?: string | null; email?: string | null } | undefined;

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
  const display = user.username ?? user.name ?? "Booster";

  const serviceIds = await getBoosterServiceIds(me).catch(() => [] as number[]);
  const [available, inProcess, completed, completedCount, earned, wallet, lastOrder, myServices] = await Promise.all([
    getAvailableJobs(serviceIds).catch(() => []),
    getMyJobs(me, "active").catch(() => []),
    getMyJobs(me, "completed", 20).catch(() => []),
    db.order.count({ where: { boosterId: me, fulfillmentStatus: "COMPLETED" } }).catch(() => 0),
    db.order.aggregate({ _sum: { boosterPay: true }, where: { boosterId: me, fulfillmentStatus: "COMPLETED" } }).catch(() => null),
    db.wallet.findUnique({ where: { userId: me }, select: { balance: true, currency: true } }).catch(() => null),
    db.order.findFirst({ where: { boosterId: me }, orderBy: { acceptedAt: "desc" }, select: { acceptedAt: true } }).catch(() => null),
    db.boosterService
      .findMany({ where: { userId: me }, select: { service: { select: { name: true, game: { select: { name: true } } } } } })
      .catch(() => []),
  ]);

  const currency = wallet?.currency ?? "USD";
  const balance = Number.parseFloat(String(wallet?.balance ?? 0)) || 0;
  const totalEarned = Number.parseFloat(String(earned?._sum.boosterPay ?? 0)) || 0;
  const lastOrderText = lastOrder?.acceptedAt
    ? new Date(lastOrder.acceptedAt).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "2-digit" })
    : "None yet";

  const levelIndex = LEVELS.reduce((acc, l, i) => (completedCount >= l.min ? i : acc), 0);
  const next = LEVELS[levelIndex + 1];
  const top = LEVELS[LEVELS.length - 1].min;
  const progress = Math.min(100, Math.round((completedCount / top) * 100));

  const sp = await searchParams;
  const toast = TOASTS[typeof sp.toast === "string" ? sp.toast : ""];

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <PageToast message={toast?.m} type={toast?.t} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="space-y-6 lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="overview" />
          </aside>
          <main className="min-w-0 space-y-8">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-3xl font-extrabold">My account</h1>
              <Link href="/booster/messages" className="btn btn-gaming h-10 rounded-xl px-5">
                <MessageSquare className="h-4 w-4" /> Messages
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr_1fr]">
              {/* Wallet */}
              <section className="surface p-5">
                <Row icon={<Wallet className="h-4 w-4" />} label="Balance" value={money(balance, currency)} />
                <Row icon={<CalendarClock className="h-4 w-4" />} label="Last order" value={lastOrderText} />
                <Row icon={<TrendingUp className="h-4 w-4" />} label="Total earned" value={money(totalEarned, currency)} />
                <div className="mt-4 grid gap-2">
                  <Link href="/booster/earnings" className="btn btn-gaming h-11 rounded-xl">Withdraw</Link>
                  <Link href="/booster/earnings" className="btn h-11 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]">
                    My withdrawals
                  </Link>
                </div>
              </section>

              {/* Level + services */}
              <section className="surface p-5">
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l, i) => (
                    <div
                      key={l.short}
                      className={`rounded-xl border px-2 py-2 text-center text-xs font-semibold sm:text-sm ${
                        i === levelIndex ? "border-brand-500/60 bg-brand-500/15 text-white" : "border-white/10 text-gray-400"
                      }`}
                    >
                      {l.name}
                    </div>
                  ))}
                </div>
                <div className="relative mt-5 h-2 rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={top} aria-valuenow={Math.min(completedCount, top)} aria-label="Booster level progress">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${progress}%` }} />
                  {LEVELS.map((l) => (
                    <span
                      key={l.short}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white ring-2 ring-ink-800"
                      style={{ left: `${Math.max(6, Math.min(94, (l.min / top) * 100))}%` }}
                    >
                      {l.short}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-center text-xs text-gray-400">
                  {next
                    ? `${completedCount} completed. ${next.min - completedCount} more to reach ${next.name}.`
                    : `${completedCount} completed. You have the top level.`}
                </p>

                <div className="mt-5 border-t border-white/[0.07] pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Services I can do</span>
                    <Link href="/booster/services" className="text-xs font-semibold text-brand-300 hover:text-white">Edit</Link>
                  </div>
                  {myServices.length === 0 ? (
                    <Link href="/booster/services" className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 p-3 text-sm text-gray-400 hover:text-white">
                      <Gamepad2 className="h-4 w-4" /> Choose the services you can do
                    </Link>
                  ) : (
                    <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                      {myServices.map((s, i) => (
                        <span key={i} className="rounded-lg border border-white/10 bg-ink-900/60 px-2 py-1 text-xs text-gray-200">
                          <span className="text-brand-300">{s.service.game?.name}:</span> {s.service.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Account */}
              <section className="surface p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime-glow to-brand-600 font-bold uppercase text-white">
                    {display.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-bold text-white">{display}</div>
                    <div className="truncate text-xs text-gray-400">ID: {me}</div>
                    <div className="truncate text-xs text-gray-400">{user.email}</div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <AccountLink href="/booster/profile" icon={<UserRound className="h-4 w-4" />} label="Edit profile" />
                  <AccountLink href="/booster/settings" icon={<KeyRound className="h-4 w-4" />} label="Change password" />
                  <AccountLink href="/contact" icon={<LifeBuoy className="h-4 w-4" />} label="Write to admins" />
                  <AccountLink href="/trust-safety" icon={<ScrollText className="h-4 w-4" />} label="Rules" />
                </div>
              </section>
            </div>

            <section>
              <h2 className="mb-4 text-2xl font-extrabold">Orders you can take</h2>
              <JobsTabs
                available={available}
                active={inProcess}
                completed={completed}
                hasServices={serviceIds.length > 0}
                back="/booster"
                acceptAction={acceptJob}
                startAction={startJob}
                completeAction={completeJob}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
