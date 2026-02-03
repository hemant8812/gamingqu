import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import React from "react";
import { ServiceDataManager } from "@/components/admin/services/ServiceDataManager";

type ServiceOption = { id: number; name: string; slug: string; price: string };

async function getServices(): Promise<ServiceOption[]> {
  try {
    const list = await db.service.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, name: true, slug: true, price: true },
    });
    return list.map((s) => ({ ...s, price: s.price.toString() }));
  } catch {
    return [];
  }
}

export default async function AdminServiceDataPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const services = await getServices();

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Service Data</h1>
          <p className="text-gray-400">Create configurable details for services</p>
        </div>
        <ServiceDataManager services={services} />
      </div>
    </div>
  );
}
