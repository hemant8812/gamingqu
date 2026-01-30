import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/auth";

const baseUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

async function getPermissions() {
  const res = await fetch(`${baseUrl}/api/admin/permissions`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as { id: string; key: string; label: string; enabled: boolean }[];
}

export default async function AdminPermissionsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Only Super Admin can access this page.</p>
        </div>
      </div>
    );
  }
  const list = await getPermissions();

  async function togglePermission(key: string, enabled: boolean) {
    "use server";
    await fetch(`${baseUrl}/api/admin/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
    revalidatePath("/admin/permissions");
  }

  const knownPanels = [
    { key: "users", label: "Users" },
    { key: "boosters", label: "Boosters" },
    { key: "orders", label: "Orders" },
    { key: "analytics", label: "Analytics" },
    { key: "games", label: "Games" },
    { key: "categories", label: "Categories" },
    { key: "services", label: "Services" },
    { key: "blog", label: "Blog" },
    { key: "benner", label: "Banners" },
    { key: "settings", label: "Settings" },
  ];

  const map = new Map(list.map((p) => [p.key, p.enabled]));

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
                action={togglePermission.bind(null, p.key, !enabled)}
                className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-blue-500/30 transition-colors"
              >
                <div>
                  <div className="font-bold text-white">{p.label}</div>
                  <div className="text-sm text-gray-500">key: {p.key}</div>
                </div>
                <button
                  type="submit"
                  aria-pressed={enabled}
                  className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-700"} focus:outline-none`}
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
