"use client";

import { useMemo, useState } from "react";
import { Search, X, Check } from "lucide-react";

type Game = { id: number; name: string; services: { id: number; name: string }[] };

// Pick the services a booster can do. Sends one hidden "serviceId" field per pick.
export function ServicePicker({ games, initial }: { games: Game[]; initial: number[] }) {
  const [selected, setSelected] = useState<Set<number>>(new Set(initial));
  const [query, setQuery] = useState("");

  const lookup = useMemo(() => {
    const m = new Map<number, { game: string; name: string }>();
    for (const g of games) for (const s of g.services) m.set(s.id, { game: g.name, name: s.name });
    return m;
  }, [games]);

  const q = query.trim().toLowerCase();
  const visible = games
    .map((g) => ({
      ...g,
      services: g.name.toLowerCase().includes(q) ? g.services : g.services.filter((s) => s.name.toLowerCase().includes(q)),
    }))
    .filter((g) => g.services.length > 0);

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const setGame = (g: Game, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const s of g.services) {
        if (on) next.add(s.id);
        else next.delete(s.id);
      }
      return next;
    });

  return (
    <div className="space-y-4">
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="serviceId" value={id} />
      ))}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
        <label htmlFor="service-search" className="sr-only">Search by game or service</label>
        <input
          id="service-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by game or service"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div className="surface max-h-[28rem] space-y-6 overflow-y-auto p-5">
        {visible.length === 0 && <p className="text-sm text-gray-400">No game or service matches “{query}”.</p>}
        {visible.map((g) => {
          const all = g.services.every((s) => selected.has(s.id));
          return (
            <section key={g.id}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-brand-200">{g.name}</h2>
                <button type="button" onClick={() => setGame(g, !all)} className="text-xs font-semibold text-gray-400 hover:text-white">
                  {all ? "Clear game" : "Select all"}
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {g.services.map((s) => {
                  const on = selected.has(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(s.id)}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        on ? "border-brand-500/70 bg-brand-500/15 text-white" : "border-white/10 bg-ink-900/60 text-gray-300 hover:border-white/25"
                      }`}
                    >
                      <span className="min-w-0 truncate">{s.name}</span>
                      {on && <Check className="h-4 w-4 shrink-0 text-lime-glow" />}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Selected</h2>
          <span className="text-xs tabular-nums text-gray-400">{selected.size} services</span>
        </div>
        {selected.size === 0 ? (
          <p className="text-sm text-gray-400">Nothing selected yet. You won’t see any orders until you pick at least one service.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[...selected].map((id) => {
              const s = lookup.get(id);
              if (!s) return null;
              return (
                <span key={id} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2 text-sm">
                  <span className="font-semibold text-brand-300">{s.game}:</span>
                  <span className="text-gray-100">{s.name}</span>
                  <button type="button" onClick={() => toggle(id)} aria-label={`Remove ${s.name}`} className="text-gray-500 hover:text-white">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
