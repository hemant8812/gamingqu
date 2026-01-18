import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function getPermissions() {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/admin/permissions`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as { id: string; key: string; label: string; enabled: boolean }[];
}

export default async function SuperAdminPermissionsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  const list = await getPermissions();

  async function togglePermission(key: string, enabled: boolean) {
    "use server";
    await fetch("/api/admin/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
  }

  const knownPanels = [
    { key: "users", label: "Users" },
    { key: "boosters", label: "Boosters" },
    { key: "orders", label: "Orders" },
    { key: "analytics", label: "Analytics" },
  ];

  const map = new Map(list.map((p) => [p.key, p.enabled]));

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Pengaturan Izin Admin</h1>
      <p className="mt-2 text-zinc-400">
        Aktifkan panel yang boleh diakses oleh role Admin.
      </p>
      <div className="mt-6 space-y-4">
        {knownPanels.map((p) => {
          const enabled = map.get(p.key) ?? false;
          return (
            <form
              key={p.key}
              action={async () => {
                await togglePermission(p.key, !enabled);
              }}
              className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4"
            >
              <div>
                <div className="font-medium">{p.label}</div>
                <div className="text-sm text-zinc-400">key: {p.key}</div>
              </div>
              <button
                type="submit"
                className={`rounded-full px-4 py-2 text-sm ${enabled ? "bg-purple-600" : "bg-zinc-800"} hover:bg-purple-500`}
              >
                {enabled ? "Enabled" : "Disabled"}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
