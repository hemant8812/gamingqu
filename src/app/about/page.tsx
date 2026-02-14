import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";
import { getWebsiteSettingCore } from "@/lib/settings";
import { FiShield, FiZap, FiUsers, FiTrendingUp, FiThumbsUp, FiMail, FiEye, FiHeadphones, FiSliders } from "react-icons/fi";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const base = getBaseUrl();
  const s = await getWebsiteSettingCore();
  const siteName = s?.siteName ?? "Gamingqu";
  const title = "About Us";
  const description = s?.tagline ?? "Professional Game Boosting Services";
  return {
    title,
    description,
    alternates: { canonical: `${base}/about` },
    openGraph: {
      title,
      description,
      url: `${base}/about`,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage() {
  const base = getBaseUrl();
  const s = await getWebsiteSettingCore();
  const nonce = (await headers()).get("x-nonce") || "";
  const siteName = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Professional Game Boosting Services";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "About Us", item: `${base}/about` },
    ],
  };
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Us",
    url: `${base}/about`,
    description: tagline,
  };
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiZap className="h-8 w-8 text-cyan-400" />
              <h1 className="text-4xl font-extrabold tracking-tight">About {siteName}</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/work-with-us" className="btn btn-gaming btn-sm">Work with us</Link>
              <Link href="/contact" className="btn btn-gaming btn-sm">Contact</Link>
            </div>
          </div>
          <p className="text-base opacity-70 mt-2">{tagline}</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiThumbsUp className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold">Our Mission</h2>
            </div>
            <p className="text-sm opacity-80">
              We deliver game boosting services that are safe, fast, and professional. Our experienced team focuses on transparency and a consistently great experience for every gamer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <FiShield className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-semibold">Trusted Security</div>
                  <div className="text-sm opacity-70">Strict controls to protect account access and privacy.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiZap className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="font-semibold">Fast Execution</div>
                  <div className="text-sm opacity-70">Responsive team with clear delivery targets.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiUsers className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="font-semibold">Experienced Boosters</div>
                  <div className="text-sm opacity-70">Certified and proven across multiple game genres.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiTrendingUp className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="font-semibold">Consistent Results</div>
                  <div className="text-sm opacity-70">Quality-first, with customer satisfaction in mind.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiMail className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold">Contact Us</h2>
            </div>
            <p className="text-sm opacity-80">
              Need help or want to talk? Our team is ready to assist. Reach out via the contact page or join us as a booster.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/contact" className="btn btn-gaming btn-sm">Contact</Link>
              <Link href="/work-with-us" className="btn btn-gaming btn-sm">Work With Us</Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiZap className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold">Why choose {siteName}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-light rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FiEye className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-semibold">Transparent</div>
                  <div className="text-sm opacity-70">Clear services and progress updates.</div>
                </div>
              </div>
            </div>
            <div className="glass-light rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FiHeadphones className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="font-semibold">Active Support</div>
                  <div className="text-sm opacity-70">Support team ready to answer your questions.</div>
                </div>
              </div>
            </div>
            <div className="glass-light rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FiSliders className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="font-semibold">Flexible</div>
                  <div className="text-sm opacity-70">Services tailored to your needs.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
