import { HomeContent } from "@/components/home/HomeContent";
import type { Metadata } from "next";
import { getWebsiteSettingCore } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebsiteSettingCore();
  const base = getBaseUrl();
  const favicon = s?.faviconUrl ?? "/icons/logo.png";
  const title = s?.siteName ?? "Gamingqu";
  const description = s?.tagline ?? "Layanan Boosting Game Profesional";
  return {
    title,
    description,
    alternates: { canonical: `${base}/` },
    openGraph: {
      title,
      description,
      url: `${base}/`,
      siteName: title,
      type: "website",
      images: [{ url: s?.logoUrl ?? favicon }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [s?.logoUrl ?? favicon],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Home() {
  const s = await getWebsiteSettingCore();
  const base = getBaseUrl();
  const title = s?.siteName ?? "Gamingqu";
  const favicon = s?.faviconUrl ?? "/icons/logo.png";
  const logo = s?.logoUrl ?? favicon;
  const contactEmail = (s?.contactEmail ?? "").trim();
  const contactPhone = (s?.contactPhone ?? "").trim();
  const hasContact = !!contactEmail || !!contactPhone;
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    url: `${base}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const orgLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: title,
    url: `${base}/`,
    logo,
  };
  if (hasContact) {
    orgLd.contactPoint = [
      {
        "@type": "ContactPoint",
        email: contactEmail || undefined,
        telephone: contactPhone || undefined,
        contactType: "customer support",
      },
    ];
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <HomeContent />
    </>
  );
}
