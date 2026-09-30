import type { Metadata } from "next";
import Link from "next/link";
import { getFooterSettings } from "@/lib/settings";
import { getSiteMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { FiMail, FiPhone, FiLink } from "react-icons/fi";
import { FaTelegramPlane, FaYoutube, FaDiscord, FaFacebookF } from "react-icons/fa";

const PATH = "/contact";
const PAGE_NAME = "Contact Us";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `Reach out to the ${siteName} team for questions and support.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, siteName, type: "website" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

type SocialLink = { title: string; url: string };

const socialIcon = (s: SocialLink): { icon: React.ReactNode; color: string } => {
  const key = `${s.title} ${s.url}`.toLowerCase();
  if (key.includes("telegram") || key.includes("t.me")) return { icon: <FaTelegramPlane size={18} />, color: "#2CA5E0" };
  if (key.includes("youtube") || key.includes("youtu")) return { icon: <FaYoutube size={18} />, color: "#FF0000" };
  if (key.includes("discord")) return { icon: <FaDiscord size={18} />, color: "#5865F2" };
  if (key.includes("facebook")) return { icon: <FaFacebookF size={16} />, color: "#1877F2" };
  return { icon: <FiLink className="h-4 w-4" />, color: "#3B82F6" };
};

export default async function ContactPage() {
  const [meta, f] = await Promise.all([getSiteMeta(), getFooterSettings()]);
  const { base, siteName, contactEmail, contactPhone } = meta;
  const url = `${base}${PATH}`;
  const description = `Reach out to the ${siteName} team for questions and support.`;

  const socials: SocialLink[] = [
    { title: "Telegram", url: (f?.smTelegramUrl ?? "").trim() },
    { title: "YouTube", url: (f?.smYoutubeUrl ?? "").trim() },
    { title: "Discord", url: (f?.smDiscordUrl ?? "").trim() },
    { title: "Facebook", url: (f?.smFacebookUrl ?? "").trim() },
  ].filter((x) => x.url.length > 0);

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
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
            <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
            <div className="hidden sm:flex items-center gap-2">
              {contactEmail && <a href={`mailto:${contactEmail}`} className="btn btn-gaming btn-sm">Send Email</a>}
              {contactPhone && <a href={`tel:${contactPhone}`} className="btn btn-gaming btn-sm">Call Us</a>}
            </div>
          </div>
          <p className="text-base opacity-70 mt-2">We&rsquo;re here to help answer questions and provide the best solutions.</p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiMail className="h-5 w-5 text-brand-400" />
                <h2 className="text-xl font-bold">Email</h2>
              </div>
              <div className="text-sm opacity-80">
                {contactEmail ? (
                  <a href={`mailto:${contactEmail}`} className="text-brand-400 hover:text-brand-300 hover:underline">{contactEmail}</a>
                ) : (
                  <span className="opacity-60">Email not available</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiPhone className="h-5 w-5 text-accent-400" />
                <h2 className="text-xl font-bold">Phone</h2>
              </div>
              <div className="text-sm opacity-80">
                {contactPhone ? (
                  <a href={`tel:${contactPhone}`} className="text-brand-400 hover:text-brand-300 hover:underline">{contactPhone}</a>
                ) : (
                  <span className="opacity-60">Phone number not available</span>
                )}
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiLink className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold">Social Media</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {socials.length === 0 ? (
                  <span className="text-sm opacity-60">Social links not available</span>
                ) : (
                  socials.map((s, i) => {
                    const info = socialIcon(s);
                    return (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.title}
                        title={s.title}
                        style={{ borderColor: info.color }}
                        className="group inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-all hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                      >
                        <span className="transition-transform group-hover:scale-110" style={{ color: info.color }}>
                          {info.icon}
                        </span>
                      </a>
                    );
                  })
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
              <h3 className="text-lg font-semibold mb-2">Need quick help?</h3>
              <p className="text-sm opacity-80">Our support team can explain the services and usage policies.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/trust-safety" className="btn btn-gaming btn-sm">Service Safety</Link>
                <Link href="/work-with-us" className="btn btn-gaming btn-sm">Become a Booster</Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
