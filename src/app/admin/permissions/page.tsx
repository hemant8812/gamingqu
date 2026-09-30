import Link from "next/link";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { ADMIN_SECTIONS, ALL_ADMIN_SECTION_KEYS, getAdminPermissionKeys, type AdminSectionKey } from "@/lib/adminAccess";
import { FiCheck, FiShield, FiUser } from "react-icons/fi";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function requireSuperAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "SUPERADMIN";
}

// Save a full per-admin set the first time a super admin edits this admin,
// so switching one section does not drop the ones they had from the defaults.
async function ensureOwnPermissions(userId: string) {
  const count = await db.adminUserPermission.count({ where: { userId } });
  if (count > 0) return;
  const { allowed } = await getAdminPermissionKeys(userId);
  await db.adminUserPermission.createMany({
    data: ALL_ADMIN_SECTION_KEYS.map((key) => ({ userId, key, enabled: allowed.has(key) })),
    skipDuplicates: true,
  });
}

async function isAdminAccount(userId: string) {
  const target = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  return target?.role === "ADMIN";
}

function refresh() {
  revalidatePath("/admin/permissions");
  revalidatePath("/admin", "layout");
}

export default async function AdminPermissionsPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await requireSuperAdmin())) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Only Super Admin can access this page.</p>
        </div>
      </div>
    );
  }

  async function toggleSection(userId: string, key: AdminSectionKey, enabled: boolean) {
    "use server";
    if (!(await requireSuperAdmin()) || !(await isAdminAccount(userId))) return;
    await ensureOwnPermissions(userId);
    await db.adminUserPermission.upsert({
      where: { userId_key: { userId, key } },
      update: { enabled },
      create: { userId, key, enabled },
    });
    refresh();
  }

  async function setAllSections(userId: string, enabled: boolean) {
    "use server";
    if (!(await requireSuperAdmin()) || !(await isAdminAccount(userId))) return;
    await db.$transaction(
      ALL_ADMIN_SECTION_KEYS.map((key) =>
        db.adminUserPermission.upsert({
          where: { userId_key: { userId, key } },
          update: { enabled },
          create: { userId, key, enabled },
        })
      )
    );
    refresh();
  }

  const sp = await searchParams;
  const requested = typeof sp.admin === "string" ? sp.admin : undefined;

  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, name: true, email: true, isSuspended: true },
  });
  const selected = admins.find((a) => a.id === requested) ?? admins[0] ?? null;

  const counts = new Map<string, number>();
  for (const a of admins) {
    const { allowed } = await getAdminPermissionKeys(a.id);
    counts.set(a.id, [...allowed].filter((k) => (ALL_ADMIN_SECTION_KEYS as string[]).includes(k)).length);
  }
  const current = selected ? await getAdminPermissionKeys(selected.id) : null;
  const total = ALL_ADMIN_SECTION_KEYS.length;

  return (
    <div className="min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-2 py-8 sm:px-6">
        <div className="mb-6">
          <div className="eyebrow mb-2">Super admin</div>
          <h1 className="text-3xl font-bold text-white">Admin Permissions</h1>
          <p className="mt-1 text-gray-400">
            Choose an admin account, then switch on the sections that account may see and use. Each admin can have a different set.
          </p>
        </div>

        {admins.length === 0 ? (
          <div className="surface p-10 text-center">
            <FiUser className="mx-auto mb-4 h-10 w-10 text-gray-500" />
            <h2 className="text-lg font-bold text-white">No admin accounts yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
              Give a user the Admin role on the{" "}
              <Link href="/admin/users" className="text-brand-300 underline">Users</Link> page, then come back here to choose their sections.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Admin accounts */}
            <nav className="surface h-fit p-3" aria-label="Admin accounts">
              <div className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Admin accounts</div>
              <ul className="space-y-1">
                {admins.map((a) => {
                  const active = a.id === selected?.id;
                  const display = a.username || a.name || a.email || a.id;
                  return (
                    <li key={a.id}>
                      <Link
                        href={`/admin/permissions?admin=${encodeURIComponent(a.id)}`}
                        aria-current={active ? "page" : undefined}
                        className={`panel-link ${active ? "panel-link-active" : ""}`}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-brand-600 text-xs font-bold uppercase text-white">
                          {display.slice(0, 1)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-white">{display}</span>
                          <span className="block truncate text-xs text-gray-500">{a.email}</span>
                        </span>
                        <span className="shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-300">
                          {counts.get(a.id) ?? 0}/{total}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sections for the selected admin */}
            {selected && current && (
              <section className="min-w-0">
                <div className="surface mb-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-bold text-white">{selected.username || selected.name || selected.email}</h2>
                      {current.hasOwnPermissions ? (
                        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-semibold text-brand-200 ring-1 ring-brand-400/30">Custom</span>
                      ) : (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-200 ring-1 ring-amber-400/30">Using shared defaults</span>
                      )}
                      {selected.isSuspended && (
                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-200 ring-1 ring-red-400/30">Suspended</span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-400">{selected.email}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <form action={setAllSections.bind(null, selected.id, true)}>
                      <button type="submit" className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]">
                        Allow all
                      </button>
                    </form>
                    <form action={setAllSections.bind(null, selected.id, false)}>
                      <button type="submit" className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]">
                        Remove all
                      </button>
                    </form>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {ADMIN_SECTIONS.map((p) => {
                    const enabled = current.allowed.has(p.key);
                    return (
                      <form
                        key={p.key}
                        action={toggleSection.bind(null, selected.id, p.key, !enabled)}
                        className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${
                          enabled ? "border-brand-500/40 bg-brand-500/[0.07]" : "border-white/10 bg-ink-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 font-semibold text-white">
                            {enabled && <FiCheck className="h-4 w-4 text-lime-glow" />}
                            {p.label}
                          </div>
                          <div className="text-xs text-gray-500">{p.href}</div>
                        </div>
                        <button
                          type="submit"
                          role="switch"
                          aria-checked={enabled}
                          aria-label={`${enabled ? "Remove" : "Allow"} ${p.label} for this admin`}
                          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                            enabled ? "bg-brand-600" : "bg-gray-700"
                          }`}
                        >
                          <span
                            className={`absolute left-1 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform ${
                              enabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </form>
                    );
                  })}
                </div>

                <p className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                  <FiShield className="mt-0.5 h-4 w-4 shrink-0" />
                  The Dashboard is always visible. Only super admins can open this page, and only super admins can create or change admin accounts.
                </p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
