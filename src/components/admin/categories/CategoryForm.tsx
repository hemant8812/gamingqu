"use client";
import { useState } from "react";
import { AutoSlugField } from "@/components/shared/AutoSlugField";
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
    <form onSubmit={onSubmit} method="post" className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body p-6 space-y-4">
        <div className="form-control">
            <label htmlFor="name" className="label">
                <span className="label-text font-semibold">Nama Kategori</span>
            </label>
            <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Contoh: Rank Boost"
            className="input input-bordered w-full"
            />
            <AutoSlugField nameInputId="name" name="slug" label="Slug" />
        </div>
        <div className="form-control">
            <label htmlFor="gameId" className="label">
                <span className="label-text font-semibold">Nama Game</span>
            </label>
            <select
            id="gameId"
            name="gameId"
            required
            className="select select-bordered w-full"
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
            className="btn btn-primary gap-2"
            >
            <SaveIcon className="h-4 w-4" />
            <span>Simpan</span>
            </button>
        </div>
      </div>
    </form>
  );
}
