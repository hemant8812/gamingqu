import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import {
  Home,
  ShoppingCart,
  User,
  Wallet,
  Star,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

function formatDateTimeEnglish(d: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
}

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isMember = role === "MEMBER";
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-4">Please sign in to view your reviews.</p>
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
  const reviews = await db.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      isPublished: true,
      createdAt: true,
      service: { select: { slug: true, name: true, game: { select: { slug: true, name: true } } } },
      order: { select: { code: true } },
    },
  });
  const countPublished = reviews.filter((r) => r.isPublished).length;
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
                  <Link href="/dashboard/wallet" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300">
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/reviews" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
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
              <h1 className="text-2xl font-bold text-white">Reviews</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-white">{reviews.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 ring-1 ring-pink-500/20">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Published</p>
                  <p className="text-3xl font-bold text-white">{countPublished}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <div className="relative card-gaming rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Drafts</p>
                  <p className="text-3xl font-bold text-white">{reviews.length - countPublished}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 ring-1 ring-yellow-500/20">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Reviews</h2>
              </div>
              <div className="px-4 py-2">
                <div className="hidden md:grid md:grid-cols-[220px_160px_1fr_160px] gap-3 px-3 py-2 text-xs text-gray-400">
                  <span>DATE</span>
                  <span>RATING</span>
                  <span>DETAILS</span>
                  <span>STATUS</span>
                </div>
                <div className="divide-y divide-white/5">
                  {reviews.length === 0 ? (
                    <div className="px-6 py-14 flex flex-col items-center justify-center text-center">
                      <Star className="h-10 w-10 text-pink-400 mb-3" />
                      <div className="text-sm text-gray-400">You haven&apos;t written any reviews yet</div>
                    </div>
                  ) : (
                    reviews.map((r) => {
                      const stars = Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < r.rating ? "text-yellow-400" : "text-gray-600"}`} />
                      ));
                      const serviceName = r.service?.name ?? "Unknown service";
                      const gameName = r.service?.game?.name ?? "";
                      const title = r.title ?? serviceName;
                      const orderLink = r.order?.code ? `/dashboard/orders?order=${encodeURIComponent(r.order.code)}` : null;
                      return (
                        <div key={r.id} className="px-3 py-3 hover:bg-white/[0.03]">
                          <div className="grid grid-cols-1 md:grid-cols-[220px_160px_1fr_160px] gap-3 items-center">
                            <div className="text-sm text-white">{formatDateTimeEnglish(new Date(r.createdAt))}</div>
                            <div className="flex items-center gap-1">{stars}</div>
                            <div className="text-sm">
                              <div className="text-white font-medium">{title}</div>
                              <div className="text-xs text-gray-500">{gameName}</div>
                              {orderLink ? (
                                <div className="text-xs mt-1">
                                  <Link href={orderLink} className="text-blue-400 hover:text-blue-300">View order</Link>
                                </div>
                              ) : null}
                              {r.comment ? <div className="text-gray-300 mt-1">{r.comment}</div> : null}
                            </div>
                            <div className={r.isPublished ? "text-emerald-400 text-sm font-semibold" : "text-yellow-400 text-sm font-semibold"}>
                              {r.isPublished ? "Published" : "Draft"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
