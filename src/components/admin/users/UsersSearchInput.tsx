"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export function UsersSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const initial = sp.get("q") ?? "";
  const [value, setValue] = React.useState(initial);
  const lastSentRef = React.useRef<string>(initial);

  React.useEffect(() => {
    setValue(initial);
  }, [initial]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const v = value.trim();
      const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      params.set("page", "1");
      if (v) {
        params.set("q", v);
      } else {
        params.delete("q");
      }
      const next = `${pathname}?${params.toString()}`;
      const currentQ = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("q") ?? "";
      if (v !== currentQ) {
        lastSentRef.current = v;
        router.replace(next);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [value, router, pathname]);

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search users..."
        className="pl-10 pr-4 h-10 w-64 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        aria-label="Search by ID, username, or email"
      />
    </div>
  );
}
