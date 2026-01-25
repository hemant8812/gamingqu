import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AddUserModal } from "@/components/admin/users/AddUserModal";
import type { Role } from "@/generated/prisma/enums";
import { hash } from "bcrypt";
import { Users as UsersIcon, User as UserIcon, Zap as ZapIcon, UserX as UserXIcon } from "lucide-react";
import { PageToast } from "@/components/shared/PageToast";
import { UsersSearchInput } from "@/components/admin/users/UsersSearchInput";
import { generateNextUserId } from "@/lib/userId";
import { UserList } from "@/components/admin/users/UserList";

const ALLOWED_ROLES: Role[] = ["SUPERADMIN", "ADMIN", "BOOSTER", "MEMBER"];

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
              <UserList
                users={users}
                totalPages={totalPages}
                page={page}
                q={q}
                myId={myId}
                updateUserAction={updateUser}
                deleteUserAction={deleteUser}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
