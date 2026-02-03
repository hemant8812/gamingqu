"use client";
import React from "react";
 
 import { useEffect, useState } from "react";
 import { useParams, useRouter } from "next/navigation";
 import Link from "next/link";
 import { useCurrency } from "@/app/providers";
 import { formatPrice } from "@/lib/formatPrice";
import { CreditCard, Wallet, Banknote, ShieldCheck, AlertTriangle } from "lucide-react";
 import { useSession } from "next-auth/react";
 
 type PurchaseData = {
   serviceSlug: string;
   basePrice: number;
   fromLevel: number | null;
   toLevel: number | null;
   subtotal: number;
   totalPrice: number;
   ts: number;
  selectedOptions?: Array<{ title: string; values: string[] }>;
 };
 
 export default function CheckoutPage() {
   const params = useParams<{ service?: string }>();
   const router = useRouter();
   const { symbol: currency, convert } = useCurrency();
  const { data: session, status } = useSession();
   const [data, setData] = useState<PurchaseData | null>(null);
  const [method, setMethod] = useState<"card" | "paypal" | "bank" | null>(null);
  const [serviceName, setServiceName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");
 
   const service = Array.isArray(params?.service) ? params?.service?.[0] : params?.service ?? "";
 
   useEffect(() => {
     if (!service) return;
     try {
       const raw = window.localStorage.getItem(`checkout:${service}`);
       if (raw) {
         const parsed = JSON.parse(raw) as PurchaseData;
        setTimeout(() => setData(parsed), 0);
       }
     } catch {}
   }, [service]);
  useEffect(() => {
    if (!service) return;
    (async () => {
      try {
        const res = await fetch(`/api/services/search?q=${encodeURIComponent(service)}`, { cache: "no-store" });
        const json = await res.json();
        const match = Array.isArray(json?.services)
          ? (json.services as Array<{ name: string; slug: string }>).find((s) => s.slug === service)
          : null;
        const name =
          match?.name ??
          service
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());
        setTimeout(() => setServiceName(name), 0);
      } catch {}
    })();
  }, [service]);
 
   useEffect(() => {
     if (!service) {
       router.push("/");
     }
   }, [service, router]);
 
  const levelRange =
    data && data.fromLevel != null && data.toLevel != null
      ? `${data.fromLevel}–${data.toLevel}`
      : null;
  const totalFmt = data ? formatPrice(convert(data.totalPrice)) : null;
  const items = data?.totalPrice ?? 0;
  const feeBase =
    !method ? 0 : method === "card" ? items * 0.029 + 0.3 : method === "paypal" ? items * 0.035 + 0.49 : 0;
  const amount = items + feeBase;
  const itemsFmt = formatPrice(convert(items));
  const feeFmt = formatPrice(convert(feeBase));
  const amountFmt = formatPrice(convert(amount));
 
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Secure & protected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-bold">Order Detail</h2>
                <div className="text-gray-400 text-lg font-bold text-white">{serviceName}</div>
              </div>
              <div className="p-6">
                {data ? (
                  <div className="rounded-xl bg-white/5 border border-white/10">
                    <div className="grid grid-cols-2 gap-3 p-4">
                      {levelRange && (
                        <>
                          <div className="text-sm text-gray-300">Level</div>
                          <div className="text-right text-sm font-semibold text-white">{levelRange}</div>
                        </>
                      )}
                      {Array.isArray(data.selectedOptions) &&
                        data.selectedOptions.map((opt, i) =>
                          opt.values.map((v, j) => (
                            <React.Fragment key={`${i}-${j}`}>
                              <div className="text-sm text-gray-300">{opt.title}</div>
                              <div className="text-right text-sm font-semibold text-white">{v}</div>
                            </React.Fragment>
                          ))
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No selection data found for this service.</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-bold">Your Details</h2>
              </div>
              <div className="p-6">
                {status === "authenticated" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Discord</label>
                      <input
                        type="text"
                        className="w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="username#1234"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Character Name</label>
                      <input
                        type="text"
                        className="w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="Your character name"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        className="w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Discord</label>
                      <input
                        type="text"
                        className="w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="username#1234"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Character Name</label>
                      <input
                        type="text"
                        className="w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="Your character name"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-4 relative rounded-xl overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-2 bg-yellow-500" />
                  <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-yellow-500/5 p-3 pl-5">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-6 w-6 text-yellow-400 mt-0.5" />
                      <p className="text-xs text-yellow-200">
                        The information above (email and password) is requested solely to establish your customer account on this
                        website. It is not game‑account data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden lg:sticky lg:top-6 lg:self-start">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-bold">Payment Method</h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border ${method === "card" ? "border-blue-500 bg-blue-600/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    <div className="text-sm font-semibold">Card (Visa / Mastercard)</div>
                  </div>
                  <input type="radio" name="pay-method" checked={method === "card"} onChange={() => setMethod("card")} />
                </label>
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border ${method === "paypal" ? "border-blue-500 bg-blue-600/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-emerald-400" />
                    <div className="text-sm font-semibold">PayPal</div>
                  </div>
                  <input type="radio" name="pay-method" checked={method === "paypal"} onChange={() => setMethod("paypal")} />
                </label>
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border ${method === "bank" ? "border-blue-500 bg-blue-600/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-pink-400" />
                    <div className="text-sm font-semibold">Bank Transfer</div>
                  </div>
                  <input type="radio" name="pay-method" checked={method === "bank"} onChange={() => setMethod("bank")} />
                </label>
                <div className="px-2">
                  <div className="text-lg font-bold mb-1">Summary</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-sm text-gray-300">Item(s)</span>
                      <span className="text-sm font-semibold text-white">
                        <span className="gradient-text">
                          {itemsFmt.whole}
                          {itemsFmt.showDecimal && <span>,{itemsFmt.decimal}</span>}
                        </span>
                        <span className="ml-1 text-gray-400">{currency}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-sm text-gray-300">Payment service fee</span>
                      <span className="text-sm font-semibold text-white">
                        <span className="gradient-text">
                          {feeFmt.whole}
                          {feeFmt.showDecimal && <span>,{feeFmt.decimal}</span>}
                        </span>
                        <span className="ml-1 text-gray-400">{currency}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-300">Amount to pay</span>
                      <span className="text-xl font-extrabold text-white">
                        <span className="gradient-text">
                          {amountFmt.whole}
                          {amountFmt.showDecimal && <span>,{amountFmt.decimal}</span>}
                        </span>
                        <span className="ml-1 text-gray-400">{currency}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-gaming w-full mt-2"
                  disabled={!method || !data}
                  onClick={() => {
                    try {
                      if (!method || !data) return;
                      const payload = {
                        ...data,
                        method,
                        contact: {
                          email: session?.user?.email ?? email,
                          discord,
                          characterName,
                        },
                      };
                      window.localStorage.setItem(`checkout:${service}:method`, method);
                      window.localStorage.setItem(`checkout:${service}:payload`, JSON.stringify(payload));
                    } catch {}
                  }}
                >
                  Pay Now
                </button>
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">100% Money-Back Guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
 }
