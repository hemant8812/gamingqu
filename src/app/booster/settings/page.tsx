import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Bell, KeyRound, LifeBuoy, Mail, MessageCircle, ScrollText, UserRound } from "lucide-react";
import { db } from "@/lib/prisma";
import { getBoosterId } from "@/lib/boosterJobs";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";
import { PageToast } from "@/components/shared/PageToast";

export const metadata = { title: "Settings" };

const TOASTS: Record<string, string> = {
  discord: "Discord saved.",
  notify: "Notification settings saved.",
};

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="surface p-5">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
        <span className="text-brand-300">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function BoosterSettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const me = await getBoosterId();
  if (!me) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  async function saveDiscord(formData: FormData) {
    "use server";
    const id = await getBoosterId();
    if (!id) return;
    const discord = String(formData.get("discord") ?? "").trim().slice(0, 64);
    await db.user.update({ where: { id }, data: { discord: discord || null } });
    revalidatePath("/booster/settings");
    redirect("/booster/settings?toast=discord");
  }

  async function saveNotify(formData: FormData) {
    "use server";
    const id = await getBoosterId();
    if (!id) return;
    await db.user.update({ where: { id }, data: { notifyNewOrders: formData.get("notifyNewOrders") === "on" } });
    revalidatePath("/booster/settings");
    revalidatePath("/booster", "layout");
    redirect("/booster/settings?toast=notify");
  }

  const user = await db.user.findUnique({
    where: { id: me },
    select: { id: true, name: true, username: true, email: true, image: true, discord: true, notifyNewOrders: true },
  });
  const sp = await searchParams;
  const toast = TOASTS[typeof sp.toast === "string" ? sp.toast : ""];
  const display = user?.username ?? user?.name ?? "Booster";

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <PageToast message={toast} />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="lg:sticky lg:top-20 self-start">
            <BoosterSidebar active="settings" />
          </aside>
          <main className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-extrabold">Settings</h1>
              <Link href="/contact" className="btn btn-gaming h-10 rounded-xl px-5">
                <LifeBuoy className="h-4 w-4" /> Write to admins
              </Link>
            </div>

            <section className="surface flex flex-wrap items-center gap-5 p-5">
              <AvatarUpload initialUrl={user?.image ?? null} initialLetter={display.charAt(0).toUpperCase()} />
              <div className="min-w-0">
                <div className="text-sm text-gray-400">Your photo</div>
                <div className="text-xl font-bold">{display}</div>
                <div className="text-xs text-gray-500">ID: {user?.id}</div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card icon={<UserRound className="h-5 w-5" />} title="Name">
                <p className="text-base text-white">{user?.name || user?.username}</p>
                <Link href="/booster/profile" className="mt-2 inline-block text-sm text-brand-300 hover:text-white">Edit on Profile</Link>
              </Card>

              <Card icon={<Mail className="h-5 w-5" />} title="Email">
                <p className="break-all text-base text-white">{user?.email ?? "-"}</p>
                <Link href="/booster/profile" className="mt-2 inline-block text-sm text-brand-300 hover:text-white">Change email</Link>
              </Card>

              <Card icon={<MessageCircle className="h-5 w-5" />} title="Discord">
                <form action={saveDiscord} className="flex gap-2">
                  <label htmlFor="discord" className="sr-only">Discord username</label>
                  <input
                    id="discord"
                    name="discord"
                    defaultValue={user?.discord ?? ""}
                    placeholder="e.g. arcanepro"
                    maxLength={64}
                    className="min-w-0 flex-1 h-10 rounded-xl border border-white/10 bg-ink-900 px-3 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
                  />
                  <button type="submit" className="btn btn-gaming h-10 min-h-0 rounded-xl px-4">Save</button>
                </form>
                <p className="mt-2 text-xs text-gray-500">Support uses this to reach you about orders.</p>
              </Card>

              <Card icon={<Bell className="h-5 w-5" />} title="Notifications">
                <form action={saveNotify} className="space-y-3">
                  <label htmlFor="notifyNewOrders" className="flex cursor-pointer items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-medium text-white">New orders for my services</span>
                      <span className="block text-xs text-gray-400">Show a counter on Orders when new matching orders arrive.</span>
                    </span>
                    <input id="notifyNewOrders" name="notifyNewOrders" type="checkbox" defaultChecked={user?.notifyNewOrders ?? true} className="toggle toggle-primary" />
                  </label>
                  <button type="submit" className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]">Save</button>
                </form>
              </Card>
            </div>

            <Card icon={<KeyRound className="h-5 w-5" />} title="Password">
              <div className="max-w-md">
                <ChangePasswordForm />
              </div>
            </Card>

            <Link href="/trust-safety" className="surface flex items-center gap-3 p-4 text-sm text-gray-200 hover:text-white">
              <ScrollText className="h-5 w-5 text-brand-300" /> Booster rules and safety
            </Link>
          </main>
        </div>
      </div>
    </div>
  );
}
