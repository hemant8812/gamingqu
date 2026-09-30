import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";

// Every admin section a super admin can grant. Keys match the admin routes.
export const ADMIN_SECTIONS = [
  { key: "orders", label: "Orders", href: "/admin/orders" },
  { key: "users", label: "Users", href: "/admin/users" },
  { key: "boosters", label: "Boosters", href: "/admin/boosters" },
  { key: "analytics", label: "Analytics", href: "/admin/analytics" },
  { key: "games", label: "Games", href: "/admin/games" },
  { key: "categories", label: "Categories", href: "/admin/categories" },
  { key: "services", label: "Services", href: "/admin/services" },
  { key: "services-data", label: "Data Service", href: "/admin/service-data" },
  { key: "payment-method", label: "Payment Methods", href: "/admin/payment-method" },
  { key: "blog", label: "Blog", href: "/admin/blog" },
  { key: "benner", label: "Banners", href: "/admin/benner" },
  { key: "legal", label: "Legal Pages", href: "/admin/legal" },
  { key: "settings", label: "Settings", href: "/admin/settings" },
] as const;

export type AdminSectionKey = (typeof ADMIN_SECTIONS)[number]["key"];

export const ALL_ADMIN_SECTION_KEYS: AdminSectionKey[] = ADMIN_SECTIONS.map((s) => s.key);

export type AdminAccess = {
  userId: string;
  isSuper: boolean;
  allowed: Set<string>;
  // False while the admin still uses the shared defaults.
  hasOwnPermissions: boolean;
};

// Sections one admin account may use. Admins without their own settings
// fall back to the shared defaults (the old, global permission switches).
export async function getAdminPermissionKeys(userId: string): Promise<{ allowed: Set<string>; hasOwnPermissions: boolean }> {
  const own = await db.adminUserPermission.findMany({ where: { userId }, select: { key: true, enabled: true } });
  if (own.length > 0) {
    return { allowed: new Set(own.filter((p) => p.enabled).map((p) => p.key)), hasOwnPermissions: true };
  }
  const shared = await db.adminPermission.findMany({ where: { enabled: true }, select: { key: true } });
  const allowed = new Set(shared.map((p) => p.key));
  // The old dashboard also opened Data Service to anyone allowed on Services.
  if (allowed.has("services")) allowed.add("services-data");
  return { allowed, hasOwnPermissions: false };
}

export async function getAdminAccess(): Promise<AdminAccess | null> {
  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) return null;
  if (user.role === "SUPERADMIN") {
    return { userId: user.id, isSuper: true, allowed: new Set(ALL_ADMIN_SECTION_KEYS), hasOwnPermissions: true };
  }
  try {
    const { allowed, hasOwnPermissions } = await getAdminPermissionKeys(user.id);
    return { userId: user.id, isSuper: false, allowed, hasOwnPermissions };
  } catch {
    return { userId: user.id, isSuper: false, allowed: new Set(), hasOwnPermissions: false };
  }
}

// True when the signed-in user is a super admin, or an admin granted any of `keys`.
export async function canAccessAdminSection(keys: AdminSectionKey | AdminSectionKey[]): Promise<boolean> {
  const access = await getAdminAccess();
  if (!access) return false;
  if (access.isSuper) return true;
  const list = Array.isArray(keys) ? keys : [keys];
  return list.some((k) => access.allowed.has(k));
}

// Server actions are callable on their own, so they check access themselves.
export async function assertAdminSection(keys: AdminSectionKey | AdminSectionKey[]): Promise<void> {
  if (!(await canAccessAdminSection(keys))) throw new Error("Forbidden");
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
