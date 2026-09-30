import { getServerSession } from "next-auth";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import { authOptions } from "@/auth";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { BadgeCheck, Briefcase, CheckCircle, ChevronRight, DollarSign, LayoutDashboard, MessageSquare, Settings, Star, Timer, User } from "lucide-react";

export const metadata = {
  title: "Booster Dashboard | GamingQu",
};

export default async function BoosterDashboardPage() {
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
          <p className="text-gray-400 mb-4">Please sign in to access your booster panel.</p>
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

  const name = session.user?.name ?? session.user?.username ?? "Booster";

  const stats = {
    activeJobs: 3,
    totalEarnings: "$4,567.89",
    rating: 4.92,
    completed: 156,
  };

  const activeJobs = [
    { id: "ORD-001", title: "Diamond Boost", game: "League of Legends", progress: 65, price: "$99.99", status: "In Progress" as const, eta: "2h 30m", priority: "High" as const },
  ];

  const availableJobs = [
    { id: "JOB-101", title: "Gold to Platinum Boost", game: "League of Legends", queue: "Solo Queue", price: "$34.99", tags: ["Fast"] },
    { id: "JOB-102", title: "Diamond Coaching 3 Hours", game: "Valorant", queue: "Educational", price: "$89.99", tags: ["Coaching"] },
    { id: "JOB-103", title: "Mythic +15 Carry", game: "World of Warcraft", queue: "PvE", price: "$20.99", tags: ["Carry"] },
  ];

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="lg:hidden mb-4">
          <details className="rounded-2xl border border-white/10 bg-ink-800">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
              <span className="flex items-center gap-3 text-white">
                <LayoutDashboard className="h-4 w-4" />
                <span>Menu Booster</span>
              </span>
              <ChevronRight className="h-4 w-4" />
            </summary>
            <nav className="p-3">
              <ul className="space-y-1">
                <li>
                  <Link href="/booster" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </li>
                <li>
                  <Link href="/booster/jobs" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Briefcase className="h-4 w-4" />
                    <span>Jobs</span>
                  </Link>
                </li>
                <li>
                  <Link href="/booster/earnings" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <DollarSign className="h-4 w-4" />
                    <span>Earnings</span>
                  </Link>
                </li>
                <li>
                  <Link href="/booster/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href="/booster/messages" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </li>
                <li>
                  <Link href="/booster/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="overview" />
          </aside>

          <main>
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900 ring-1 ring-white/5 mb-6">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
              </div>
              <div className="relative p-6 md:p-7 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-xs text-gray-300">
                      <BadgeCheck className="h-4 w-4 text-emerald-400" />
                      Booster Dashboard
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-white">
                      Welcome, <span className="gradient-text">{String(name)}</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-300/90">Focus on speed, transparency, and delivery quality.</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/25 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Available for Jobs
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900 p-5 flex items-center justify-between ring-1 ring-white/5 hover:ring-white/10 transition">
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-brand-500/15 blur-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Jobs</p>
                  <p className="text-2xl font-extrabold text-white tabular-nums">{stats.activeJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 ring-1 ring-brand-500/20">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900 p-5 flex items-center justify-between ring-1 ring-white/5 hover:ring-white/10 transition">
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-emerald-500/15 blur-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-2xl font-extrabold text-white tabular-nums">{stats.totalEarnings}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900 p-5 flex items-center justify-between ring-1 ring-white/5 hover:ring-white/10 transition">
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-yellow-500/15 blur-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Rating</p>
                  <p className="text-2xl font-extrabold text-white tabular-nums">{stats.rating.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 ring-1 ring-yellow-500/20">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900 p-5 flex items-center justify-between ring-1 ring-white/5 hover:ring-white/10 transition">
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-purple-500/15 blur-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-2xl font-extrabold text-white tabular-nums">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/20">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <section className="bg-gradient-to-b from-ink-800 to-ink-900 border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Active Jobs</h3>
                  <Link href="/booster/jobs" className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300" aria-label="View all jobs">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="p-4 md:p-6 space-y-3">
                  {activeJobs.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 text-center text-gray-400">
                      No active jobs
                    </div>
                  ) : (
                    activeJobs.map((job) => (
                      <div key={job.id} className="rounded-2xl border border-white/10 bg-ink-900 p-4 ring-1 ring-transparent hover:ring-white/10 transition">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                            <div className="text-xs text-gray-500 truncate">{job.id} • {job.game}</div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-emerald-400 font-semibold text-sm">{job.price}</div>
                            <div className="text-[11px] text-gray-500 flex items-center justify-end gap-1 mt-0.5">
                              <Timer className="h-3.5 w-3.5" />
                              ETA {job.eta}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-brand-500" style={{ width: `${job.progress}%` }} />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-xl bg-brand-500/20 text-brand-200 ring-1 ring-brand-500/20">
                              {job.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded-xl ring-1 ring-white/10 ${
                              job.priority === "High" ? "bg-red-500/15 text-red-200" : "bg-white/5 text-gray-300"
                            }`}>
                              {job.priority} priority
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" className="btn btn-gaming btn-xs">Update</button>
                            <button type="button" className="btn btn-ghost btn-xs border border-white/10 text-gray-200 hover:bg-white/5">Details</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="bg-gradient-to-b from-ink-800 to-ink-900 border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Available Jobs</h3>
                  <span className="text-[11px] text-emerald-300 bg-emerald-500/15 ring-1 ring-emerald-500/20 px-2 py-0.5 rounded-xl">
                    {availableJobs.length} new jobs
                  </span>
                </div>
                <div className="p-4 md:p-6 space-y-2">
                  {availableJobs.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-white/10 bg-ink-900 p-4 ring-1 ring-transparent hover:ring-white/10 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                          <div className="text-xs text-gray-500 truncate">{job.game} • {job.queue}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {job.tags.map((t) => (
                              <span key={`${job.id}-${t}`} className="inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] bg-white/5 text-gray-200 ring-1 ring-white/10">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-emerald-400 font-semibold text-sm">{job.price}</div>
                          <button type="button" className="btn btn-gaming btn-xs">Accept</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/booster/jobs" className="block text-center text-sm text-brand-400 hover:text-brand-300 pt-2">
                    View All Available Jobs →
                  </Link>
                </div>
              </section>
            </div>

            <section className="bg-gradient-to-b from-ink-800 to-ink-900 border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Performance Insights</h3>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 ring-1 ring-transparent hover:ring-white/10 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-400">Earnings this month</div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20 flex items-center justify-center text-emerald-300">
                      <DollarSign className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">+23%</div>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                    <div className="h-full w-2/3 bg-gradient-to-r from-emerald-500 to-accent-500" />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 ring-1 ring-transparent hover:ring-white/10 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-400">Avg response time</div>
                    <div className="w-9 h-9 rounded-xl bg-brand-500/15 ring-1 ring-brand-500/20 flex items-center justify-center text-brand-300">
                      <Timer className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">&lt; 5 min</div>
                  <div className="mt-2 text-[11px] text-gray-500">Last 7 days</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 ring-1 ring-transparent hover:ring-white/10 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-400">Completion rate</div>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 ring-1 ring-purple-500/20 flex items-center justify-center text-purple-300">
                      <CheckCircle className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">98%</div>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                    <div className="h-full w-[98%] bg-gradient-to-r from-purple-500 to-brand-500" />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
