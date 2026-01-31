"use client";
import * as React from "react";
import { Search as SearchIcon, ChevronDown, Check, X } from "lucide-react";

type CategoryOption = { id: string; name: string; gameId: string };

export function CategorySelect({
  categories,
  name = "categoryId",
  label = "Nama Kategori (opsional)",
  gameId,
  initialValue,
  onChange,
}: {
  categories: CategoryOption[];
  name?: string;
  label?: string;
  gameId?: string;
  initialValue?: string | null;
  onChange?: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string>(initialValue ?? "");
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (initialValue !== undefined) {
      setSelectedId(initialValue ?? "");
    }
  }, [initialValue]);

  const selectedName = React.useMemo(() => categories.find((c) => c.id === selectedId)?.name ?? "", [selectedId, categories]);
  const filtered = React.useMemo(() => {
    const list = gameId ? categories.filter((c) => c.gameId === gameId) : categories;
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query, gameId]);

  const setValue = (id: string) => {
    setSelectedId(id);
    onChange?.(id);
    setIsOpen(false);
  };

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
          <span className="truncate">{selectedName || "Select Category (optional)"}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 z-[50] w-full mt-2 bg-[#0A0E17] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            <div className="p-3">
              <div className="relative mb-2 sticky top-0 bg-[#0A0E17] z-[10] pb-2">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search category..."
                  className="w-full h-9 px-4 pl-9 bg-[#0F172A] border-0 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <div
                  onClick={() => setValue("")}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedId === "" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-white/5"}`}
                >
                  <span>No category</span>
                  {selectedId === "" && <X className="h-4 w-4" />}
                </div>
                {filtered.length === 0 && (
                  <div className="text-gray-500 px-3 py-2 text-sm">No results</div>
                )}
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setValue(c.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedId === c.id ? "bg-blue-500/20 text-blue-400" : "text-gray-300 hover:bg-white/5"}`}
                  >
                    <span className="truncate">{c.name}</span>
                    {selectedId === c.id && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <input id={name} name={name} type="hidden" value={selectedId} />
    </div>
  );
}
