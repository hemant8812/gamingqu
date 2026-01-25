 "use client";
 import * as React from "react";
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
   };
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
             <span className="truncate">{selectedName || "Pilih Kategori (opsional)"}</span>
             <ChevronDown className="h-4 w-4 text-zinc-400" />
           </button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="bg-zinc-950 border-zinc-900 text-white p-2 w-[22rem]">
           <div className="relative mb-2">
             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
             <input
               type="text"
               placeholder="Cari kategori"
               className="bg-zinc-900 border border-zinc-800 rounded-md h-9 px-3 pl-9 text-sm text-white w-full"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               aria-label="Pencarian kategori"
             />
           </div>
           <div className="max-h-64 overflow-auto rounded-md border border-zinc-900">
             <DropdownMenuItem
               onClick={() => setValue("")}
               className="rounded-none px-3 py-2 hover:bg-zinc-800 focus:bg-zinc-800 data-[highlighted]:bg-zinc-800 flex items-center justify-between"
             >
               <span className="truncate text-zinc-300">Tanpa kategori</span>
               {selectedId === "" && <X className="h-4 w-4 text-zinc-500" />}
             </DropdownMenuItem>
             {filtered.length === 0 && (
               <div className="px-3 py-2 text-sm text-zinc-400">Tidak ada hasil</div>
             )}
             {filtered.map((c) => (
               <DropdownMenuItem
                 key={c.id}
                 onClick={() => setValue(c.id)}
                 className="rounded-none px-3 py-2 hover:bg-zinc-800 focus:bg-zinc-800 data-[highlighted]:bg-zinc-800 flex items-center justify-between"
               >
                 <span className="truncate">{c.name}</span>
                 {selectedId === c.id && <Check className="h-4 w-4 text-green-500" />}
               </DropdownMenuItem>
             ))}
           </div>
         </DropdownMenuContent>
       </DropdownMenu>
       <input id={name} name={name} type="hidden" value={selectedId} />
     </div>
   );
 }
