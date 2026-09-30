import type { Metadata } from "next";
import Link from "next/link";
import { FiPercent, FiShield, FiClock, FiGift } from "react-icons/fi";
import { getSiteMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const PATH = "/cashback";
const PAGE_NAME = "Cashback";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `${siteName} cashback program for loyal customers. Terms & conditions apply.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, type: "website" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

export default async function CashbackPage() {
  const { base, siteName } = await getSiteMeta();
  const url = `${base}${PATH}`;
  const description = `${siteName} cashback program for loyal customers. Terms & conditions apply.`;
  const breadcrumb = breadcrumbLd([
    { name: "Home", url: `${base}/` },
    { name: PAGE_NAME, url },
  ]);
  const webPage = webPageLd({ name: PAGE_NAME, url, description, base });
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10">
        <JsonLd data={[breadcrumb, webPage]} />
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Cashback</h1>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full glass-light text-sm text-emerald-300 font-medium">
              <FiPercent className="h-4 w-4" />
              Cashback Program
            </div>
          </div>
          <p className="text-base opacity-70 mt-2">Earn rewards on eligible orders — transparent, secure, and automatically credited to your account.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink-800">
            <div className="p-6">
              <h2 className="text-xl font-bold">Program Overview</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <FiGift className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Cashback as account credit</div>
                    <div className="text-sm opacity-70">Credited after the order is completed and verified.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20">
                    <FiClock className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Processed in 24 - 48 business hours</div>
                    <div className="text-sm opacity-70">Estimated crediting time after verification.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-800">
            <div className="p-6">
              <h2 className="text-xl font-bold">How It Works</h2>
              <ol className="mt-4 list-decimal list-inside space-y-2 text-sm opacity-90">
                <li>Place an order for services marked “Cashback”.</li>
                <li>Complete payment and wait until the service is finished.</li>
                <li>Cashback credit is automatically added to the same account.</li>
                <li>Use the credit on your next eligible purchase.</li>
              </ol>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-800">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiShield className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold">Terms & Conditions</h2>
              </div>
              <ul className="space-y-2 text-sm opacity-90">
                <li>Cashback applies to specific services/products and announced promo periods.</li>
                <li>Issued as account credit; not redeemable for cash, transfer, or exchange.</li>
                <li>One cashback entitlement per order per account; duplicate or manipulated transactions are invalid.</li>
                <li>If an order is cancelled/refunded, any related cashback is voided.</li>
                <li>We may reject/void cashback in case of suspected abuse.</li>
                <li>Terms may change at any time without prior notice.</li>
              </ul>
            </div>
          </div>
        </section>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink-800 overflow-hidden">
            <div className="relative h-32 md:h-40 w-full bg-ink-800">
              <svg viewBox="0 0 360 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-95">
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="360" height="160" fill="url(#bg)" />
                <g stroke="#67E8F9" strokeWidth="3" strokeDasharray="6 6" fill="none" opacity="0.7">
                  <path d="M180 65c60 0 110 35 110 35" />
                  <path d="M180 65c-60 0-110 35-110 35" />
                </g>
                <g>
                  <circle cx="180" cy="60" r="30" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                  <text x="180" y="65" textAnchor="middle" fontSize="20" fontWeight="700" fill="#A7F3D0">24/7</text>
                </g>
                <g transform="translate(325,40)">
                  <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#38BDF8" />
                  <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#A7F3D0">%</text>
                </g>
                <g transform="translate(40,100)">
                  <rect x="-20" y="-14" width="80" height="28" rx="6" fill="#0F172A" stroke="#334155" />
                  <circle cx="-10" cy="0" r="6" fill="#22D3EE" />
                  <rect x="0" y="-6" width="52" height="12" rx="4" fill="#1E293B" />
                </g>
                <g transform="translate(320,100)">
                  <rect x="-60" y="-16" width="60" height="32" rx="6" fill="#0F172A" stroke="#334155" />
                  <path d="M-48 -6h36" stroke="#22D3EE" strokeWidth="2" />
                  <circle cx="-50" cy="-6" r="3" fill="#22D3EE" />
                </g>
                <g transform="translate(90,40)">
                  <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#38BDF8" />
                  <path d="M-6 0h12" stroke="#38BDF8" strokeWidth="2" />
                </g>
                <g transform="translate(140,108)">
                  <rect x="-40" y="-20" width="120" height="50" rx="8" fill="#0F172A" stroke="#334155" />
                  <rect x="-30" y="-10" width="100" height="30" rx="6" fill="url(#screen)" stroke="#1E40AF" />
                  <rect x="-10" y="34" width="60" height="6" rx="3" fill="#334155" />
                </g>
                <g transform="translate(255,40)">
                  <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#38BDF8" />
                  <rect x="-6" y="-4" width="12" height="8" rx="2" fill="#1E293B" />
                  <path d="M-2 4l-4 4" stroke="#22D3EE" strokeWidth="2" />
                </g>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
            <div className="p-6">
              <div className="font-semibold mb-2">Need Help?</div>
              <p className="text-sm opacity-80">Our team can explain the cashback program and its rules.</p>
              <Link href="/blog" className="btn btn-gaming btn-sm mt-4">Need Help ?</Link>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
}
