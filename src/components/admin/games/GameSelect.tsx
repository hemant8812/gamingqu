"use client";
import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search as SearchIcon, ChevronDown, Check } from "lucide-react";

type GameOption = { id: string; name: string };

export function GameSelect({
  games,
  name = "gameId",
  label = "Nama Game",
  initialValue,
  onChange,
}: {
  games: GameOption[];
  name?: string;
  label?: string;
  initialValue?: string;
  onChange?: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string>("");
  React.useEffect(() => {
    if (initialValue) {
      setSelectedId(initialValue);
    }
  }, [initialValue]);
  const selectedName = React.useMemo(() => games.find((g) => g.id === selectedId)?.name ?? "", [selectedId, games]);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [games, query]);
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white inline-flex items-center justify-between"
            aria-haspopup="listbox"
            aria-expanded="false"
          >
            <span className="truncate">{selectedName || "Pilih Game"}</span>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-950 border-zinc-900 text-white p-2 w-[22rem]">
          <div className="relative mb-2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama game"
              className="bg-zinc-900 border border-zinc-800 rounded-md h-9 px-3 pl-9 text-sm text-white w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Pencarian game"
            />
          </div>
          <div className="max-h-64 overflow-auto rounded-md border border-zinc-900">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-zinc-400">Tidak ada hasil</div>
            )}
            {filtered.map((g) => (
              <DropdownMenuItem
                key={g.id}
                onClick={() => {
                  setSelectedId(g.id);
                  onChange?.(g.id);
                }}
                className="rounded-none px-3 py-2 hover:bg-zinc-800 focus:bg-zinc-800 data-[highlighted]:bg-zinc-800 flex items-center justify-between"
              >
                <span className="truncate">{g.name}</span>
                {selectedId === g.id && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <input id={name} name={name} type="hidden" value={selectedId} />
    </div>
  );
}
