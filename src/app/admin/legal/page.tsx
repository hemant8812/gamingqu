import { LegalManager } from "@/components/admin/legal/LegalManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Pages | Admin Dashboard",
  description: "Manage legal documents and pages",
};

export default function AdminLegalPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <LegalManager />
    </div>
  );
}
