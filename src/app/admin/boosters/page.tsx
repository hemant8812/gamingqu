import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { FiStar, FiSearch, FiPlus } from "react-icons/fi";

export default async function AdminBoostersPage() {
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
          <h1 className="text-3xl font-bold text-white">Manage Boosters</h1>
          <p className="text-gray-400">View and manage booster applications</p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search boosters..."
              className="w-full pl-12 pr-4 h-12 bg-[#0F172A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors">
            <FiPlus className="h-5 w-5" />
            New Application
          </button>
        </div>

        {/* Boosters Table Card */}
        <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">Booster Applications</h3>
          </div>
          <div className="p-16 flex flex-col items-center justify-center text-gray-500">
            <FiStar className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg">No booster applications</p>
            <p className="text-sm">Applications will appear here when users apply</p>
          </div>
        </div>
      </div>
    </div>
  );
}
