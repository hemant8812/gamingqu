import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { AlertTriangle, User } from "lucide-react";
import { CreatePasswordForm } from "@/components/dashboard/CreatePasswordForm";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";
import { PageToast } from "@/components/shared/PageToast";
import { UpdateProfileDetailsForm } from "@/components/dashboard/UpdateProfileDetailsForm";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";

export const metadata = {
  title: "Booster Profile | GamingQu",
};

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

export default async function BoosterProfilePage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isBooster = role === "BOOSTER";

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
  const sp = searchParams ? await searchParams : {};
  const toast = typeof sp?.toast === "string" ? sp.toast : undefined;
  const toastMessage =
    toast === "pw_set"
      ? "Password created successfully"
      : toast === "pw_changed"
      ? "Password changed successfully"
      : toast === "info_updated"
      ? "Profile updated successfully"
      : toast === "error"
      ? "Failed to update information"
      : undefined;
  const toastType: "success" | "error" = toast === "error" ? "error" : "success";

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-8 self-start">
            <BoosterSidebar active="profile" />
          </aside>
          <main>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Profile</h1>
            </div>
            <PageToast message={toastMessage} type={toastType} />
            <div className="no-card-hover grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative card-gaming rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <AvatarUpload
                    initialUrl={user?.image ?? null}
                    initialLetter={String((user?.name ?? user?.username ?? "U").charAt(0)).toUpperCase()}
                  />
                  <div>
                    <div className="text-sm text-gray-400">Booster ID</div>
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
            {!passwordSet ? (
              <div className="space-y-5">
                <div className="rounded-xl bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-semibold">Security Notice</div>
                    <div className="text-sm">For security, please create a password to protect your account.</div>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">Edit Profile & Create Password</div>
                      <div className="text-xs text-gray-400">Update your information and secure your account</div>
                    </div>
                  </div>
                  <UpdateProfileDetailsForm initialName={user?.name ?? ""} initialEmail={user?.email ?? ""} />
                  <div className="my-6 h-px bg-white/10" />
                  <CreatePasswordForm />
                </div>
              </div>
            ) : (
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Edit Profile & Change Password</div>
                    <div className="text-xs text-gray-400">Update your name and email, then change your password</div>
                  </div>
                </div>
                <UpdateProfileDetailsForm initialName={user?.name ?? ""} initialEmail={user?.email ?? ""} />
                <div className="my-6 h-px bg-white/10" />
                <ChangePasswordForm />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

