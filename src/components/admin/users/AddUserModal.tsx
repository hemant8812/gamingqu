"use client";
import { useRef } from "react";
import { UserPlus, XCircle, Save as SaveIcon } from "lucide-react";
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
        className="btn btn-primary btn-sm gap-2"
        onClick={openModal}
      >
        <UserPlus className="h-4 w-4" />
        Add User
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-base-100 text-base-content">
          <h3 className="font-bold text-lg mb-4">Tambah User</h3>
          <form
            action={async (fd: FormData) => {
              try {
                const res = await action(fd);
                const ok = res?.ok ?? true;
                if (!ok) {
                  const msg = res.message ?? "Gagal menyimpan data";
                  sonnerToast.error(msg);
                } else {
                  sonnerToast.success("Data berhasil disimpan");
                  closeModal();
                }
              } catch (e: unknown) {
                const isRedirect =
                  !!e &&
                  typeof e === "object" &&
                  "digest" in (e as Record<string, unknown>) &&
                  String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
                if (isRedirect) {
                  sonnerToast.success("Data berhasil disimpan");
                  closeModal();
                } else {
                  closeModal();
                }
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Nama lengkap"
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
                  required
                  placeholder="Masukkan username"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="user@example.com"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Minimal 8 karakter"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Role</span>
              </label>
              <select
                name="role"
                defaultValue="MEMBER"
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
                <span className="label-text font-semibold">Suspend Account?</span>
                <input 
                    type="checkbox" 
                    name="isSuspended" 
                    className="toggle toggle-error" 
                />
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
