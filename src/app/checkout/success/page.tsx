import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was completed successfully.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const sp = await searchParams;
  const order = String(sp?.order || "").trim();
  const title = "Payment Successful";
  const desc = "Thank you! Your payment has been confirmed.";
  const ordersHref = `/dashboard/orders${order ? `?order=${encodeURIComponent(order)}` : ""}`;
  const receiptHref = `/api/orders/receipt${order ? `?order=${encodeURIComponent(order)}` : ""}`;
  let totalText: string | null = null;
  let methodText: string | null = null;
  let createdAtText: string | null = null;
  let timeText: string | null = null;
  let statusText: "Completed" | "Pending" | "Cancelled" | "In Progress" | null = null;
  let amountRaw: number | null = null;
  let currencyCode: string | null = null;
  if (order) {
    try {
      const rec = await db.order.findUnique({
        where: { code: order },
        select: { id: true, amount: true, currency: true, methodSlug: true, status: true, fulfillmentStatus: true, createdAt: true },
      });
      if (rec) {
        const symbol = rec.currency === "EUR" ? "€" : "$";
        totalText = `${symbol}${Number.parseFloat(rec.amount.toString()).toFixed(2)}`;
        amountRaw = Number.parseFloat(rec.amount.toString());
        currencyCode = rec.currency ?? "USD";
        methodText = rec.methodSlug ? rec.methodSlug.charAt(0).toUpperCase() + rec.methodSlug.slice(1) : null;
        const dt = new Date(rec.createdAt as unknown as string);
        createdAtText = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(dt);
        timeText = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(dt);
        statusText =
          rec.status === "PAID"
            ? "Completed"
            : rec.status === "CANCELED" || rec.status === "FAILED"
            ? "Cancelled"
            : rec.fulfillmentStatus === "IN_PROGRESS" || rec.fulfillmentStatus === "ACCEPTED"
            ? "In Progress"
            : "Pending";
      }
    } catch {}
  }
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <div className="min-h-screen mesh-gradient text-base-content">
      <div className="particles" />
      <div className="confetti">
        {Array.from({ length: 100 }).map((_, i) => {
          const left = `${((i * 7 + (i % 13) * 3) % 100)}%`;
          const size = [8, 10, 12][i % 3];
          const round = i % 4 === 0 ? "50%" : "2px";
          const colors = ["#22d3ee", "#f43f5e", "#a78bfa", "#34d399", "#f59e0b", "#14b8a6", "#fb7185", "#60a5fa", "#10b981", "#fbbf24", "#ef4444", "#6366f1", "#22c55e", "#f472b6", "#0ea5e9", "#fde047", "#84cc16"];
          const color = colors[i % colors.length];
          const delay = (i % 16) * 0.08;
          const dur = 1.8 + ((i % 10) * 0.06);
          const names = ["confettiFall", "confettiDriftL", "confettiDriftR", "confettiRise"];
          const name = names[i % names.length];
          const top = name === "confettiRise" ? "calc(100vh + 24px)" : undefined;
          return (
            <span
              key={i}
              style={{
                left,
                top,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: round,
                background: color,
                animationDelay: `${delay}s`,
                animationDuration: `${dur}s`,
                animationName: name,
              }}
            />
          );
        })}
      </div>
      <main className="mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-16">
        <div className="mt-10 md:mt-16 rounded-[32px] bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl p-5 md:p-8 container-entrance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left */}
            <section className="flex flex-col justify-center">
              <div className="mx-auto lg:mx-0 inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500 text-white ring-4 ring-emerald-300/40 shadow-[0_0_40px_#10b98180] icon-pulse">
                <Check className="h-10 w-10" />
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-black text-white tracking-tight text-center lg:text-left">{title}</h1>
              <p className="mt-2 text-base md:text-lg text-gray-300 text-center lg:text-left">{desc}</p>
              <div className="mt-6">
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#0F172A]/70 p-5 text-center amount-gradient">
                  <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">Amount Paid</div>
                  <div className="mt-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 text-4xl md:text-5xl">
                    {totalText ?? "-"}
                  </div>
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
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold ring-1 ring-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {statusText ?? "Completed"}
                  </span>
                </div>
              </div>
              <div className="mt-5 w-full grid grid-cols-2 gap-3">
                <Link href={receiptHref} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition font-semibold text-sm shadow-lg ring-1 ring-emerald-500/30">
                  Download Receipt
                </Link>
                <Link href={ordersHref} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 text-gray-200 hover:bg-white/10 transition font-semibold text-sm ring-1 ring-white/10">
                  View Order
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes containerEntrance{from{opacity:0;transform:scale(.9) translateY(40px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .container-entrance{animation:containerEntrance .8s cubic-bezier(.34,1.56,.64,1) both}
        .amount-gradient{
          background:
            radial-gradient(500px circle at 12% 15%, rgba(16,185,129,.12), transparent 40%),
            radial-gradient(600px circle at 85% 80%, rgba(45,212,191,.12), transparent 45%);
        }
        @keyframes pulseScale{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .icon-pulse{animation:pulseScale 1.6s ease-in-out infinite}
        .confetti{ position:fixed; inset:0; pointer-events:none; z-index:20; overflow:hidden }
        .confetti span{
          position:absolute; top:-24px; opacity:0; will-change:transform,opacity;
          animation-name: confettiFall; animation-timing-function: cubic-bezier(.22,.61,.36,1); animation-fill-mode: forwards;
        }
        @keyframes confettiFall{
          0%{ opacity:0; transform:translateY(-40px) rotate(0deg) }
          10%{ opacity:1 }
          100%{ opacity:0; transform:translateY(120vh) rotate(360deg) }
        }
        @keyframes confettiRise{
          0%{ opacity:0; transform:translateY(40px) rotate(0deg) }
          10%{ opacity:1 }
          100%{ opacity:0; transform:translateY(-120vh) rotate(-360deg) }
        }
        @keyframes confettiDriftL{
          0%{ opacity:0; transform:translateY(-40px) translateX(-10px) rotate(0deg) }
          10%{ opacity:1 }
          100%{ opacity:0; transform:translateY(120vh) translateX(-80px) rotate(360deg) }
        }
        @keyframes confettiDriftR{
          0%{ opacity:0; transform:translateY(-40px) translateX(10px) rotate(0deg) }
          10%{ opacity:1 }
          100%{ opacity:0; transform:translateY(120vh) translateX(80px) rotate(360deg) }
        }
      `}</style>
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                var params = {
                  value: ${amountRaw != null ? JSON.stringify(amountRaw) : "null"},
                  currency: ${JSON.stringify(currencyCode ?? "USD")},
                  transaction_id: ${JSON.stringify(order || "")}
                };
                if (typeof window !== "undefined") {
                  if (typeof window.gtag === "function") {
                    window.gtag('event', 'conversion_event_purchase', params);
                  } else if (Array.isArray(window.dataLayer)) {
                    window.dataLayer.push(Object.assign({ event: 'conversion_event_purchase' }, params));
                  }
                }
              } catch {}
            })();
          `,
        }}
      />
    </div>
  );
}
