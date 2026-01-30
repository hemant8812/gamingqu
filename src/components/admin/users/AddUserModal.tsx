"use client";
import { useRef } from "react";
import { UserPlus, X, Save as SaveIcon } from "lucide-react";
import { toast as sonnerToast } from "sonner";

type Props = {
  action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
};

export function AddUserModal({ action }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors"
        onClick={openModal}
      >
        <UserPlus className="h-4 w-4" />
        Add User
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-[#0F172A] border-0 text-white rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Add New User</h3>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <form
            action={async (fd: FormData) => {
              try {
                const res = await action(fd);
                const ok = res?.ok ?? true;
                if (!ok) {
                  const msg = res.message ?? "Failed to save data";
                  sonnerToast.error(msg);
                } else {
                  sonnerToast.success("Data saved successfully");
                  closeModal();
                }
              } catch (e: unknown) {
                const isRedirect =
                  !!e &&
                  typeof e === "object" &&
                  "digest" in (e as Record<string, unknown>) &&
                  String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
                if (isRedirect) {
                  sonnerToast.success("Data saved successfully");
                  closeModal();
                } else {
                  closeModal();
                }
              }
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full name"
                  className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  name="username"
                  type="text"
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
                required
                placeholder="user@example.com"
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Minimum 8 characters"
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                name="role"
                defaultValue="MEMBER"
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="BOOSTER">BOOSTER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isSuspended" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
              <span className="text-sm text-gray-300">Suspend Account</span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="h-11 px-5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors">
                <SaveIcon className="h-4 w-4" />
                Save
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
