import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import {
  Home,
  ShoppingCart,
  User,
  Wallet,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Activity,
  CheckCircle,
  Shield,
  ChevronRight,
  Eye,
  Clock,
} from "lucide-react";
import { FiLock } from "react-icons/fi";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-4">
            <FiLock className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to access your dashboard.</p>
          <Link href="/login" className="btn btn-gaming">Sign In</Link>
        </div>
      </div>
    );
  }
  if (!isMember) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is available for members only.</p>
        </div>
      </div>
    );
  }
  const name = session.user?.name ?? session.user?.username ?? "Member";
  const stats = { active: 2, completed: 12, wallet: "$150.00", reviews: 8 };
  const orders = [
    { id: "ORD-001", title: "Diamond Boost", game: "League of Legends", booster: "ProPlayer123", price: "$99.99", status: "In Progress", percent: 65 },
    { id: "ORD-002", title: "Mythic +15 Carry", game: "World of Warcraft", booster: null, price: "$29.99", status: "Completed", percent: 100 },
    { id: "ORD-003", title: "Immortal to Radiant", game: "Valorant", booster: null, price: "$79.99", status: "Pending", percent: 0 },
  ];
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6 lg:block">
            <nav className="bg-[#0F172A] border border-white/10 rounded-2xl p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <Star className="h-4 w-4" />
                    <span>Reviews</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-disabled>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
              <div className="border-t border-white/10 mt-4 pt-4">
                <button type="button" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </aside>
          <main>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {String(name)}!</h1>
                <p className="text-gray-400">Here&apos;s what&apos;s happening with your orders</p>
              </div>
              <Link href="/" className="btn btn-gaming btn-sm">Browse Services</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-white">{stats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Wallet Balance</p>
                  <p className="text-3xl font-bold text-white">{stats.wallet}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Reviews Given</p>
                  <p className="text-3xl font-bold text-white">{stats.reviews}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Active Orders</h3>
                  <Link href="/dashboard/orders" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300" aria-label="View all">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="p-4 space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-xl border border-white/10 bg-[#0A0E17] p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                          <div className="text-xs text-gray-500">{o.id}</div>
                          <div className="text-white font-semibold">{o.title}</div>
                          <div className="text-sm text-gray-500">{o.game}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-lg ${
                            o.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" :
                            o.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/20 text-blue-400"
                          }`}>
                            {o.status === "Completed" ? <CheckCircle className="h-4 w-4" /> : o.status === "Pending" ? <Clock className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                            {o.status}
                          </span>
                          <button type="button" className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5" aria-label={`View details ${o.id}`}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${o.percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{o.percent}%</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-400">Booster: </span>
                          <span className="text-white">{o.booster ?? "-"}</span>
                        </div>
                        <div className="text-emerald-400 font-semibold">{o.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
