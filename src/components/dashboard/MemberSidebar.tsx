'use client';
import { Home, ShoppingCart, User, Wallet, Star, MessageSquare, Settings } from "lucide-react";
import { PanelNav, PanelTabs, type PanelNavItem } from "@/components/panel/PanelNav";

type ActiveTab = "overview" | "orders" | "profile" | "wallet" | "reviews" | "settings";

export function MemberSidebar({ active }: { active: ActiveTab }) {
  const items: PanelNavItem[] = [
    { href: "/dashboard", label: "Overview", icon: <Home className="h-4 w-4" />, active: active === "overview" },
    { href: "/dashboard/orders", label: "My Orders", icon: <ShoppingCart className="h-4 w-4" />, active: active === "orders" },
    { href: "/dashboard/profile", label: "Profile", icon: <User className="h-4 w-4" />, active: active === "profile" },
    { href: "/dashboard/wallet", label: "Wallet", icon: <Wallet className="h-4 w-4" />, active: active === "wallet" },
    { href: "/dashboard/reviews", label: "Reviews", icon: <Star className="h-4 w-4" />, active: active === "reviews" },
    { href: "#", label: "Messages", icon: <MessageSquare className="h-4 w-4" />, active: false, disabled: true },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-4 w-4" />, active: active === "settings" },
  ];
  return (
    <>
      <PanelTabs items={items.filter((i) => !i.disabled)} />
      <div className="hidden lg:block">
        <PanelNav role="Client" items={items} />
      </div>
    </>
  );
}
