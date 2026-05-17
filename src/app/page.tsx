import { HomeContent } from "@/components/home/HomeContent";
import type { Metadata } from "next";
import { getWebsiteSettingCore, getFooterSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebsiteSettingCore();
  const base = getBaseUrl();
  const siteName = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Professional Game Boosting Services";
  const ogImage = s?.logoUrl ?? s?.faviconUrl ?? "/icons/logo.png";
  const title = `${siteName} - ${tagline}`;
  const description =
    `${tagline}. Safe, fast, and professional game boosting for top games — leveling, raids, dungeons, ranked, gold farming, and more.`;

  return {
    title,
    description,
    keywords: [
      "game boosting",
      "professional boosting service",
      "wow boost",
      "leveling boost",
      "ranked boost",
      "gold farming service",
      "dungeon boost",
      "raid carry",
      "arena boost",
      siteName.toLowerCase(),
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: base,
      siteName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  const [s, f, hdrs] = await Promise.all([
    getWebsiteSettingCore(),
    getFooterSettings(),
    headers(),
  ]);
  const base = getBaseUrl();
  const nonce = hdrs.get("x-nonce") || "";
  const siteName = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Professional Game Boosting Services";
  const logo = s?.logoUrl ?? s?.faviconUrl ?? "/icons/logo.png";

  const sameAs = [f?.smTelegramUrl, f?.smYoutubeUrl, f?.smDiscordUrl, f?.smFacebookUrl]
    .map((x) => (x ?? "").trim())
    .filter((x) => x.length > 0);

  const webPageLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${base}/#webpage`,
    url: `${base}/`,
    name: `${siteName} - ${tagline}`,
    description: tagline,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    inLanguage: "en",
  };

  const profServiceLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${base}/#service`,
    name: siteName,
    url: `${base}/`,
    image: logo,
    description: tagline,
    priceRange: "$$",
  };
  if (sameAs.length > 0) profServiceLd.sameAs = sameAs;
  if (s?.contactEmail || s?.contactPhone) {
    profServiceLd.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(s?.contactEmail ? { email: s.contactEmail } : {}),
      ...(s?.contactPhone ? { telephone: s.contactPhone } : {}),
    };
  }

  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profServiceLd) }}
      />
      <HomeContent />
    </>
  );
}
