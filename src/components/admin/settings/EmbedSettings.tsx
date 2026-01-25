"use client";
import { useEffect, useState } from "react";

type Item = {
  id: string;
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
      ? "bg-purple-600 text-white"
      : p === "BODY"
      ? "bg-blue-600 text-white"
      : "bg-zinc-700 text-white";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${cls}`}>{label}</span>;
}

export function EmbedSettings() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<Item["placement"]>("BODY");
  const [isActive, setIsActive] = useState(true);
  const [code, setCode] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
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
          setError("Gagal memuat data");
        }
      })
      .catch(() => setError("Gagal memuat data"))
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
        setError("Gagal menyimpan");
        return;
      }
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      resetForm();
    } catch {
      setError("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (id: string) => {
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
        setError("Gagal memperbarui");
        return;
      }
      const updated = await res.json();
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditingId(null);
    } catch {
      setError("Gagal memperbarui");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/embeds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setError("Gagal menghapus");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError("Gagal menghapus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submitCreate} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="embedName" className="block text-sm font-semibold">Nama</label>
            <input
              id="embedName"
              type="text"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              placeholder="Contoh: Google Analytics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="embedPlacement" className="block text-sm font-semibold">Penempatan</label>
            <select
              id="embedPlacement"
              className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              value={placement}
              onChange={(e) => setPlacement(e.target.value as Item["placement"])}
            >
              <option value="HEAD">Head</option>
              <option value="BODY">Body</option>
              <option value="FOOTER">Footer</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input id="embedActive" type="checkbox" className="peer sr-only" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="embedActive" className="inline-flex items-center gap-2 text-sm text-zinc-300">
            <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-zinc-800 transition-colors peer-checked:bg-green-600">
              <span className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform peer-checked:translate-x-3"></span>
            </span>
            Aktif
          </label>
        </div>
        <div>
          <label htmlFor="embedCode" className="block text-sm font-semibold">Kode</label>
          <textarea
            id="embedCode"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white min-h-40"
            placeholder="Tempel kode embed di sini"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            disabled={loading}
          >
            <span>Simpan Embed</span>
          </button>
        </div>
      </form>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Daftar Embed</h2>
          <div className="text-xs text-zinc-400">{items.length} item</div>
        </div>
        <div className="mt-4 space-y-3">
          {items.length === 0 && (
            <div className="text-sm text-zinc-400">Belum ada data</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-zinc-900 bg-black p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${it.isActive ? "bg-green-600 text-white" : "bg-zinc-700 text-white"}`}>{it.isActive ? "Aktif" : "Nonaktif"}</div>
                  <PlacementBadge p={it.placement} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white hover:bg-zinc-800"
                    onClick={() => openEdit(it.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500"
                    onClick={() => removeItem(it.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <div className="mt-2 font-semibold">{it.name}</div>
              {editingId === it.id ? (
                <form onSubmit={submitUpdate} className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor={`editName-${it.id}`} className="block text-sm font-semibold">Nama</label>
                      <input
                        id={`editName-${it.id}`}
                        type="text"
                        className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`editPlacement-${it.id}`} className="block text-sm font-semibold">Penempatan</label>
                      <select
                        id={`editPlacement-${it.id}`}
                        className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
                        value={editPlacement}
                        onChange={(e) => setEditPlacement(e.target.value as Item["placement"])}
                      >
                        <option value="HEAD">Head</option>
                        <option value="BODY">Body</option>
                        <option value="FOOTER">Footer</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input id={`editActive-${it.id}`} type="checkbox" className="peer sr-only" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
                    <label htmlFor={`editActive-${it.id}`} className="inline-flex items-center gap-2 text-sm text-zinc-300">
                      <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-zinc-800 transition-colors peer-checked:bg-green-600">
                        <span className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform peer-checked:translate-x-3"></span>
                      </span>
                      Aktif
                    </label>
                  </div>
                  <div>
                    <label htmlFor={`editCode-${it.id}`} className="block text-sm font-semibold">Kode</label>
                    <textarea
                      id={`editCode-${it.id}`}
                      className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white min-h-40"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800"
                      onClick={cancelEdit}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                      disabled={loading}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-2 text-xs text-zinc-500 break-words line-clamp-2">{it.code}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
