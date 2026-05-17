import type { Metadata } from "next";
import Link from "next/link";
import { FiThumbsUp, FiShield, FiClock, FiAward, FiUsers, FiArrowRight } from "react-icons/fi";
import { getSiteMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const PATH = "/work-with-us";
const PAGE_NAME = "Work With Us";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `Join as a professional booster at ${siteName}.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, siteName, type: "website" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

export default async function WorkWithUsPage() {
  const { base, siteName } = await getSiteMeta();
  const url = `${base}${PATH}`;
  const description = `Join as a professional booster at ${siteName}.`;

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
            <h1 className="text-4xl font-extrabold tracking-tight">Work With Us</h1>
            <Link href="/booster/apply" className="btn btn-gaming btn-sm">Apply as Booster</Link>
          </div>
          <p className="text-base opacity-70 mt-2">Join the {siteName} team and help gamers reach their goals.</p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiThumbsUp className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold">Benefits of being a booster</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <FiUsers className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold">Professional Community</div>
                  <div className="text-sm opacity-70">Work with a solid, supportive team.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <FiShield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">Secure Platform</div>
                  <div className="text-sm opacity-70">Systems that protect account privacy and security.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <FiAward className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">Competitive Earnings</div>
                  <div className="text-sm opacity-70">Fair pay aligned with performance.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <FiClock className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-semibold">Flexible Hours</div>
                  <div className="text-sm opacity-70">Set your schedule around your availability.</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/booster/apply" className="btn btn-gaming">
                Apply now
                <FiArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiUsers className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold">Application steps</h2>
            </div>
            <ol className="space-y-3 text-sm opacity-80 list-decimal list-inside">
              <li>Create an account or sign in.</li>
              <li>Open the application page and fill in your motivation.</li>
              <li>Wait for admin verification.</li>
              <li>Start receiving orders and deliver professionally.</li>
            </ol>
          </aside>
        </section>
      </div>
    </div>
  );
}
