"use client";
import { useState } from "react";
import { AutoSlugField } from "@/components/AutoSlugField";
import { Save as SaveIcon } from "lucide-react";

type GameOption = { id: string; name: string };

export function CategoryForm({ games }: { games: GameOption[] }) {
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      // const form = e.currentTarget;
      // const fd = new FormData(form);
      setBusy(false);
    } catch {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={onSubmit} method="post" className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold">Nama Kategori</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Contoh: Rank Boost"
          className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
        />
        <AutoSlugField nameInputId="name" name="slug" label="Slug" />
      </div>
      <div>
        <label htmlFor="gameId" className="block text-sm font-semibold">Nama Game</label>
        <select
          id="gameId"
          name="gameId"
          required
          className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
          defaultValue=""
        >
          <option value="" disabled>Pilih Game</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className={`inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm ${busy ? "opacity-60" : "hover:bg-blue-500"}`}
        >
          <SaveIcon className="h-4 w-4" />
          <span>Simpan</span>
        </button>
      </div>
    </form>
  );
}
