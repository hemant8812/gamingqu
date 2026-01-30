import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { FiBarChart2, FiTrendingUp, FiDollarSign, FiShoppingCart } from "react-icons/fi";

export default async function AdminAnalyticsPage() {
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

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Sales and performance statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white">$0</p>
                <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="h-4 w-4" />
                  +0% vs last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FiDollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <FiShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Order Value</p>
                <p className="text-3xl font-bold text-white">$0</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <FiBarChart2 className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">0%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FiTrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Revenue Overview</h3>
            <div className="h-56 bg-[#0A0E17] rounded-xl flex items-center justify-center text-gray-500 border border-white/5">
              <div className="text-center">
                <FiBarChart2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Orders by Game</h3>
            <div className="h-56 bg-[#0A0E17] rounded-xl flex items-center justify-center text-gray-500 border border-white/5">
              <div className="text-center">
                <FiBarChart2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
