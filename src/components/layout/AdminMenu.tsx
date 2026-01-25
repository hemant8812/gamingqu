"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function AdminMenu() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuper = session?.user?.role === "SUPERADMIN";
  const items = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/boosters", label: "Boosters" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/games", label: "Games" },
    { href: "/admin/settings", label: "Settings" },
  ];
  const permsItem = { href: "/admin/permissions", label: "Permissions" };
  return (
    <div className="flex items-center gap-2">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`rounded-sm px-4 py-2 text-sm font-semibold ${active ? "bg-blue-600 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
          >
            {it.label}
          </Link>
        );
      })}
      {isSuper && (
        <Link
          href={permsItem.href}
          className={`rounded-sm px-4 py-2 text-sm font-semibold ${pathname === permsItem.href ? "bg-blue-600 text-white" : "bg-purple-700 text-white hover:bg-purple-600"}`}
        >
          {permsItem.label}
        </Link>
      )}
    </div>
  );
}
