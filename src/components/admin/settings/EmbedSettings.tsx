"use client";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  code: string;
  placement: "HEAD" | "BODY" | "FOOTER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

function PlacementBadge({ p }: { p: Item["placement"] }) {
  const label = p === "HEAD" ? "Head" : p === "BODY" ? "Body" : "Footer";
  const cls =
    p === "HEAD"
      ? "bg-purple-500/20 text-purple-400"
      : p === "BODY"
        ? "bg-blue-500/20 text-blue-400"
        : "bg-gray-500/20 text-gray-400";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>{label}</span>;
}

export function EmbedSettings() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<Item["placement"]>("BODY");
  const [isActive, setIsActive] = useState(true);
  const [code, setCode] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPlacement, setEditPlacement] = useState<Item["placement"]>("BODY");
  const [editActive, setEditActive] = useState(true);
  const [editCode, setEditCode] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/admin/embeds")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          setItems(data);
          setError(null);
        } else {
          setError("Failed to load data");
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setName("");
    setPlacement("BODY");
    setIsActive(true);
    setCode("");
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/embeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, placement, isActive, code }),
      });
      if (!res.ok) {
        setError("Failed to save");
        return;
      }
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      resetForm();
    } catch {
      setError("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (id: number) => {
    setEditingId(id);
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditName(it.name);
    setEditPlacement(it.placement);
    setEditActive(it.isActive);
    setEditCode(it.code);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/embeds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name: editName, placement: editPlacement, isActive: editActive, code: editCode }),
      });
      if (!res.ok) {
        setError("Failed to update");
        return;
      }
      const updated = await res.json();
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditingId(null);
    } catch {
      setError("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/embeds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setError("Failed to delete");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm placeholder-gray-400 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all";
  const selectClassName = "w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all cursor-pointer";
  const textareaClassName = "w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm placeholder-gray-400 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all resize-none";

  return (
    <div className="space-y-6">
      <form onSubmit={submitCreate} className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="embedName" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              id="embedName"
              type="text"
              className={inputClassName}
              placeholder="e.g. Google Analytics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="embedPlacement" className="block text-sm font-medium text-gray-300 mb-2">Placement</label>
            <select
              id="embedPlacement"
              className={selectClassName}
              value={placement}
              onChange={(e) => setPlacement(e.target.value as Item["placement"])}
            >
              <option value="HEAD">Head</option>
              <option value="BODY">Body</option>
              <option value="FOOTER">Footer</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
          <span className="text-sm font-medium text-gray-300">Active Status</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
        <div>
          <label htmlFor="embedCode" className="block text-sm font-medium text-gray-300 mb-2">Code</label>
          <textarea
            id="embedCode"
            className={`${textareaClassName} min-h-40`}
            placeholder="Paste embed code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Save Embed
          </button>
        </div>
      </form>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Embed List</h2>
          <div className="text-xs text-gray-500">{items.length} items</div>
        </div>
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-8">No data yet</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${it.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>{it.isActive ? "Active" : "Inactive"}</span>
                  <PlacementBadge p={it.placement} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    onClick={() => openEdit(it.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    onClick={() => removeItem(it.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 font-semibold text-white">{it.name}</div>
              {editingId === it.id ? (
                <form onSubmit={submitUpdate} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`editName-${it.id}`} className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        id={`editName-${it.id}`}
                        type="text"
                        className={inputClassName}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`editPlacement-${it.id}`} className="block text-sm font-medium text-gray-300 mb-2">Placement</label>
                      <select
                        id={`editPlacement-${it.id}`}
                        className={selectClassName}
                        value={editPlacement}
                        onChange={(e) => setEditPlacement(e.target.value as Item["placement"])}
                      >
                        <option value="HEAD">Head</option>
                        <option value="BODY">Body</option>
                        <option value="FOOTER">Footer</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-300">Active Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div>
                    <label htmlFor={`editCode-${it.id}`} className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                    <textarea
                      id={`editCode-${it.id}`}
                      className={`${textareaClassName} min-h-40`}
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-2 text-xs text-gray-500 break-words line-clamp-2">{it.code}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
