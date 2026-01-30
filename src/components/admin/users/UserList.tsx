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
  SUPERADMIN: "bg-red-500/20 text-red-400",
  ADMIN: "bg-blue-500/20 text-blue-400",
  BOOSTER: "bg-orange-500/20 text-orange-400",
  MEMBER: "bg-gray-500/20 text-gray-400",
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
          className={`w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ${id === myId || role === "SUPERADMIN"
              ? "opacity-30 cursor-not-allowed"
              : ""
            }`}
          type="submit"
          disabled={id === myId || role === "SUPERADMIN"}
          title={
            id === myId
              ? "Cannot delete your own account"
              : role === "SUPERADMIN"
                ? "Cannot delete SUPERADMIN"
                : "Delete"
          }
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Username</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Email</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Created</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <tr key={u.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{u.id}</td>
                  <td className="px-4 py-3 text-white">{u.username ?? "-"}</td>
                  <td className="px-4 py-3 text-white">{u.name ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${getRoleBadgeClass(u.role)}`}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${u.isSuspended ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                      {u.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500" suppressHydrationWarning>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="hidden md:flex p-4 items-center justify-between border-t border-white/10">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              prefetch={false}
              className={`h-9 px-4 flex items-center gap-2 text-sm font-medium rounded-lg transition-colors ${page > 1
                  ? "bg-white/5 hover:bg-white/10 text-gray-300"
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              aria-disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
            <Link
              href={`/admin/users?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              prefetch={false}
              className={`h-9 px-4 flex items-center gap-2 text-sm font-medium rounded-lg transition-colors ${page < totalPages
                  ? "bg-white/5 hover:bg-white/10 text-gray-300"
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              aria-disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No users found</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="bg-[#0A0E17] rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white font-medium">{u.name ?? "-"}</div>
                  <div className="text-sm text-gray-400">@{u.username ?? "-"}</div>
                </div>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${getRoleBadgeClass(u.role)}`}>
                  {getRoleLabel(u.role)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">{u.email ?? "-"}</div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${u.isSuspended ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                  {u.isSuspended ? "Suspended" : "Active"}
                </span>
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
              </div>
            </div>
          ))
        )}
        {totalPages > 1 && (
          <div className="pt-4 flex items-center justify-center gap-2">
            <Link
              href={`/admin/users?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              prefetch={false}
              className={`h-9 px-4 flex items-center gap-1 text-sm font-medium rounded-lg ${page > 1 ? "bg-white/5 text-gray-300" : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              aria-disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm text-gray-500 px-2">
              {page} / {totalPages}
            </span>
            <Link
              href={`/admin/users?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              prefetch={false}
              className={`h-9 px-4 flex items-center gap-1 text-sm font-medium rounded-lg ${page < totalPages ? "bg-white/5 text-gray-300" : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              aria-disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
