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
  SUPERADMIN: "badge badge-error text-white",
  ADMIN: "badge badge-info text-white",
  BOOSTER: "badge badge-success text-white",
  MEMBER: "badge badge-neutral",
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
          className={`btn btn-sm btn-square btn-error text-white ${
            id === myId || role === "SUPERADMIN"
              ? "btn-disabled opacity-50"
              : ""
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
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 opacity-50">
                  Belum ada data user
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="font-mono text-xs opacity-70">{u.id}</td>
                  <td>{u.username ?? "-"}</td>
                  <td>{u.name ?? "-"}</td>
                  <td>{u.email ?? "-"}</td>
                  <td>
                    <span className={getRoleBadgeClass(u.role)}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.isSuspended ? "badge-error" : "badge-ghost"
                      }`}
                    >
                      {u.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="text-xs opacity-70" suppressHydrationWarning>
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td>
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
        <div className="p-4 flex items-center justify-end gap-2 border-t border-base-200">
          <Link
            href={`/admin/users?page=${Math.max(1, page - 1)}${
              q ? `&q=${encodeURIComponent(q)}` : ""
            }`}
            prefetch={false}
            className={`btn btn-sm ${
              page > 1
                ? "btn-outline"
                : "btn-disabled"
            }`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </Link>
          <span className="text-xs opacity-70">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/users?page=${Math.min(totalPages, page + 1)}${
              q ? `&q=${encodeURIComponent(q)}` : ""
            }`}
            prefetch={false}
            className={`btn btn-sm ${
              page < totalPages
                ? "btn-outline"
                : "btn-disabled"
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
          <div className="text-center opacity-50 py-6">Belum ada data user</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="card bg-base-100 shadow-sm border border-base-200 p-4">
              <div className="text-xs opacity-50">ID: {u.id}</div>
              <div className="text-xs opacity-50">Username: {u.username ?? "-"}</div>
              <div className="font-semibold">{u.name ?? "-"}</div>
              <div className="mt-1 text-xs opacity-70">{u.email ?? "-"}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className={getRoleBadgeClass(u.role)}>
                  {getRoleLabel(u.role)}
                </span>
                <span className="text-xs opacity-50" suppressHydrationWarning>
                  {new Date(u.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span
                  className={`badge ${
                    u.isSuspended ? "badge-error" : "badge-ghost"
                  }`}
                >
                  {u.isSuspended ? "Suspended" : "Active"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 justify-end">
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
              className={`btn btn-sm ${
                page > 1
                  ? "btn-outline"
                  : "btn-disabled"
              }`}
              aria-disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Link>
            <span className="text-xs opacity-70">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/admin/users?page=${Math.min(totalPages, page + 1)}${
                q ? `&q=${encodeURIComponent(q)}` : ""
              }`}
              prefetch={false}
              className={`btn btn-sm ${
                page < totalPages
                  ? "btn-outline"
                  : "btn-disabled"
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
