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
          <span className="truncate">{selectedName || "Pilih Kategori (opsional)"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        {isOpen && (
          <div className="dropdown-content z-[999] card card-compact w-full p-2 shadow-xl bg-base-100 border border-base-200 mt-1 max-h-60 overflow-y-auto">
            <div className="p-2">
                <div className="relative mb-2 sticky top-0 bg-base-100 z-[1000] pb-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-[calc(50%+4px)] opacity-50 h-4 w-4 pointer-events-none" />
                    <input
                    type="text"
                    placeholder="Cari kategori"
                    className="input input-bordered input-sm w-full pl-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    />
                </div>
                <ul className="menu menu-sm w-full p-0">
                    <li>
                        <a onClick={() => setValue("")} className="flex justify-between">
                            <span className="opacity-70">Tanpa kategori</span>
                            {selectedId === "" && <X className="h-4 w-4 opacity-50" />}
                        </a>
                    </li>
                    {filtered.length === 0 && (
                        <li className="disabled"><a>Tidak ada hasil</a></li>
                    )}
                    {filtered.map((c) => (
                        <li key={c.id}>
                            <a
                                onClick={() => setValue(c.id)}
                                className={`flex justify-between ${selectedId === c.id ? "active" : ""}`}
                            >
                                <span className="truncate">{c.name}</span>
                                {selectedId === c.id && <Check className="h-4 w-4" />}
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
