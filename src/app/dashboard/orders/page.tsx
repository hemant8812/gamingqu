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
  CheckCircle,
  Clock,
  Shield,
  Eye,
  Search as SearchIcon,
} from "lucide-react";

type OrderItem = {
  id: string;
  title: string;
  game: string;
  status: "In Progress" | "Completed" | "Pending" | "Cancelled";
  percent: number;
  price: string;
};

const SAMPLE_ORDERS: OrderItem[] = [
  { id: "ORD-001", title: "Diamond Boost", game: "League of Legends", status: "In Progress", percent: 65, price: "$99.99" },
  { id: "ORD-002", title: "Mythic +15 Carry", game: "World of Warcraft", status: "Completed", percent: 100, price: "$29.99" },
  { id: "ORD-003", title: "Immortal to Radiant", game: "Valorant", status: "Pending", percent: 0, price: "$199.99" },
];

function StatusBadge({ status }: { status: OrderItem["status"] }) {
  const cls =
    status === "Completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "Pending"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "Cancelled"
      ? "bg-red-500/20 text-red-400"
      : "bg-blue-500/20 text-blue-400";
  const Icon =
    status === "Completed" ? CheckCircle : status === "Pending" ? Clock : status === "Cancelled" ? Shield : Shield;
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-lg ${cls}`}>
      <Icon className="h-4 w-4" />
      {status}
    </span>
  );
}

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view your orders.</p>
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
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="lg:block">
            <nav className="bg-[#0F172A] border border-white/10 rounded-2xl p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">My Orders</h1>
              <Link href="/" className="btn btn-gaming btn-sm">New Order</Link>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="relative w-80 max-w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-9 pr-3 h-10 bg-[#0A0E17] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-9 px-3 rounded-xl text-sm bg-white/10 text-white">All</button>
                  <button className="h-9 px-3 rounded-xl text-sm bg-white/5 text-gray-300 hover:bg-white/10">Active</button>
                  <button className="h-9 px-3 rounded-xl text-sm bg-white/5 text-gray-300 hover:bg-white/10">Completed</button>
                  <button className="h-9 px-3 rounded-xl text-sm bg-white/5 text-gray-300 hover:bg-white/10">Cancelled</button>
                </div>
              </div>
              <div className="px-4 py-2">
                <div className="grid grid-cols-[160px_1fr_140px_200px_120px_120px] gap-3 px-3 py-2 text-xs text-gray-400">
                  <span>ORDER</span>
                  <span>SERVICE</span>
                  <span>STATUS</span>
                  <span>PROGRESS</span>
                  <span>PRICE</span>
                  <span>ACTIONS</span>
                </div>
                <div className="divide-y divide-white/5">
                  {SAMPLE_ORDERS.map((o) => (
                    <div key={o.id} className="grid grid-cols-[160px_1fr_140px_200px_120px_120px] gap-3 px-3 py-3 items-center hover:bg-white/[0.03]">
                      <div className="text-xs text-gray-400">{o.id}</div>
                      <div>
                        <div className="text-white font-medium">{o.title}</div>
                        <div className="text-xs text-gray-500">{o.game}</div>
                      </div>
                      <div>
                        <StatusBadge status={o.status} />
                      </div>
                      <div>
                        {o.status === "In Progress" || o.status === "Completed" ? (
                          <>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${o.percent}%` }} />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{o.percent}%</div>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </div>
                      <div className="text-emerald-400 font-semibold">{o.price}</div>
                      <div className="flex items-center gap-2">
                        <button type="button" className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-300" aria-label={`View ${o.id}`}>
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
