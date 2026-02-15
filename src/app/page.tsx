import { HomeContent } from "@/components/home/HomeContent";
import type { Metadata } from "next";
import { getWebsiteSettingCore, getFooterSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebsiteSettingCore();
  const base = getBaseUrl();
  const favicon = s?.faviconUrl ?? "/icons/logo.png";
  const siteName = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Layanan Boosting Game Profesional";
  const fullTitle = `${siteName}${tagline ? ` - ${tagline}` : ""}`;

  return {
    title: fullTitle,
    description: tagline,
    alternates: { canonical: `${base}/` },
    openGraph: {
      title: fullTitle,
      description: tagline,
      url: `${base}/`,
      siteName: siteName,
      type: "website",
      images: [{ url: s?.logoUrl ?? favicon }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: tagline,
      images: [s?.logoUrl ?? favicon],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Home() {
  const s = await getWebsiteSettingCore();
  const f = await getFooterSettings();
  const base = getBaseUrl();
  const nonce = (await headers()).get("x-nonce") || "";
  const title = s?.siteName ?? "Gamingqu";
  const favicon = s?.faviconUrl ?? "/icons/logo.png";
  const logo = s?.logoUrl ?? favicon;
  const contactEmail = (s?.contactEmail ?? "").trim();
  const contactPhone = (s?.contactPhone ?? "").trim();
  const legalAddress = (f?.legalAddress ?? "").trim();
  const sms = [f?.smTelegramUrl, f?.smYoutubeUrl, f?.smDiscordUrl, f?.smFacebookUrl]
    .map((x) => (x ?? "").trim())
    .filter((x) => x.length > 0);
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
  if (legalAddress) {
    (orgLd as { address?: unknown }).address = {
      "@type": "PostalAddress",
      streetAddress: legalAddress,
    };
  }
  if (sms.length > 0) {
    (orgLd as { sameAs?: string[] }).sameAs = sms;
  }
  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <HomeContent />
    </>
  );
}
