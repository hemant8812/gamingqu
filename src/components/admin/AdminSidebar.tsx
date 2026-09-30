"use client";
import {
  FiGrid, FiUsers, FiStar, FiShoppingCart, FiBarChart2, FiPlay, FiLayers,
  FiTool, FiDatabase, FiCreditCard, FiFileText, FiImage, FiBookOpen, FiShield, FiSettings,
} from "react-icons/fi";
import { PanelNav, PanelTabs, type PanelNavItem } from "@/components/panel/PanelNav";

// Keys match ADMIN_SECTIONS in lib/adminAccess.ts.
const ITEMS: (PanelNavItem & { key: string })[] = [
  { key: "dashboard", href: "/admin", label: "Dashboard", icon: <FiGrid className="h-4 w-4" /> },
  { key: "orders", href: "/admin/orders", label: "Orders", icon: <FiShoppingCart className="h-4 w-4" /> },
  { key: "users", href: "/admin/users", label: "Users", icon: <FiUsers className="h-4 w-4" /> },
  { key: "boosters", href: "/admin/boosters", label: "Boosters", icon: <FiStar className="h-4 w-4" /> },
  { key: "analytics", href: "/admin/analytics", label: "Analytics", icon: <FiBarChart2 className="h-4 w-4" /> },
  { key: "games", href: "/admin/games", label: "Games", icon: <FiPlay className="h-4 w-4" /> },
  { key: "categories", href: "/admin/categories", label: "Categories", icon: <FiLayers className="h-4 w-4" /> },
  { key: "services", href: "/admin/services", label: "Services", icon: <FiTool className="h-4 w-4" /> },
  { key: "services-data", href: "/admin/service-data", label: "Data Service", icon: <FiDatabase className="h-4 w-4" /> },
  { key: "payment-method", href: "/admin/payment-method", label: "Payment Methods", icon: <FiCreditCard className="h-4 w-4" /> },
  { key: "blog", href: "/admin/blog", label: "Blog", icon: <FiBookOpen className="h-4 w-4" /> },
  { key: "benner", href: "/admin/benner", label: "Banners", icon: <FiImage className="h-4 w-4" /> },
  { key: "legal", href: "/admin/legal", label: "Legal Pages", icon: <FiFileText className="h-4 w-4" /> },
  { key: "settings", href: "/admin/settings", label: "Settings", icon: <FiSettings className="h-4 w-4" /> },
  { key: "permissions", href: "/admin/permissions", label: "Permissions", icon: <FiShield className="h-4 w-4" /> },
];

export function AdminSidebar({ enabled, isSuperAdmin }: { enabled: string[]; isSuperAdmin: boolean }) {
  const allowed = new Set(enabled);
  const items = ITEMS.filter((it) => {
    if (it.key === "dashboard") return true;
    if (it.key === "permissions") return isSuperAdmin;
    return isSuperAdmin || allowed.has(it.key);
  });

  return (
    <>
      <PanelTabs items={items} />
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <PanelNav role={isSuperAdmin ? "Super admin" : "Admin"} tone="accent" items={items} />
        </div>
      </aside>
    </>
  );
}
