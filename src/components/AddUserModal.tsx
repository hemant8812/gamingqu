"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { UserPlus, X, XCircle, Save as SaveIcon } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { Switch } from "@/components/ui/switch";

type Props = {
  action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
};

export function AddUserModal({ action }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [suspended, setSuspended] = useState(false);
  useEffect(() => {
    if (open) setError("");
  }, [open]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 hover:bg-blue-500 text-white"
        >
          <UserPlus className="h-5 w-5" />
          <span className="text-sm font-semibold">Add User</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-xl focus:outline-none text-white">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Tambah User</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="rounded-md p-2 hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          <form
            action={async (fd: FormData) => {
              try {
                const res = await action(fd);
                const isResultObject = !!res && typeof res === "object" && "ok" in (res as any);
                if (!isResultObject || (res as any).ok) {
                  setError("");
                  sonnerToast.success("Data berhasil disimpan");
                  setOpen(false);
                  return;
                }
                const msg = res?.message ?? "Gagal menyimpan data";
                setError(msg);
                sonnerToast.error(msg);
              } catch (e: any) {
                const isRedirect = e && typeof e === "object" && "digest" in e && String(e.digest).includes("NEXT_REDIRECT");
                if (isRedirect) {
                  setError("");
                  sonnerToast.success("Data berhasil disimpan");
                  setOpen(false);
                } else {
                  setError("");
                  setOpen(false);
                }
              }
            }}
            className="mt-4 space-y-4"
          >
            {suspended && <input type="hidden" name="isSuspended" value="on" />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Nama lengkap"
                  className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="user@example.com"
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Minimal 8 karakter"
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-semibold">Role</label>
              <select
                id="role"
                name="role"
                defaultValue="MEMBER"
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="BOOSTER">BOOSTER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="isSuspendedToggle" className="text-sm text-zinc-300">
                Suspended
              </label>
              <Switch
                id="isSuspendedToggle"
                checked={suspended}
                onCheckedChange={setSuspended}
                aria-label="Suspended toggle"
                className="data-[state=checked]:bg-red-600"
              />
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
