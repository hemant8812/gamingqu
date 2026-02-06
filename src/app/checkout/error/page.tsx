import type { Metadata } from "next";
import Link from "next/link";
import { X, AlertCircle } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Payment Error",
  description: "Your payment could not be processed.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  not_signed_in: "You must sign in to proceed with payment.",
  missing_order_code: "Your order code is missing or invalid.",
  order_not_found: "We cannot find your order. Please check and try again.",
  order_not_pending: "Your order is not pending. It might be already processed or canceled.",
  unsupported_method: "This payment method is not supported.",
  paypal_create_failed: "Failed to create PayPal order.",
  missing_approve_url: "Missing approval URL from PayPal.",
  capture_failed: "PayPal capture failed.",
  payment_not_found: "Payment record was not found.",
  cryptomus_create_failed: "Failed to create Cryptomus invoice.",
  missing_token: "Missing token parameter.",
  server_error: "A server error occurred during payment.",
};

export default async function PaymentErrorPage({ searchParams }: { searchParams: Promise<{ code?: string; order?: string }> }) {
  const sp = await searchParams;
  const code = String(sp?.code || "").trim();
  const order = String(sp?.order || "").trim();
  const title = "Payment Failed";
  const reason = messages[code] || "We couldn't process your payment";
  const tryAgainHref = order ? `/api/orders/pay?order=${encodeURIComponent(order)}` : "/dashboard/orders";
  const supportHref = "/contact";
  let amountText: string | null = null;
  let methodText: string | null = null;
  let createdAtText: string | null = null;
  let timeText: string | null = null;
  let statusText: "Failed" | "Pending" | "Cancelled" | "In Progress" | "Completed" = "Failed";
  try {
    if (order) {
      const rec = await db.order.findUnique({
        where: { code: order },
        select: { amount: true, currency: true, methodSlug: true, status: true, fulfillmentStatus: true, createdAt: true },
      });
      if (rec) {
        const symbol = rec.currency === "EUR" ? "€" : "$";
        amountText = `${symbol}${Number.parseFloat(rec.amount.toString()).toFixed(2)}`;
        methodText = rec.methodSlug ? rec.methodSlug.charAt(0).toUpperCase() + rec.methodSlug.slice(1) : null;
        const dt = new Date(rec.createdAt as unknown as string);
        createdAtText = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(dt);
        timeText = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(dt);
        statusText =
          rec.status === "CANCELED" || rec.status === "FAILED"
            ? "Failed"
            : rec.fulfillmentStatus === "IN_PROGRESS" || rec.fulfillmentStatus === "ACCEPTED"
            ? "In Progress"
            : rec.status === "PAID"
            ? "Completed"
            : "Pending";
      }
    }
  } catch {}
  return (
    <div className="min-h-screen mesh-gradient text-base-content">
      <div className="particles" />
      <main className="mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-16">
        <div className="mt-8 rounded-[32px] bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl p-5 md:p-8 container-entrance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left */}
            <section className="flex flex-col justify-center">
              <div className="mx-auto lg:mx-0 inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-b from-rose-500 to-pink-500 text-white ring-4 ring-rose-300/40 shadow-[0_0_40px_#ef444480] icon-pulse">
                <X className="h-10 w-10" />
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-black text-white tracking-tight text-center lg:text-left">{title}</h1>
              <p className="mt-2 text-base md:text-lg text-gray-300 text-center lg:text-left">We couldn&apos;t process your payment</p>
              <div className="mt-6">
                <div className="relative overflow-hidden rounded-2xl border border-rose-500/25 bg-[#0F172A]/70 p-3 md:p-4 text-center error-gradient">
                  <div className="text-xs uppercase tracking-wider text-gray-400 font-bold inline-flex items-center gap-2 justify-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                    Error Reason
                  </div>
                  <div className="mt-1 font-bold text-rose-300 text-lg leading-tight">{reason}</div>
                </div>
                <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-2 md:p-3">
                  <div className="flex items-center gap-1 font-bold text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    Need Help?
                  </div>
                  <p className="mt-1 text-sm text-gray-300 leading-snug">
                    Please check your card details and account balance, then try again. If the problem persists, contact our support team.
                  </p>
                </div>
              </div>
            </section>
            {/* Right */}
            <section className="flex flex-col justify-center">
              <div className="space-y-2 bg-transparent p-1 md:p-2">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-gray-400">ID Order</span>
                  <span className="text-sm font-bold text-gray-100">{order || "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-gray-400">Attempted Amount</span>
                  <span className="text-sm font-bold text-gray-100">{amountText ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-gray-400">Payment Method</span>
                  <span className="text-sm font-bold text-gray-100">{methodText ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-gray-400">Transaction Date</span>
                  <span className="text-sm font-bold text-gray-100">{createdAtText ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-gray-400">Transaction Time</span>
                  <span className="text-sm font-bold text-gray-100">{timeText ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold ring-1 ring-rose-500/30">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    {statusText}
                  </span>
                </div>
              </div>
              <div className="mt-6 w-full grid grid-cols-2 gap-3">
                <a href={tryAgainHref} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition font-semibold text-sm shadow-lg ring-1 ring-rose-500/30">
                  Try Again
                </a>
                <Link href={supportHref} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 text-gray-200 hover:bg-white/10 transition font-semibold text-sm ring-1 ring-white/10">
                  Contact Support
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes containerEntrance{from{opacity:0;transform:scale(.9) translateY(40px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .container-entrance{animation:containerEntrance .8s cubic-bezier(.34,1.56,.64,1) both}
        @keyframes pulseScale{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .icon-pulse{animation:pulseScale 1.6s ease-in-out infinite}
        .error-gradient{
          background:
            radial-gradient(500px circle at 12% 15%, rgba(244,63,94,.12), transparent 40%),
            radial-gradient(600px circle at 85% 80%, rgba(236,72,153,.12), transparent 45%);
        }
      `}</style>
    </div>
  );
}
