"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

export type PanelNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  // Small counter shown after the label, e.g. new orders.
  badge?: number;
};

type Tone = "brand" | "accent" | "lime";

const TONES: Record<Tone, { badge: string; ring: string }> = {
  brand: { badge: "bg-brand-500/15 text-brand-200 ring-brand-400/30", ring: "from-brand-400 to-brand-700" },
  accent: { badge: "bg-accent-500/15 text-accent-200 ring-accent-400/30", ring: "from-accent-400 to-brand-600" },
  lime: { badge: "bg-lime-glow/10 text-lime-glow ring-lime-glow/30", ring: "from-lime-glow to-brand-600" },
};

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  const root = href.split("/").filter(Boolean).length <= 1;
  return root ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

// Sidebar shared by the member, booster and admin panels.
export function PanelNav({
  role,
  tone = "brand",
  items,
  footer,
}: {
  role: string;
  tone?: Tone;
  items: PanelNavItem[];
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as { name?: string | null; email?: string | null; username?: string | null } | undefined;
  const display = user?.username || user?.name || user?.email?.split("@")[0] || "Account";
  const t = TONES[tone];

  return (
    <nav className="surface overflow-hidden" aria-label={`${role} navigation`}>
      <div className="relative border-b border-white/[0.07] p-4">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative flex items-center gap-3">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.ring} font-display text-base font-bold uppercase text-white shadow-[0_10px_24px_-10px_rgba(124,92,255,0.9)]`}>
            {display.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">{display}</div>
            <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${t.badge}`}>
              {role}
            </span>
          </div>
        </div>
      </div>
      <ul className="space-y-1 p-3">
        {items.map((it) => {
          const active = it.active ?? isActive(pathname, it.href);
          return (
            <li key={it.label}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                aria-disabled={it.disabled || undefined}
                className={`panel-link ${active ? "panel-link-active" : ""} ${it.disabled ? "pointer-events-none opacity-50" : ""}`}
              >
                <span className={active ? "text-brand-300" : "text-gray-500"}>{it.icon}</span>
                <span className="truncate">{it.label}</span>
                {!!it.badge && (
                  <span className="ml-auto rounded-full bg-lime-glow px-1.5 text-[11px] font-bold tabular-nums text-ink-900" aria-label={`${it.badge} new`}>
                    {it.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {footer}
      <div className="border-t border-white/[0.07] p-3">
        <button
          type="button"
          className="panel-link w-full text-red-300 hover:bg-red-500/10 hover:text-red-200"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
}

// Horizontal, scrollable version of the same links for small screens.
export function PanelTabs({ items }: { items: PanelNavItem[] }) {
  const pathname = usePathname();
  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 lg:hidden">
      <div className="flex w-max gap-2">
        {items.map((it) => {
          const active = it.active ?? isActive(pathname, it.href);
          return (
            <Link
              key={it.label}
              href={it.href}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
                active ? "border-brand-500/50 bg-brand-500/15 text-white" : "border-white/10 bg-white/[0.03] text-gray-300"
              }`}
            >
              {it.icon}
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
