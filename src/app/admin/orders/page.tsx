import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Card } from "@/components/ui/card";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search orders"
              className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white w-64"
            />
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm">Export</button>
          </div>
        </div>
        <div className="mt-6">
          <Card className="rounded-2xl border-zinc-900 p-0 overflow-hidden">
            <div className="min-h-40 flex items-center justify-center text-zinc-400">Data table coming soon</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
