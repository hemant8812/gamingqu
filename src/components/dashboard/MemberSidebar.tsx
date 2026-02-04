import Link from "next/link";
import { Home, ShoppingCart, User, Wallet, Star, MessageSquare, Settings, LogOut } from "lucide-react";

type ActiveTab = "overview" | "orders" | "profile" | "wallet" | "reviews" | "settings";

export function MemberSidebar({ active }: { active: ActiveTab }) {
  const itemCls = (isActive: boolean) =>
    isActive
      ? "flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white"
      : "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300";
  return (
    <nav className="bg-[#0F172A] border border-white/10 rounded-2xl p-4">
      <ul className="space-y-1">
        <li>
          <Link href="/dashboard" className={itemCls(active === "overview")}>
            <Home className="h-4 w-4" />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/orders" className={itemCls(active === "orders")}>
            <ShoppingCart className="h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/profile" className={itemCls(active === "profile")}>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/wallet" className={itemCls(active === "wallet")}>
            <Wallet className="h-4 w-4" />
            <span>Wallet</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/reviews" className={itemCls(active === "reviews")}>
            <Star className="h-4 w-4" />
            <span>Reviews</span>
          </Link>
        </li>
        <li>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className={itemCls(active === "settings")}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
      <div className="border-t border-white/10 mt-4 pt-4">
        <button type="button" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-label="Logout">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
