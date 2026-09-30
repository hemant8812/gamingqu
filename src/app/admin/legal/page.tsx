import { LegalManager } from "@/components/admin/legal/LegalManager";
import { Metadata } from "next";
import { canAccessAdminSection } from "@/lib/adminAccess";

export const metadata: Metadata = {
  title: "Legal Pages | Admin Dashboard",
  description: "Manage legal documents and pages",
};

export default async function AdminLegalPage() {
  if (!(await canAccessAdminSection("legal"))) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <LegalManager />
    </div>
  );
}
