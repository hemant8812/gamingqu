import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { FiLock } from "react-icons/fi";
import { BoosterSidebar } from "@/components/dashboard/BoosterSidebar";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Booster Messages | GamingQu",
};

export default async function BoosterMessagesPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isBooster = role === "BOOSTER";

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-4">
            <FiLock className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view messages.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!isBooster) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for boosters only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 hidden lg:block lg:sticky lg:top-8 self-start">
            <BoosterSidebar active="messages" />
          </aside>
          <main>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <div className="text-sm text-gray-400">Chat and updates will appear here</div>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white mb-2">Coming soon</div>
              <div className="text-sm text-gray-400 mb-5">
                Messages will be available once the job system is connected to chat.
              </div>
              <Link href="/booster" className="btn btn-gaming btn-sm">Back to Overview</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

