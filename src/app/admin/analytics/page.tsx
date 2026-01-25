import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
  }
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
            <div className="text-sm opacity-70">Revenue Overview</div>
            <div className="mt-4 h-40 bg-base-200 rounded-box flex items-center justify-center opacity-30">Chart Placeholder</div>
          </div>
          <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
            <div className="text-sm opacity-70">Orders by Game</div>
            <div className="mt-4 h-40 bg-base-200 rounded-box flex items-center justify-center opacity-30">Chart Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
}
