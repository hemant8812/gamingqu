import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { MemberSidebar } from "@/components/dashboard/MemberSidebar";

function formatDateTimeEnglish(d: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view your profile.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }
  if (!isMember) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for members only.</p>
        </div>
      </div>
    );
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      role: true,
      isSuspended: true,
      emailVerified: true,
      createdAt: true,
      password: true,
      accounts: { select: { provider: true } },
    },
  });
  const oauthProviders = Array.isArray(user?.accounts) ? user!.accounts.map((a) => a.provider) : [];
  const passwordSet = !!user?.password;
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="lg:block">
            <MemberSidebar active="profile" />
          </aside>
          <main>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Profile</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative card-gaming rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl font-bold">
                    {String((user?.name ?? user?.username ?? "U").charAt(0)).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Member ID</div>
                    <div className="text-xl font-bold text-white">{user?.id ?? "-"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="text-sm text-white">{user?.name ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Username</div>
                    <div className="text-sm text-white">{user?.username ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm text-white">{user?.email ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Role</div>
                    <div className="text-sm text-white">{user?.role ?? "-"}</div>
                  </div>
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Account Status</div>
                    <div className={`text-sm font-semibold ${user?.isSuspended ? "text-red-400" : "text-emerald-400"}`}>{user?.isSuspended ? "Suspended" : "Active"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email Verified</div>
                    <div className={`text-sm font-semibold ${user?.emailVerified ? "text-emerald-400" : "text-yellow-400"}`}>{user?.emailVerified ? "Verified" : "Unverified"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Password</div>
                    <div className={`text-sm font-semibold ${passwordSet ? "text-emerald-400" : "text-yellow-400"}`}>{passwordSet ? "Set" : "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created At</div>
                    <div className="text-sm text-white">{user?.createdAt ? formatDateTimeEnglish(new Date(user.createdAt)) : "-"}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-500">OAuth Accounts</div>
                  <div className="text-sm text-white">{oauthProviders.length > 0 ? oauthProviders.join(", ") : "-"}</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-white">Manage Profile</div>
                  <div className="text-sm text-gray-400">Edit your personal information</div>
                </div>
                <button type="button" className="btn btn-gaming btn-sm" aria-disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
