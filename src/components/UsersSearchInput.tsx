"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function UsersSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const initial = sp.get("q") ?? "";
  const [value, setValue] = React.useState(initial);
  const lastSentRef = React.useRef<string>(initial);
  React.useEffect(() => {
    if (initial !== value) setValue(initial);
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
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search users"
      className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white w-64"
      aria-label="Cari berdasarkan ID, username, atau email"
    />
  );
}
