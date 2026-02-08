import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AddUserModal } from "@/components/admin/users/AddUserModal";
import type { Role } from "@/generated/prisma/enums";
import { hash } from "bcrypt";
import { Users as UsersIcon, User as UserIcon, Zap as ZapIcon, UserX as UserXIcon } from "lucide-react";
import { PageToast } from "@/components/shared/PageToast";
import { UsersSearchInput } from "@/components/admin/users/UsersSearchInput";
import { generateRandomUserId } from "@/lib/userId";
import { UserList } from "@/components/admin/users/UserList";
import { normalizeQuery, parseToast, getParamStr } from "@/lib/page-utils";

const ALLOWED_ROLES: Role[] = ["SUPERADMIN", "ADMIN", "BOOSTER", "MEMBER"];

function resolveRole(roleInput: string | null): Role {
  const v = (roleInput ?? "MEMBER") as Role;
  return ALLOWED_ROLES.includes(v) ? v : "MEMBER";
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast
    ? toast === "updated"
      ? "Data berhasil diupdate"
      : toast === "deleted"
        ? "Data berhasil dihapus"
        : "Data berhasil disimpan"
    : undefined;
  const pageStr = getParamStr(sp, "page") ?? "1";
  const pageNum = parseInt(pageStr, 10);
  const page = Math.max(1, Number.isFinite(pageNum) ? pageNum : 1);
  const pageSize = 10;
  const q = normalizeQuery(sp, "q", 64);
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
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
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return { ok: false, message: "Password harus mengandung huruf dan angka" };
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
      const customId = await generateRandomUserId("G", 4);
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
    <div className="min-h-screen bg-[#0A0E17] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} type={toastType} />

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">All Users</h2>
          <p className="text-gray-400">Manage all registered users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{totalUser}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <UsersIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Members</p>
                <p className="text-3xl font-bold text-white">{totalMember}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <UserIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Boosters</p>
                <p className="text-3xl font-bold text-white">{totalBooster}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <ZapIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Suspended</p>
                <p className="text-3xl font-bold text-white">{totalSuspended}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                <UserXIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <AddUserModal action={createUser} />
        </div>

        {/* Users Table Card */}
        <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Users</h3>
            <UsersSearchInput />
          </div>
          <UserList
            users={users}
            totalPages={totalPages}
            page={page}
            q={q}
            myId={myId}
            updateUserAction={updateUser}
            deleteUserAction={deleteUser}
          />
        </div>
      </div>
    </div>
  );
}
