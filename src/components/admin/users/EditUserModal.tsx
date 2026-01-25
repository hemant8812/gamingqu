"use client";
import { useRef, useState } from "react";
import { Pencil, XCircle, Save as SaveIcon } from "lucide-react";
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
        className="btn btn-sm btn-square btn-ghost hover:bg-base-300"
        onClick={openModal}
      >
        <Pencil className="h-4 w-4" />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-base-100 text-base-content">
          <h3 className="font-bold text-lg mb-4">Edit User</h3>
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
                  closeModal();
                }
              } catch (e: unknown) {
                const isRedirect =
                  !!e &&
                  typeof e === "object" &&
                  "digest" in (e as Record<string, unknown>) &&
                  String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
                if (isRedirect) {
                  sonnerToast.success("Data berhasil diupdate");
                  closeModal();
                } else {
                  closeModal();
                }
              }
            }}
            className="space-y-4"
          >
            <input type="hidden" name="id" defaultValue={user.id} />
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Name</span>
              </label>
              <input
                name="name"
                type="text"
                defaultValue={user.name ?? ""}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                name="email"
                type="email"
                defaultValue={user.email ?? ""}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <input
                name="username"
                type="text"
                defaultValue={user.username ?? ""}
                required
                placeholder="Masukkan username"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Role</span>
              </label>
              <select
                name="role"
                defaultValue={user.role}
                className="select select-bordered w-full"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="BOOSTER">BOOSTER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text font-semibold">Status</span>
                <div className="flex items-center gap-2">
                    <span className={!suspended ? "text-success text-xs font-bold" : "text-base-content/50 text-xs"}>Active</span>
                    <input 
                        type="checkbox" 
                        checked={suspended}
                        onChange={(e) => setSuspended(e.target.checked)}
                        className="toggle toggle-error" 
                    />
                    <span className={suspended ? "text-error text-xs font-bold" : "text-base-content/50 text-xs"}>Suspended</span>
                </div>
              </label>
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-ghost gap-2" onClick={closeModal}>
                <XCircle className="h-4 w-4" />
                Batal
              </button>
              <button type="submit" className="btn btn-primary gap-2">
                <SaveIcon className="h-4 w-4" />
                Simpan
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
      </dialog>
    </>
  );
}
