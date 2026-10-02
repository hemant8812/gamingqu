'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, Briefcase, DollarSign, User, MessageSquare, Settings, Zap, Gamepad2 } from "lucide-react";
import { PanelNav, PanelTabs, type PanelNavItem } from "@/components/panel/PanelNav";

type ActiveTab = "overview" | "orders" | "services" | "earnings" | "profile" | "messages" | "settings";

export function BoosterSidebar({ active }: { active: ActiveTab }) {
  const [newOrders, setNewOrders] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/booster/new-orders", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d: { count?: number }) => alive && setNewOrders(Number(d.count) || 0))
        .catch(() => {});
    load();
    const id = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  const items: PanelNavItem[] = [
    { href: "/booster", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, active: active === "overview" },
    { href: "/booster/orders", label: "Orders", icon: <Briefcase className="h-4 w-4" />, active: active === "orders", badge: newOrders },
    { href: "/booster/services", label: "My Services", icon: <Gamepad2 className="h-4 w-4" />, active: active === "services" },
    { href: "/booster/earnings", label: "Earnings", icon: <DollarSign className="h-4 w-4" />, active: active === "earnings" },
    { href: "/booster/profile", label: "Profile", icon: <User className="h-4 w-4" />, active: active === "profile" },
    { href: "/booster/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" />, active: active === "messages" },
    { href: "/booster/settings", label: "Settings", icon: <Settings className="h-4 w-4" />, active: active === "settings" },
  ];
  return (
    <>
      <PanelTabs items={items} />
      <div className="hidden lg:block">
        <PanelNav
          role="Booster"
          tone="lime"
          items={items}
          footer={
            <div className="px-3 pb-3">
              <Link
                href="/booster/orders"
                className="flex items-center gap-3 rounded-xl border border-lime-glow/20 bg-lime-glow/[0.06] p-3 text-sm text-gray-200 hover:border-lime-glow/40"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-glow/15 text-lime-glow">
                  <Zap className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold text-white">Find orders</span>
                  <span className="text-xs text-gray-400">For your services</span>
                </span>
              </Link>
            </div>
          }
        />
      </div>
    </>
  );
}
