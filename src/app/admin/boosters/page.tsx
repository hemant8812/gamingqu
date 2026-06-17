import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { FiStar, FiSearch, FiCheck, FiX, FiTrash2, FiClock } from "react-icons/fi";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeleteApplicationButton } from "@/components/admin/boosters/DeleteApplicationButton";

export default async function AdminBoostersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const statusFilter = typeof sp.status === "string" ? sp.status : "ALL";

  // Build prisma query
  const where: any = {};
  if (statusFilter !== "ALL") {
    where.status = statusFilter;
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { discord: { contains: q } },
      { whatsapp: { contains: q } },
      { games: { contains: q } },
    ];
  }

  // Fetch applications
  const list = await db.boosterApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // Server Actions
  async function approveApplicationAction(formData: FormData) {
    "use server";
    const idStr = formData.get("id");
    const id = idStr ? Number(idStr) : null;
    if (!id) return;

    try {
      const app = await db.boosterApplication.update({
        where: { id },
        data: { status: "APPROVED" },
        select: { userId: true },
      });

      if (app.userId) {
        await db.user.update({
          where: { id: app.userId },
          data: { role: "BOOSTER" },
        });
      }
      revalidatePath("/admin/boosters");
    } catch (err) {
      console.error("Failed to approve application:", err);
    }
  }

  async function rejectApplicationAction(formData: FormData) {
    "use server";
    const idStr = formData.get("id");
    const id = idStr ? Number(idStr) : null;
    if (!id) return;

    try {
      await db.boosterApplication.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      revalidatePath("/admin/boosters");
    } catch (err) {
      console.error("Failed to reject application:", err);
    }
  }

  async function deleteApplicationAction(formData: FormData) {
    "use server";
    const idStr = formData.get("id");
    const id = idStr ? Number(idStr) : null;
    if (!id) return;

    try {
      await db.boosterApplication.delete({
        where: { id },
      });
      revalidatePath("/admin/boosters");
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Boosters</h1>
          <p className="text-gray-400">View and manage booster applications</p>
        </div>

        {/* Action Bar / Filter Form */}
        <form method="GET" action="/admin/boosters" className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search boosters by name, email, discord, or games..."
              className="w-full pl-12 pr-4 h-11 bg-[#0F172A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-11 px-4 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none select select-bordered text-sm font-normal"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button type="submit" className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm">
              Apply
            </button>
          </div>
        </form>

        {/* Boosters Table Card */}
        <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">Booster Applications</h3>
          </div>

          {list.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-500">
              <FiStar className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">No booster applications found</p>
              <p className="text-sm">Applications will appear here when users apply</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs font-semibold uppercase">
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Games</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {list.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{app.fullName || "N/A"}</div>
                        {app.user && (
                          <div className="text-xs text-blue-400">Account: @{app.user.username}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="text-gray-300">{app.email}</div>
                        <div className="text-xs text-gray-500">
                          Discord: <span className="text-gray-300">{app.discord || "N/A"}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          WhatsApp: <span className="text-gray-300">{app.whatsapp || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={app.games || ""}>
                        {app.games || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {app.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <FiClock className="h-3 w-3" /> Pending
                          </span>
                        )}
                        {app.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <FiCheck className="h-3 w-3" /> Approved
                          </span>
                        )}
                        {app.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <FiX className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {app.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {app.status === "PENDING" && (
                            <>
                              <form action={approveApplicationAction}>
                                <input type="hidden" name="id" value={app.id} />
                                <button
                                  type="submit"
                                  title="Approve"
                                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all"
                                >
                                  <FiCheck className="h-4 w-4" />
                                </button>
                              </form>
                              <form action={rejectApplicationAction}>
                                <input type="hidden" name="id" value={app.id} />
                                <button
                                  type="submit"
                                  title="Reject"
                                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all"
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              </form>
                            </>
                          )}
                          <DeleteApplicationButton id={app.id} action={deleteApplicationAction} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
