"use client";

import React from "react";
import { AlertTriangle, Trash2, X, Pencil } from "lucide-react";

type ServiceOption = { id: number; name: string; slug: string; price: string };

type DetailItem = {
  id: number;
  serviceId: number;
  serviceName: string;
  title: string;
  fieldName: string;
  inputType: "select" | "radio" | "range" | "checkbox" | "input";
  displayType?: "number" | "text" | "dual" | "single";
  priceType: "fixed" | "percent";
  price: number;
  sortOrder?: number;
  options?: Array<{ label: string; price: number }>;
  range?: { min: number; max: number; step?: number; dual?: boolean };
  inputMeta?: { kind: "text" | "number"; min?: number; max?: number };
};

export function ServiceDataManager({ services }: { services: ServiceOption[] }) {
  const [items, setItems] = React.useState<DetailItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [optName, setOptName] = React.useState("");
  const [optPrice, setOptPrice] = React.useState<number | "">("");
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const confirmDialogRef = React.useRef<HTMLDialogElement>(null);
  const [selectedSid, setSelectedSid] = React.useState<number | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const [form, setForm] = React.useState<Partial<DetailItem>>({
    priceType: "fixed",
    price: 0,
    sortOrder: 0,
  });

  const load = async () => {
    try {
      const res = await fetch("/api/admin/service-details", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch { }
  };

  React.useEffect(() => { load(); }, []);
  React.useEffect(() => {
    if (selectedSid == null && services.length > 0) {
      setSelectedSid(services[0].id);
    }
  }, [services, selectedSid]);

  React.useEffect(() => {
    if (deleteId) {
      confirmDialogRef.current?.showModal();
    } else {
      confirmDialogRef.current?.close();
    }
  }, [deleteId]);

  const onChange = (patch: Partial<DetailItem>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  const addOption = () => {
    const l = optName.trim();
    const p = typeof optPrice === "number" ? optPrice : Number(optPrice);
    if (!l || !Number.isFinite(p)) return;
    const next = [ ...(form.options ?? []) , { label: l, price: p } ];
    setForm((f) => ({ ...f, options: next }));
    setOptName("");
    setOptPrice("");
  };

  // Ensure displayType matches inputType rules
  React.useEffect(() => {
    const it = form.inputType;
    const validForInput = (t?: DetailItem["displayType"]) => {
      if (it === "input") return t === "number" || t === "text";
      if (it === "range") return t === "dual" || t === "single";
      return true; // other types ignore displayType
    };
    if (it === "input") {
      if (!validForInput(form.displayType)) {
        setForm((f) => ({ ...f, displayType: "text" }));
      }
    } else if (it === "range") {
      if (!validForInput(form.displayType)) {
        setForm((f) => ({ ...f, displayType: "single" }));
      }
    } else {
      if (form.displayType) {
        setForm((f) => {
          const rest: Partial<DetailItem> = { ...f };
          delete rest.displayType;
          return rest;
        });
      }
    }
  }, [form.inputType, form.displayType]);
  React.useEffect(() => {
    setOptName("");
    setOptPrice("");
  }, [form.inputType]);

  const reset = () => {
    setForm({
      priceType: "fixed",
      price: 0,
      sortOrder: 0,
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const serviceId = Number(form.serviceId);
      const serviceName = services.find(s => s.id === serviceId)?.name || "";
      const payload = { ...form, serviceId, serviceName, id: editingId ?? undefined };
      const res = await fetch("/api/admin/service-details", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setOpen(false);
        reset();
        setEditingId(null);
        await load();
      }
    } catch { }
    setSaving(false);
  };

  const remove = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/service-details?id=${deleteId}`, { method: "DELETE" });
      await load();
    } catch {}
    setDeleteId(null);
  };

  const isOptionType = ["select", "radio", "checkbox"].includes(form.inputType ?? "");

  const startEdit = (it: DetailItem) => {
    setEditingId(it.id);
    setForm({
      serviceId: it.serviceId,
      title: it.title,
      fieldName: it.fieldName,
      inputType: it.inputType,
      displayType: it.displayType,
      priceType: it.priceType,
      price: it.price,
      sortOrder: it.sortOrder ?? 0,
      options: it.options,
      range: it.range,
      inputMeta: it.inputMeta,
    });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    reset();
  };
  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Service Details</h2>
        <button onClick={() => { setEditingId(null); reset(); setOpen(true); }} className="btn btn-gaming btn-sm rounded-xl">Add Detail</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
        <div className="rounded-2xl bg-[#0A0E17] border border-white/10 overflow-hidden">
          <div className="px-4 py-3 text-xs text-gray-400">Services</div>
          <div className="divide-y divide-white/10">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSid(s.id)}
                className={`w-full px-4 py-3 text-left ${selectedSid === s.id ? "bg-blue-600/20 text-white" : "text-gray-300 hover:bg-white/5"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#0A0E17] border border-white/10 overflow-hidden">
          {selectedSid == null ? (
            <div className="p-6 text-gray-500">Select a service to view details</div>
          ) : (
            (() => {
              const name = services.find(s => s.id === selectedSid)?.name || `Service ${selectedSid}`;
              const rows = items.filter(r => r.serviceId === selectedSid);
              return (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-bold">{name}</div>
                    <div className="text-xs text-gray-400">{rows.length} details</div>
                  </div>
                  <div className="rounded-xl bg-white/5 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Title</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Field</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Input</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Display</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Price Type</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Price</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Sort</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-gray-500">No details found</td>
                          </tr>
                        ) : (
                          rows
                            .slice()
                            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.fieldName.localeCompare(b.fieldName))
                            .map((it) => (
                              <tr key={it.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-4 py-3 text-sm text-white">{it.title}</td>
                                <td className="px-4 py-3 text-sm text-white">{it.fieldName}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{it.inputType}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{it.displayType ?? "-"}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{it.priceType}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">${Number(it.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{it.sortOrder ?? 0}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => startEdit(it)} className="btn btn-ghost btn-xs text-gray-300 hover:bg-white/10" aria-label="Edit">
                                      <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => remove(it.id)} className="btn btn-ghost btn-xs text-red-400 hover:bg-red-500/10" aria-label="Delete">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      <dialog ref={confirmDialogRef} className="modal">
        <div className="modal-box bg-[#0F172A] border-0 text-white rounded-2xl">
          <div className="flex flex-col items-center text-center gap-2 mb-4">
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
            <h3 className="font-bold text-xl">Delete Detail</h3>
            <p className="text-sm text-gray-400">Are you sure you want to delete this service detail?</p>
          </div>
          <div className="flex justify-center gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button onClick={() => setDeleteId(null)}>close</button>
        </form>
      </dialog>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl">
            <div className="flex flex-col max-h-[80vh]">
              <div className="px-6 pt-6 pb-4 text-xl font-bold">{editingId ? "Edit Service Detail" : "Add New Service Detail"}</div>
              <div className="px-6 overflow-y-auto">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Service</label>
                <select
                  className="select select-bordered w-full"
                  value={form.serviceId ?? ""}
                  onChange={(e) => onChange({ serviceId: Number(e.target.value) || undefined })}
                >
                  <option value="">Select service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input className="input input-bordered w-full" value={form.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Input Type</label>
                <select
                  className="select select-bordered w-full"
                  value={form.inputType ?? ""}
                  onChange={(e) => onChange({ inputType: (e.target.value ? (e.target.value as DetailItem["inputType"]) : undefined) })}
                >
                  <option value="">Choose Type</option>
                  <option value="select">Select</option>
                  <option value="radio">Radio Button</option>
                  <option value="range">Range</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="input">Input</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Price Type</label>
                <select
                  className="select select-bordered w-full"
                  value={form.priceType ?? "fixed"}
                  onChange={(e) => onChange({ priceType: (e.target.value as DetailItem["priceType"]) })}
                >
                  <option value="fixed">Fixed</option>
                  <option value="percent">Percentage</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name (Field Name)</label>
                {isOptionType ? (
                  <input className="input input-bordered w-full" placeholder="Option Name" value={optName} onChange={(e) => setOptName(e.target.value)} />
                ) : (
                  <input className="input input-bordered w-full" value={form.fieldName ?? ""} onChange={(e) => onChange({ fieldName: e.target.value })} />
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Price (USD)</label>
                {isOptionType ? (
                  <div className="flex items-end gap-2">
                    <input type="number" className="input input-bordered w-full" placeholder="Option Price" value={optPrice} onChange={(e) => setOptPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                    <button type="button" className="btn" onClick={addOption}>Add</button>
                  </div>
                ) : (
                  <input type="number" className="input input-bordered w-full" value={form.price ?? 0} onChange={(e) => onChange({ price: Number(e.target.value) || 0 })} />
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Sort Order</label>
                <input type="number" className="input input-bordered w-full" value={form.sortOrder ?? 0} onChange={(e) => onChange({ sortOrder: Number(e.target.value) || 0 })} />
              </div>
            </div>

            {(form.inputType === "input" || form.inputType === "range") && (
              <div className="mt-4">
                <label className="text-xs text-gray-400 mb-1 block">Display Type</label>
                <select
                  className="select select-bordered w-full"
                  value={form.displayType ?? (form.inputType === "input" ? "text" : "single")}
                  onChange={(e) => onChange({ displayType: e.target.value as DetailItem["displayType"] })}
                >
                  {form.inputType === "input" ? (
                    <>
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                    </>
                  ) : (
                    <>
                      <option value="dual">Dual</option>
                      <option value="single">Single</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {isOptionType ? (
              <div className="mt-3">
                {(form.options ?? []).length === 0 ? (
                  <div className="text-sm text-gray-500">No options added (Required for {form.inputType})</div>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    {(form.options ?? []).map((opt, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                        <div className="text-sm text-gray-300">{opt.label} • ${opt.price.toFixed(2)}</div>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => {
                            const next = [...(form.options ?? [])];
                            next.splice(idx, 1);
                            onChange({ options: next });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {form.inputType === "range" ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Min</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={form.range?.min ?? 0}
                    onChange={(e) =>
                      onChange({
                        range: {
                          min: Number(e.target.value) || 0,
                          max: form.range?.max ?? 0,
                          step: form.range?.step ?? 1,
                          dual: form.range?.dual ?? false,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Max</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={form.range?.max ?? 0}
                    onChange={(e) =>
                      onChange({
                        range: {
                          min: form.range?.min ?? 0,
                          max: Number(e.target.value) || 0,
                          step: form.range?.step ?? 1,
                          dual: form.range?.dual ?? false,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Step</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={form.range?.step ?? 1}
                    onChange={(e) =>
                      onChange({
                        range: {
                          min: form.range?.min ?? 0,
                          max: form.range?.max ?? 0,
                          step: Number(e.target.value) || 1,
                          dual: form.range?.dual ?? false,
                        },
                      })
                    }
                  />
                </div>
              </div>
            ) : null}

            {form.inputType === "input" ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Kind</label>
                  <select
                    className="select select-bordered w-full"
                    value={form.inputMeta?.kind ?? "text"}
                    onChange={(e) => onChange({ inputMeta: { ...(form.inputMeta ?? {}), kind: e.target.value as "text" | "number" } })}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Min (number only)</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={form.inputMeta?.min ?? 0}
                    onChange={(e) =>
                      onChange({
                        inputMeta: {
                          kind: form.inputMeta?.kind ?? "text",
                          min: Number(e.target.value) || 0,
                          max: form.inputMeta?.max,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Max (number only)</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={form.inputMeta?.max ?? 0}
                    onChange={(e) =>
                      onChange({
                        inputMeta: {
                          kind: form.inputMeta?.kind ?? "text",
                          min: form.inputMeta?.min,
                          max: Number(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            ) : null}

              </div>
              <div className="px-6 py-4 flex justify-end gap-2">
                <button className="btn" onClick={closeModal}>Cancel</button>
                <button className={`btn btn-gaming ${saving ? "loading" : ""}`} onClick={save} disabled={saving}>{editingId ? "Save Changes" : "Create Detail"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
