"use client";
import * as React from "react";
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
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialValue) {
      setSelectedId(initialValue);
    }
  }, [initialValue]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedName = React.useMemo(() => games.find((g) => g.id === selectedId)?.name ?? "", [selectedId, games]);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [games, query]);

  return (
    <div className="form-control w-full" ref={dropdownRef}>
      <label htmlFor={name} className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className={`dropdown w-full ${isOpen ? "dropdown-open" : ""}`}>
        <div
          tabIndex={0}
          role="button"
          className="input input-bordered w-full flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{selectedName || "Pilih Game"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        {isOpen && (
          <div className="dropdown-content z-[999] card card-compact w-full p-2 shadow-xl bg-base-100 border border-base-200 mt-1 max-h-60 overflow-y-auto">
            <div className="p-2">
                <div className="relative mb-2 sticky top-0 bg-base-100 z-[1000] pb-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-[calc(50%+4px)] opacity-50 h-4 w-4 pointer-events-none" />
                    <input
                    type="text"
                    placeholder="Cari nama game"
                    className="input input-bordered input-sm w-full pl-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    />
                </div>
                <ul className="menu menu-sm w-full p-0">
                    {filtered.length === 0 && (
                        <li className="disabled"><a>Tidak ada hasil</a></li>
                    )}
                    {filtered.map((g) => (
                        <li key={g.id}>
                            <a
                                onClick={() => {
                                    setSelectedId(g.id);
                                    onChange?.(g.id);
                                    setIsOpen(false);
                                }}
                                className={`flex justify-between ${selectedId === g.id ? "active" : ""}`}
                            >
                                <span className="truncate">{g.name}</span>
                                {selectedId === g.id && <Check className="h-4 w-4" />}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        )}
      </div>
      <input id={name} name={name} type="hidden" value={selectedId} />
    </div>
  );
}
