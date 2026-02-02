"use client";
import * as React from "react";
import { Search as SearchIcon, ChevronDown, Check } from "lucide-react";

type GameOption = { id: number; name: string };

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
  initialValue?: number;
  onChange?: (id: number) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
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

  const selectedName = React.useMemo(() => (selectedId != null ? games.find((g) => g.id === selectedId)?.name ?? "" : ""), [selectedId, games]);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [games, query]);

  return (
    <div className="w-full" ref={dropdownRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="w-full relative">
        <div
          tabIndex={0}
          role="button"
          className="w-full h-11 px-4 bg-[#0A0E17] rounded-xl text-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:bg-[#0A0E17]/80"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{selectedName || "Select Game"}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 z-[50] w-full mt-2 bg-[#0A0E17] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            <div className="p-3">
              <div className="relative mb-2 sticky top-0 bg-[#0A0E17] z-[10] pb-2">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search game..."
                  className="w-full h-9 px-4 pl-9 bg-[#0F172A] border-0 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                {filtered.length === 0 && (
                  <div className="text-gray-500 px-3 py-2 text-sm">No results</div>
                )}
                {filtered.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setSelectedId(g.id);
                      onChange?.(g.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedId === g.id ? "bg-blue-500/20 text-blue-400" : "text-gray-300 hover:bg-white/5"}`}
                  >
                    <span className="truncate">{g.name}</span>
                    {selectedId === g.id && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <input id={name} name={name} type="hidden" value={selectedId != null ? String(selectedId) : ""} />
    </div>
  );
}
