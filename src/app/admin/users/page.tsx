import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AddUserModal } from "@/components/AddUserModal";
import { EditUserModal } from "@/components/EditUserModal";
import type { Role } from "@/generated/prisma/enums";
import { hash } from "bcrypt";
import { Trash2, Users as UsersIcon, User as UserIcon, Zap as ZapIcon, UserX as UserXIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageToast } from "@/components/PageToast";
import { UsersSearchInput } from "@/components/UsersSearchInput";
import { generateNextUserId } from "@/lib/userId";

const ALLOWED_ROLES: Role[] = ["SUPERADMIN", "ADMIN", "BOOSTER", "MEMBER"];
const ROLE_LABEL: Record<Role, string> = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Admin",
  BOOSTER: "Booster",
  MEMBER: "Member",
};
const ROLE_BADGE_CLASS: Record<Role, string> = {
  SUPERADMIN: "bg-red-600 text-white",
  ADMIN: "bg-blue-600 text-white",
  BOOSTER: "bg-green-600 text-white",
  MEMBER: "bg-zinc-600 text-white",
};

function resolveRole(roleInput: string | null): Role {
  const v = (roleInput ?? "MEMBER") as Role;
  return ALLOWED_ROLES.includes(v) ? v : "MEMBER";
}


export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const pageParam = sp?.page;
  const qParam = sp?.q;
  const toastParam = sp?.toast;
  const toastMessage = typeof toastParam === "string"
    ? (toastParam === "updated" ? "Data berhasil diupdate" : toastParam === "deleted" ? "Data berhasil dihapus" : "Data berhasil disimpan")
    : undefined;
  const page = Math.max(
    1,
    parseInt(
      typeof pageParam === "string" ? pageParam : Array.isArray(pageParam) ? pageParam[0] ?? "1" : "1",
      10
    ) || 1
  );
  const pageSize = 10;
  const rawQ = typeof qParam === "string" ? qParam : Array.isArray(qParam) ? qParam[0] ?? "" : "";
  const q = rawQ.trim().slice(0, 64);
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  async function createUser(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string | null)?.trim() ?? null;
    const email = (formData.get("email") as string | null)?.trim() ?? null;
    const username = (formData.get("username") as string | null)?.trim() ?? "";
    const roleInput = (formData.get("role") as string | null) ?? "MEMBER";
    const rawPassword = (formData.get("password") as string | null) ?? "";
    const suspendedRaw = (formData.get("isSuspended") as string | null) ?? null;
    const password = rawPassword.trim();
    const resolvedRole: Role = resolveRole(roleInput);
    const passwordHash = password ? await hash(password, 10) : undefined;
    const isSuspended = suspendedRaw === "on";
    if (!email) {
      return { ok: false, message: "Email wajib diisi" };
    }
    if (!password || password.length < 8) {
      return { ok: false, message: "Password minimal 8 karakter" };
    }
    if (!username) {
      return { ok: false, message: "Username wajib diisi" };
    }
    const exists = await db.user.findUnique({ where: { email } });
    if (exists) {
      return { ok: false, message: "Email sudah terdaftar" };
    }
    const existsUsername = await db.user.findUnique({ where: { username } });
    if (existsUsername) {
      return { ok: false, message: "Username sudah terpakai" };
    }
    try {
      const customId = await generateNextUserId("GQ", 3);
      await db.user.create({
        data: {
          id: customId,
          name: name ?? undefined,
          email,
          username,
          password: passwordHash,
          role: resolvedRole,
          isSuspended,
        },
      });
      revalidatePath("/admin/users");
      redirect("/admin/users");
    } catch (e: unknown) {
      const isRedirect =
        !!e &&
        typeof e === "object" &&
        "digest" in (e as Record<string, unknown>) &&
        String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
      if (isRedirect) {
        throw e;
      }
      return { ok: false, message: "Terjadi kesalahan saat menyimpan" };
    }
  }
  async function updateUser(formData: FormData) {
    "use server";
    const id = (formData.get("id") as string | null) ?? "";
    const name = (formData.get("name") as string | null)?.trim() ?? null;
    const email = (formData.get("email") as string | null)?.trim() ?? null;
    const username = (formData.get("username") as string | null)?.trim() ?? "";
    const roleInput = (formData.get("role") as string | null) ?? "MEMBER";
    const suspendedRaw = (formData.get("isSuspended") as string | null) ?? null;
    const resolvedRole: Role = resolveRole(roleInput);
    const isSuspended = suspendedRaw === "on";
    if (!id) return { ok: false, message: "ID tidak ditemukan" };
    if (email) {
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== id) {
        return { ok: false, message: "Email sudah terpakai" };
      }
    }
    if (!username) {
      return { ok: false, message: "Username wajib diisi" };
    }
    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername && existingUsername.id !== id) {
      return { ok: false, message: "Username sudah terpakai" };
    }
    try {
      const prev: { isSuspended: boolean } | null = await db.user.findUnique({
        where: { id },
        select: { isSuspended: true },
      });
      await db.user.update({
        where: { id },
        data: {
          name: name ?? undefined,
          email: email ?? undefined,
          username,
          role: resolvedRole,
          isSuspended,
        },
      });
      if (prev && !prev.isSuspended && isSuspended) {
        await db.session.deleteMany({ where: { userId: id } });
      }
      revalidatePath("/admin/users");
      redirect("/admin/users");
    } catch (e: unknown) {
      const isRedirect =
        !!e &&
        typeof e === "object" &&
        "digest" in (e as Record<string, unknown>) &&
        String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
      if (isRedirect) {
        throw e;
      }
      return { ok: false, message: "Gagal menyimpan perubahan" };
    }
  }
  async function deleteUser(formData: FormData) {
    "use server";
    const id = (formData.get("id") as string | null) ?? "";
    const session = await getServerSession(authOptions);
    const myId = session?.user?.id ?? "";
    if (!id) return;
    if (id === myId) return;
    const target = await db.user.findUnique({ where: { id }, select: { role: true } });
    if (target?.role === "SUPERADMIN") return;
    try {
      await db.user.delete({ where: { id } });
      revalidatePath("/admin/users");
      redirect("/admin/users?toast=deleted");
    } catch (e: unknown) {
      const isRedirect =
        !!e &&
        typeof e === "object" &&
        "digest" in (e as Record<string, unknown>) &&
        String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
      if (isRedirect) {
        throw e;
      }
    }
  }
  const where = q
    ? {
        OR: [
          { id: { startsWith: q } },
          { username: { startsWith: q } },
          ...(q.length >= 2 ? [{ username: { contains: q } }] : []),
          // Email: gunakan startsWith agar tidak match domain saat q adalah nama brand,
          // hanya gunakan contains jika q tampak seperti email (mengandung '@' atau '.')
          ...(q.includes("@") || q.includes(".")
            ? [{ email: { contains: q } }]
            : [{ email: { startsWith: q } }]),
        ],
      }
    : undefined;
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    where,
    select: { id: true, username: true, name: true, email: true, role: true, isSuspended: true, createdAt: true },
  });
  const [totalUser, totalMember, totalBooster, totalSuspended] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "MEMBER" } }),
    db.user.count({ where: { role: "BOOSTER" } }),
    db.user.count({ where: { isSuspended: true } }),
  ]);
  const filteredTotal = await db.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const myId = session?.user?.id ?? null;
  const getRoleBadgeClass = (role: Role) => ROLE_BADGE_CLASS[role];
  const getRoleLabel = (role: Role) => ROLE_LABEL[role];
  function DeleteAction({ id, role, myId }: { id: string; role: Role; myId: string | null }) {
    return (
      <form>
        <input type="hidden" name="id" value={id} />
        <button
          aria-label="Delete"
          className={`inline-flex items-center justify-center rounded-md p-2 text-white ${(id === myId || role === "SUPERADMIN") ? "bg-red-600/50 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"}`}
          formAction={deleteUser}
          disabled={id === myId || role === "SUPERADMIN"}
          title={id === myId ? "Tidak bisa menghapus akun sendiri" : (role === "SUPERADMIN" ? "Tidak bisa menghapus SUPERADMIN" : "Hapus")}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} />
        <div className="mb-5">
          <h2 className="text-3xl font-bold">Semua Pengguna</h2>
          <p className="text-sm text-zinc-400">Kelola semua pengguna terdaftar</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="rounded-2xl border-zinc-900 bg-zinc-950 text-white">
            <CardContent className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-300 font-semibold">Total User</div>
                <div className="text-2xl font-bold">{totalUser}</div>
              </div>
              <span className="inline-flex items-center justify-center size-12">
                <UsersIcon className="h-7 w-7 text-blue-400" />
              </span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-zinc-900 bg-zinc-950 text-white">
            <CardContent className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-300 font-semibold">Total Member</div>
                <div className="text-2xl font-bold">{totalMember}</div>
              </div>
              <span className="inline-flex items-center justify-center size-12">
                <UserIcon className="h-7 w-7 text-green-400" />
              </span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-zinc-900 bg-zinc-950 text-white">
            <CardContent className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-300 font-semibold">Total Booster</div>
                <div className="text-2xl font-bold">{totalBooster}</div>
              </div>
              <span className="inline-flex items-center justify-center size-12">
                <ZapIcon className="h-7 w-7 text-orange-400" />
              </span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-zinc-900 bg-zinc-950 text-white">
            <CardContent className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-300 font-semibold">User Suspend</div>
                <div className="text-2xl font-bold">{totalSuspended}</div>
              </div>
              <span className="inline-flex items-center justify-center size-12">
                <UserXIcon className="h-7 w-7 text-red-400" />
              </span>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <AddUserModal action={createUser} />
        </div>
        <div className="mt-6">
          <Card className="rounded-2xl border-zinc-900 overflow-hidden bg-zinc-950 text-white">
            <CardHeader className="border-b border-zinc-900 flex items-center justify-between">
              <CardTitle className="text-white text-lg">Users</CardTitle>
              <UsersSearchInput />
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-900 text-white">
                      <th className="text-left px-4 py-2">ID</th>
                      <th className="text-left px-4 py-2">Username</th>
                      <th className="text-left px-4 py-2">Name</th>
                      <th className="text-left px-4 py-2">Email</th>
                      <th className="text-left px-4 py-2">Role</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">Created</th>
                      <th className="text-left px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-zinc-400">Belum ada data user</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                          <td className="px-4 py-2 text-zinc-300">{u.id}</td>
                          <td className="px-4 py-2 text-zinc-300">{u.username ?? "-"}</td>
                          <td className="px-4 py-2">{u.name ?? "-"}</td>
                          <td className="px-4 py-2">{u.email ?? "-"}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getRoleBadgeClass(u.role)}`}>
                              {getRoleLabel(u.role)}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${u.isSuspended ? "bg-red-600 text-white" : "bg-zinc-700 text-white"}`}>
                              {u.isSuspended ? "Suspended" : "Active"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-zinc-400">
                            {new Date(u.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <EditUserModal user={{ id: u.id, name: u.name, email: u.email, username: u.username, role: u.role, isSuspended: u.isSuspended }} action={updateUser} />
                              <DeleteAction id={u.id} role={u.role} myId={myId} />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="border-t border-zinc-900 p-3 flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/users?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    prefetch={false}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${page > 1 ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"}`}
                    aria-disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </Link>
                  <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
                  <Link
                    href={`/admin/users?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    prefetch={false}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${page < totalPages ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"}`}
                    aria-disabled={page >= totalPages}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              <div className="md:hidden space-y-3 p-3">
                {users.length === 0 ? (
                  <div className="text-center text-zinc-400 py-6">Belum ada data user</div>
                ) : (
                  users.map((u) => (
                    <div key={u.id} className="rounded-sm border border-zinc-900 bg-black p-4">
                      <div className="text-xs text-zinc-400">ID: {u.id}</div>
                      <div className="text-xs text-zinc-400">Username: {u.username ?? "-"}</div>
                      <div className="font-semibold">{u.name ?? "-"}</div>
                      <div className="mt-1 text-xs text-zinc-400">{u.email ?? "-"}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getRoleBadgeClass(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                        <span className="text-xs text-zinc-400">{new Date(u.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${u.isSuspended ? "bg-red-600 text-white" : "bg-zinc-700 text-white"}`}>
                          {u.isSuspended ? "Suspended" : "Active"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <EditUserModal
                          user={{ id: u.id, name: u.name, email: u.email, username: u.username, role: u.role }}
                          action={updateUser}
                        />
                        <DeleteAction id={u.id} role={u.role} myId={myId} />
                      </div>
                    </div>
                  ))
                )}
                {totalPages > 1 && (
                  <div className="pt-3 flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      prefetch={false}
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${page > 1 ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"}`}
                      aria-disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Prev</span>
                    </Link>
                    <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
                    <Link
                      href={`/admin/users?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      prefetch={false}
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${page < totalPages ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"}`}
                      aria-disabled={page >= totalPages}
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
