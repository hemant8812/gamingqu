import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

// Read straight from the database: a server-side fetch to /api/admin/permissions
// carries no session cookie, so the API answered 403 and every toggle showed "off".
async function getPermissions() {
  try {
    return await db.adminPermission.findMany({ orderBy: { key: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminPermissionsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Only Super Admin can access this page.</p>
        </div>
      </div>
    );
  }
  const list = await getPermissions();

  async function togglePermission(key: string, label: string, enabled: boolean) {
    "use server";
    // Server actions are callable directly, so check the role here too.
    const current = await getServerSession(authOptions);
    if (current?.user?.role !== "SUPERADMIN") return;
    await db.adminPermission.upsert({
      where: { key },
      update: { enabled },
      create: { key, label, enabled },
    });
    revalidatePath("/admin/permissions");
    revalidatePath("/admin", "layout");
  }

  const knownPanels = [
    { key: "users", label: "Users" },
    { key: "boosters", label: "Boosters" },
    { key: "orders", label: "Orders" },
    { key: "analytics", label: "Analytics" },
    { key: "games", label: "Games" },
    { key: "categories", label: "Categories" },
    { key: "services", label: "Services" },
    { key: "payment-method", label: "Payment Method" },
    { key: "blog", label: "Blog" },
    { key: "benner", label: "Banners" },
    { key: "settings", label: "Settings" },
  ];

  const map = new Map(list.map((p) => [p.key, p.enabled]));

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Permissions</h1>
          <p className="text-gray-400">Enable panels that can be accessed by Admin users</p>
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knownPanels.map((p) => {
            const enabled = map.get(p.key) ?? false;
            return (
              <form
                key={p.key}
                action={togglePermission.bind(null, p.key, p.label, !enabled)}
                className="bg-ink-800 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-brand-500/30 transition-colors"
              >
                <div>
                  <div className="font-bold text-white">{p.label}</div>
                  <div className="text-sm text-gray-500">key: {p.key}</div>
                </div>
                <button
                  type="submit"
                  aria-pressed={enabled}
                  className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors ${enabled ? "bg-brand-600" : "bg-gray-700"} focus:outline-none`}
                >
                  <span className={`absolute left-1 top-1/2 -translate-y-1/2 size-5 rounded-full bg-white transition-transform shadow ${enabled ? "translate-x-5" : "translate-x-0"}`} />
                  <span className="sr-only">{enabled ? "Enabled" : "Disabled"}</span>
                </button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
