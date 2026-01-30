"use client";
import { useRef, useState } from "react";
import { Pencil, X, Save as SaveIcon } from "lucide-react";
import { toast as sonnerToast } from "sonner";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [suspended, setSuspended] = useState<boolean>(Boolean(user.isSuspended));

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        aria-label="Edit"
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        onClick={openModal}
      >
        <Pencil className="h-4 w-4" />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-[#0F172A] border-0 text-white rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Edit User</h3>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
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
                  const msg = res.message ?? "Failed to save changes";
                  sonnerToast.error(msg);
                } else {
                  sonnerToast.success("Data updated successfully");
                  closeModal();
                }
              } catch (e: unknown) {
                const isRedirect =
                  !!e &&
                  typeof e === "object" &&
                  "digest" in (e as Record<string, unknown>) &&
                  String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
                if (isRedirect) {
                  sonnerToast.success("Data updated successfully");
                  closeModal();
                } else {
                  closeModal();
                }
              }
            }}
            className="space-y-5"
          >
            <input type="hidden" name="id" defaultValue={user.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={user.name ?? ""}
                  className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  name="username"
                  type="text"
                  defaultValue={user.username ?? ""}
                  required
                  placeholder="Enter username"
                  className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={user.email ?? ""}
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                name="role"
                defaultValue={user.role}
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="BOOSTER">BOOSTER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0A0E17] rounded-xl">
              <div>
                <span className="text-sm font-medium text-gray-300">Account Status</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {suspended ? "This account is suspended" : "This account is active"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${!suspended ? "text-emerald-400" : "text-gray-500"}`}>Active</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suspended}
                    onChange={(e) => setSuspended(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
                <span className={`text-xs font-medium ${suspended ? "text-red-400" : "text-gray-500"}`}>Suspended</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="h-11 px-5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors">
                <SaveIcon className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
