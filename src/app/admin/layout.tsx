import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <>{children}</>;
  }

  let enabled: string[] = [];
  try {
    const perms = await db.adminPermission.findMany({ where: { enabled: true }, select: { key: true } });
    enabled = perms.map((p) => p.key);
  } catch {
    enabled = [];
  }

  return (
    <div className="admin-shell mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-6">
      <AdminSidebar enabled={enabled} isSuperAdmin={role === "SUPERADMIN"} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
