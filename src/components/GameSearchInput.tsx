"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export function GameSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const initial = sp.get("q") ?? "";
  const [value, setValue] = React.useState(initial);
  React.useEffect(() => {
    setValue(initial);
  }, [initial]);
  React.useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(Array.from(sp.entries()));
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(t);
  }, [value, router, pathname, sp]);
  return (
    <div className="relative w-64">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari game"
        className="bg-zinc-900 border border-zinc-800 rounded-md h-9 px-3 pl-9 text-sm text-white w-full"
        aria-label="Pencarian game"
      />
    </div>
  );
}

