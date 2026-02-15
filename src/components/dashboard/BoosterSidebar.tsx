'use client';
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Briefcase, DollarSign, User, MessageSquare, Settings, LogOut, Sparkles } from "lucide-react";

type ActiveTab = "overview" | "jobs" | "earnings" | "profile" | "messages" | "settings";

export function BoosterSidebar({ active }: { active: ActiveTab }) {
  const itemCls = (isActive: boolean) =>
    isActive
      ? "w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white ring-1 ring-blue-500/30"
      : "w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300";

  return (
    <nav className="bg-gradient-to-b from-[#0F172A] to-[#0B1224] border border-white/10 rounded-2xl p-4 ring-1 ring-white/5 backdrop-blur">
      <div className="flex items-center gap-3 px-2 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/25 to-cyan-500/10 ring-1 ring-blue-500/25 flex items-center justify-center text-blue-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">Booster Panel</div>
          <div className="text-xs text-gray-400 truncate">Manage jobs & earnings</div>
        </div>
      </div>
      <ul className="space-y-1">
        <li>
          <Link href="/booster" className={itemCls(active === "overview")}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <Link href="/booster/jobs" className={itemCls(active === "jobs")}>
            <Briefcase className="h-4 w-4" />
            <span>Jobs</span>
          </Link>
        </li>
        <li>
          <Link href="/booster/earnings" className={itemCls(active === "earnings")}>
            <DollarSign className="h-4 w-4" />
            <span>Earnings</span>
          </Link>
        </li>
        <li>
          <Link href="/booster/profile" className={itemCls(active === "profile")}>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/booster/messages" className={itemCls(active === "messages")}>
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>
        </li>
        <li>
          <Link href="/booster/settings" className={itemCls(active === "settings")}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
      <div className="border-t border-white/10 mt-4 pt-4">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/20 text-red-400 ring-1 ring-transparent hover:ring-red-500/20 transition-colors"
          aria-label="Logout"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
