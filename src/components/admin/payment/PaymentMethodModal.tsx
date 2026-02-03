"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { Save as SaveIcon, X } from "lucide-react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
import { ImageUploadField } from "@/components/shared/ImageUploadField";

export function PaymentMethodModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [initial, setInitial] = useState<{
    id: number;
    name: string;
    slug: string;
    iconUrl: string | null;
    feePercent: number | null;
    feeFixed: number | null;
    isActive: boolean;
    sortOrder: number;
  } | null>(null);

  const isCreate = searchParams.has("create");
  const editIdStr = searchParams.get("edit");
  const editId = editIdStr ? Number(editIdStr) : null;
  const isEdit = Number.isFinite(editId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open && (isCreate || isEdit)) {
      const url = new URL(window.location.href);
      url.searchParams.delete("create");
      url.searchParams.delete("edit");
      window.history.replaceState(null, "", url.toString());
    }
  }, [isCreate, isEdit]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isCreate) {
      if (!dialog.open) dialog.showModal();
      setBusy(false);
      try {
        formRef.current?.reset();
      } catch {}
      setFormKey((k) => k + 1);
    } else if (isEdit) {
      (async () => {
        try {
          const res = await fetch("/api/admin/payment-method", { cache: "no-store" });
          const list = await res.json() as Array<{
            id: number;
            name: string;
            slug: string;
            iconUrl?: string | null;
            feePercent?: number | string | null;
            feeFixed?: number | string | null;
            isActive: boolean;
            sortOrder: number;
          }>;
          const found = Array.isArray(list) ? list.find((m) => m.id === editId) : null;
          if (found) {
            setInitial({
              id: found.id,
              name: found.name,
              slug: found.slug,
              iconUrl: found.iconUrl ?? null,
              feePercent: found.feePercent != null ? Number.parseFloat(found.feePercent.toString()) : null,
              feeFixed: found.feeFixed != null ? Number.parseFloat(found.feeFixed.toString()) : null,
              isActive: !!found.isActive,
              sortOrder: Number(found.sortOrder ?? 0),
            });
          } else {
            setInitial(null);
          }
        } catch {
          setInitial(null);
        } finally {
          if (!dialog.open) dialog.showModal();
          setBusy(false);
          setFormKey((k) => k + 1);
        }
      })();
    } else if (dialog.open) {
      dialog.close();
      setBusy(false);
      setFormKey((k) => k + 1);
    }
  }, [isCreate, isEdit, editId]);

  const closeModal = () => {
    setBusy(false);
    try {
      formRef.current?.reset();
    } catch {}
    router.replace("/admin/payment-method");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (isEdit && editId) {
        fd.set("id", String(editId));
      }
      const res = await fetch("/api/admin/payment-method", { method: isEdit ? "PUT" : "POST", body: fd });
      if (!res.ok) {
        setBusy(false);
        return;
      }
      setBusy(false);
      try {
        formRef.current?.reset();
      } catch {}
      router.push(isEdit ? "/admin/payment-method?toast=updated" : "/admin/payment-method?toast=saved");
    } catch {
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box w-11/12 max-w-3xl bg-[#0F172A] border-0 text-white p-0 max-height-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 z-10 bg-[#0F172A]/95 backdrop-blur-sm">
          <h3 className="text-xl font-bold">{isEdit ? "Edit Payment Method" : "Add Payment Method"}</h3>
          <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form ref={formRef} key={formKey} onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Card"
              className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              defaultValue={isEdit && initial ? initial.name : undefined}
            />
            <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={isEdit && initial ? initial.slug : ""} />
          </div>

          <ImageUploadField id="icon" name="icon" label="Icon" previewHeight={160} initialUrl={isEdit && initial ? initial.iconUrl : null} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="feeType" className="block text-sm font-medium text-gray-300 mb-2">Fee Type</label>
              <select
                id="feeType"
                name="feeType"
                defaultValue={
                  isEdit
                    ? initial?.feePercent != null
                      ? "percent"
                      : initial?.feeFixed != null
                        ? "fixed"
                        : "percent"
                    : "percent"
                }
                className="w-full h-11 px-3 bg-[#0A0E17] border-0 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label htmlFor="feeValue" className="block text-sm font-medium text-gray-300 mb-2">Fee Value</label>
              <input
                id="feeValue"
                name="feeValue"
                type="number"
                step="0.001"
                placeholder="2.900"
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                defaultValue={
                  isEdit
                    ? initial?.feePercent != null
                      ? Number(initial.feePercent)
                      : initial?.feeFixed != null
                        ? Number(initial.feeFixed)
                        : undefined
                    : undefined
                }
              />
            </div>
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-300 mb-2">Order</label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                placeholder="0"
                className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                defaultValue={isEdit && initial ? initial.sortOrder : undefined}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#0A0E17] rounded-xl">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="sr-only peer"
                defaultChecked={isEdit ? !!initial?.isActive : true}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span className="text-sm text-gray-300">Active</span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={closeModal} className="h-11 px-5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={busy}
            >
              {busy && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              <SaveIcon className="h-4 w-4" />
              <span>{isEdit ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/60">
        <button>close</button>
      </form>
    </dialog>
  );
}
