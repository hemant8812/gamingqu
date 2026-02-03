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
    { href: "/admin/payment-method", label: "Payment Method" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/settings", label: "Settings" },
  ];
  const permsItem = { href: "/admin/permissions", label: "Permissions" };
  
  return (
    <div className="overflow-x-auto">
      <ul className="menu menu-horizontal bg-base-200 rounded-box gap-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`${active ? "active" : ""}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
        {isSuper && (
          <li>
            <Link
              href={permsItem.href}
              className={`${pathname === permsItem.href ? "active" : "text-secondary"}`}
            >
              {permsItem.label}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
