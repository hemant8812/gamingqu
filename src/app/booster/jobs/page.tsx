import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { FiLock } from "react-icons/fi";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { Briefcase, CheckCircle, ChevronRight, Clock, Shield } from "lucide-react";

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

  const availableJobs = [
    { id: "JOB-101", title: "Gold to Platinum Boost", game: "League of Legends • Solo Queue", price: "$34.99" },
    { id: "JOB-102", title: "Diamond Coaching 3 Hours", game: "Valorant • Educational", price: "$89.99" },
    { id: "JOB-103", title: "Mythic +15 Carry", game: "World of Warcraft • PvE", price: "$20.99" },
  ];

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
              <Link href="/booster" className="btn btn-gaming btn-sm">Back to Overview</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Active Jobs</h3>
                  <span className="text-[11px] text-gray-300 bg-white/5 ring-1 ring-white/10 px-2 py-0.5 rounded-xl">
                    {activeJobs.length} active
                  </span>
                </div>
                <div className="p-4 md:p-6 space-y-3">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-white/10 bg-[#0A0E17] p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                          <div className="text-xs text-gray-500 truncate">{job.id} • {job.game}</div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 px-2 py-0.5 text-[11px] font-medium rounded-xl ring-1 ring-white/10 ${
                            job.status === "In Progress"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {job.status === "In Progress" ? <Shield className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          {job.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${job.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-emerald-400 font-semibold text-sm">{job.price}</div>
                        <button type="button" className="btn btn-gaming btn-xs">
                          Update Progress
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Available Jobs</h3>
                  <Link href="/booster/jobs" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300" aria-label="Refresh jobs">
                    Refresh <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="p-4 md:p-6 space-y-2">
                  {availableJobs.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-white/10 bg-[#0A0E17] p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                        <div className="text-xs text-gray-500 truncate">{job.game}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-emerald-400 font-semibold text-sm">{job.price}</div>
                        <button type="button" className="btn btn-gaming btn-xs">
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-white/10 bg-[#0A0E17] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Briefcase className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">More jobs coming soon</span>
                    </div>
                    <span className="inline-flex items-center gap-2 px-2 py-0.5 text-[11px] rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20">
                      <CheckCircle className="h-4 w-4" />
                      Live
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

