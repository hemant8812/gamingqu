"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Pencil, X, XCircle, Save as SaveIcon } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { Switch } from "@/components/ui/switch";

type Role = "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN";

type UserData = {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  role: Role;
  isSuspended?: boolean;
};

type Props = {
  user: UserData;
  action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
};

export function EditUserModal({ user, action }: Props) {
  const [open, setOpen] = useState(false);
  const [suspended, setSuspended] = useState<boolean>(Boolean(user.isSuspended));
  const handleOpenChange = (v: boolean) => {
    setOpen(v);
  };
  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
          <form
            action={async (fd: FormData) => {
              try {
                if (suspended) {
                  fd.set("isSuspended", "on");
                } else {
                  fd.delete("isSuspended");
                }
                const res = await action(fd);
                const ok = res?.ok ?? true;
                if (!ok) {
                  const msg = res.message ?? "Gagal menyimpan perubahan";
                  sonnerToast.error(msg);
                } else {
                  sonnerToast.success("Data berhasil diupdate");
                  setOpen(false);
                }
              } catch (e: unknown) {
                const isRedirect =
                  !!e &&
                  typeof e === "object" &&
                  "digest" in (e as Record<string, unknown>) &&
                  String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
                if (isRedirect) {
                  sonnerToast.success("Data berhasil diupdate");
                  setOpen(false);
                } else {
                  setOpen(false);
                }
              }
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
            <div className="flex items-center justify-between">
              <label htmlFor="isSuspendedToggle" className="text-sm font-semibold">Status</label>
              <div className="flex items-center gap-2">
                <span className={suspended ? "text-zinc-500 text-xs" : "text-green-500 text-xs font-medium"}>Aktif</span>
                <Switch
                  id="isSuspendedToggle"
                  checked={suspended}
                  onCheckedChange={setSuspended}
                  aria-label="Suspended toggle"
                  className="data-[state=checked]:bg-red-600"
                />
                <span className={suspended ? "text-red-500 text-xs font-medium" : "text-zinc-500 text-xs"}>Nonaktif</span>
              </div>
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
