import type { Metadata } from "next";
import Link from "next/link";
import { FiShield, FiLock, FiUserCheck, FiRefreshCw, FiMail } from "react-icons/fi";
import { getSiteMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const PATH = "/trust-safety";
const PAGE_NAME = "Trust & Safety";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `Customer trust and safety policies of ${siteName}.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, siteName, type: "website" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

export default async function TrustSafetyPage() {
  const { base, siteName } = await getSiteMeta();
  const url = `${base}${PATH}`;
  const description = `Customer trust and safety policies of ${siteName}.`;

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        <JsonLd
          data={[
            breadcrumbLd([
              { name: "Home", url: `${base}/` },
              { name: PAGE_NAME, url },
            ]),
            webPageLd({ name: PAGE_NAME, url, description, base }),
          ]}
        />
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Trust &amp; Safety</h1>
            <Link href="/contact" className="btn btn-gaming btn-sm">Need Help?</Link>
          </div>
          <p className="text-base opacity-70 mt-2">
            {siteName} is committed to protecting account security and customer privacy through strict and transparent procedures.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold">Account Protection</h2>
            </div>
            <ul className="space-y-3 text-sm opacity-80">
              <li>Boosters operate in secure environments with limited access.</li>
              <li>No permanent credential storage; access is removed after completion.</li>
              <li>Communication via official channels only to minimize risk.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiLock className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-bold">Privacy &amp; Data</h2>
            </div>
            <ul className="space-y-3 text-sm opacity-80">
              <li>Customer data is processed only for service delivery.</li>
              <li>No sharing with third parties without consent.</li>
              <li>Data deletion requests are handled according to policy.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiUserCheck className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold">Booster Verification</h2>
            </div>
            <ul className="space-y-3 text-sm opacity-80">
              <li>Strict selection based on experience and reputation.</li>
              <li>Regular evaluations to maintain service quality.</li>
              <li>Violations handled with firm sanctions.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiRefreshCw className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-bold">Resolution Procedures</h2>
            </div>
            <ul className="space-y-3 text-sm opacity-80">
              <li>Clear communication channels for complaints or questions.</li>
              <li>Quick investigation and fair resolutions.</li>
              <li>Documented processes for transparency.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiMail className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold">Need assistance?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-gaming btn-sm">Contact Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
