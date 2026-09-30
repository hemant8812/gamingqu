import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAdminAccess } from "@/lib/adminAccess";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const access = await getAdminAccess();
  if (!access) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-6">
      <AdminSidebar enabled={[...access.allowed]} isSuperAdmin={access.isSuper} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
