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

export default async function SuperAdminPermissionsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
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
    revalidatePath("/super-admin/permissions");
    revalidatePath("/admin", "layout");
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
              action={togglePermission.bind(null, p.key, p.label, !enabled)}
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
  );
}
