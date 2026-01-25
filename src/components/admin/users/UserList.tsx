"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { EditUserModal } from "@/components/admin/users/EditUserModal";
import type { Role } from "@/generated/prisma/enums";

type User = {
  id: string;
  username: string | null;
  name: string | null;
  email: string | null;
  role: Role;
  isSuspended: boolean;
  createdAt: Date;
};

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

export function UserList({
  users,
  totalPages,
  page,
  q,
  myId,
  updateUserAction,
  deleteUserAction,
}: {
  users: User[];
  totalPages: number;
  page: number;
  q: string;
  myId: string | null;
  updateUserAction: (formData: FormData) => Promise<{ ok: boolean; message: string } | undefined>;
  deleteUserAction: (formData: FormData) => Promise<void>;
}) {
  const getRoleBadgeClass = (role: Role) => ROLE_BADGE_CLASS[role];
  const getRoleLabel = (role: Role) => ROLE_LABEL[role];
  const updateWrapper = async (formData: FormData): Promise<{ ok: boolean; message?: string }> => {
    const res = await updateUserAction(formData);
    return res ?? { ok: true };
  };

  function DeleteAction({ id, role }: { id: string; role: Role }) {
    return (
      <form action={deleteUserAction}>
        <input type="hidden" name="id" value={id} />
        <button
          aria-label="Delete"
          className={`inline-flex items-center justify-center rounded-md p-2 text-white ${
            id === myId || role === "SUPERADMIN"
              ? "bg-red-600/50 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500"
          }`}
          type="submit"
          disabled={id === myId || role === "SUPERADMIN"}
          title={
            id === myId
              ? "Tidak bisa menghapus akun sendiri"
              : role === "SUPERADMIN"
              ? "Tidak bisa menghapus SUPERADMIN"
              : "Hapus"
          }
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <>
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
                <td colSpan={8} className="px-4 py-10 text-center text-zinc-400">
                  Belum ada data user
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                  <td className="px-4 py-2 text-zinc-300">{u.id}</td>
                  <td className="px-4 py-2 text-zinc-300">{u.username ?? "-"}</td>
                  <td className="px-4 py-2">{u.name ?? "-"}</td>
                  <td className="px-4 py-2">{u.email ?? "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getRoleBadgeClass(
                        u.role
                      )}`}
                    >
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                        u.isSuspended ? "bg-red-600 text-white" : "bg-zinc-700 text-white"
                      }`}
                    >
                      {u.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-400">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <EditUserModal
                        user={{
                          id: u.id,
                          name: u.name,
                          email: u.email,
                          username: u.username,
                          role: u.role,
                          isSuspended: u.isSuspended,
                        }}
                        action={updateWrapper}
                      />
                      <DeleteAction id={u.id} role={u.role} />
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
            href={`/admin/users?page=${Math.max(1, page - 1)}${
              q ? `&q=${encodeURIComponent(q)}` : ""
            }`}
            prefetch={false}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${
              page > 1
                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
            }`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </Link>
          <span className="text-xs text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/users?page=${Math.min(totalPages, page + 1)}${
              q ? `&q=${encodeURIComponent(q)}` : ""
            }`}
            prefetch={false}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${
              page < totalPages
                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
            }`}
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
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getRoleBadgeClass(
                    u.role
                  )}`}
                >
                  {getRoleLabel(u.role)}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(u.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                    u.isSuspended ? "bg-red-600 text-white" : "bg-zinc-700 text-white"
                  }`}
                >
                  {u.isSuspended ? "Suspended" : "Active"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <EditUserModal
                  user={{
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    username: u.username,
                    role: u.role,
                  }}
                  action={updateWrapper}
                />
                <DeleteAction id={u.id} role={u.role} />
              </div>
            </div>
          ))
        )}
        {totalPages > 1 && (
          <div className="pt-3 flex items-center justify-end gap-2">
            <Link
              href={`/admin/users?page=${Math.max(1, page - 1)}${
                q ? `&q=${encodeURIComponent(q)}` : ""
              }`}
              prefetch={false}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${
                page > 1
                  ? "bg-zinc-800 text-white hover:bg-zinc-700"
                  : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
              }`}
              aria-disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Link>
            <span className="text-xs text-zinc-400">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/admin/users?page=${Math.min(totalPages, page + 1)}${
                q ? `&q=${encodeURIComponent(q)}` : ""
              }`}
              prefetch={false}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm ${
                page < totalPages
                  ? "bg-zinc-800 text-white hover:bg-zinc-700"
                  : "bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
              }`}
              aria-disabled={page >= totalPages}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
