"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Pencil, X, XCircle, Save as SaveIcon } from "lucide-react";

type Role = "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN";

type UserData = {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  role: Role;
};

type Props = {
  user: UserData;
  action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
};

export function EditUserModal({ user, action }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Edit"
          className="inline-flex items-center justify-center rounded-md bg-zinc-800 p-2 hover:bg-zinc-700 text-white"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-xl focus:outline-none text-white">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Edit User</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="rounded-md p-2 hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          {error && (
            <div className="mt-3 rounded-md border border-red-600/30 bg-red-600/15 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          <form
            action={async (fd: FormData) => {
              const res = await action(fd);
              if (!res?.ok) {
                setError(res?.message ?? "Gagal menyimpan perubahan");
                return;
              }
              setError("");
              setOpen(false);
            }}
            className="mt-4 space-y-4"
          >
            <input type="hidden" name="id" defaultValue={user.id} />
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name ?? ""}
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email ?? ""}
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-semibold">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={user.username ?? ""}
                required
                placeholder="Masukkan username"
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-semibold">Role</label>
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="BOOSTER">BOOSTER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800">
                  <XCircle className="h-4 w-4" />
                  <span>Batal</span>
                </button>
              </Dialog.Close>
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                <SaveIcon className="h-4 w-4" />
                <span>Simpan</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
