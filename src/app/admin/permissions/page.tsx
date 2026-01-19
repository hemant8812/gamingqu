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
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
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
  ];

  const map = new Map(list.map((p) => [p.key, p.enabled]));

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Admin Permissions</h1>
        <p className="mt-2 text-zinc-400">Aktifkan panel yang boleh diakses oleh Admin.</p>
        <div className="mt-6 space-y-4">
          {knownPanels.map((p) => {
            const enabled = map.get(p.key) ?? false;
            return (
              <form
                key={p.key}
                action={togglePermission.bind(null, p.key, !enabled)}
                className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4"
              >
                <div>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-sm text-zinc-400">key: {p.key}</div>
                </div>
                <button
                  type="submit"
                  aria-pressed={enabled}
                  className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${enabled ? "bg-purple-600" : "bg-zinc-800"} focus:outline-none ring-0 border-0`}
                >
                  <span className={`absolute left-[2px] top-1/2 -translate-y-1/2 size-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-[calc(100%-4px)]" : "translate-x-0"}`} />
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
