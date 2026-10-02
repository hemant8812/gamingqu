import { HomeHero } from "@/components/home/HomeHero";
import { GameGrid } from "@/components/home/GameGrid";
import { HotOffers } from "@/components/home/HotOffers";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Benefits } from "@/components/home/Benefits";
import { LatestGuides } from "@/components/home/LatestGuides";
import { BoosterCta } from "@/components/home/BoosterCta";
import { PlayerReviews } from "@/components/home/PlayerReviews";
import { Faq } from "@/components/home/Faq";
import { faqJsonLd } from "@/lib/faq";
import { getHomeData } from "@/lib/homeData";
import type { Metadata } from "next";
import { getFooterSettings } from "@/lib/settings";
import { getSiteMeta } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName, tagline, logo } = await getSiteMeta();
  const title = `${siteName} - ${tagline}`;
  const description = `${tagline}. Safe, fast, and professional game boosting for top games — leveling, raids, dungeons, ranked, gold farming, and more.`;

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
      images: [{ url: logo, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logo],
    },
  };
}

export default async function Home() {
  const [meta, f, home] = await Promise.all([
    getSiteMeta(),
    getFooterSettings(),
    getHomeData().catch(() => ({ games: [], gameCount: 0, offersByGame: {}, offerTabs: [] })),
  ]);
  const { base, siteName, tagline, logo, contactEmail, contactPhone } = meta;

  const sameAs = [f?.smTelegramUrl, f?.smYoutubeUrl, f?.smDiscordUrl, f?.smFacebookUrl]
    .map((x) => (x ?? "").trim())
    .filter((x) => x.length > 0);

  const webPageLd = {
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
  if (contactEmail || contactPhone) {
    profServiceLd.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(contactEmail ? { email: contactEmail } : {}),
      ...(contactPhone ? { telephone: contactPhone } : {}),
    };
  }

  return (
    <>
      <JsonLd data={[webPageLd, profServiceLd, faqJsonLd()]} />
      <div className="min-h-screen bg-ink-900 text-base-content">
        <HomeHero gameCount={home.gameCount} />
        <main className="mx-auto max-w-7xl space-y-20 px-4 py-14 sm:px-6 md:py-20">
          <GameGrid games={home.games} total={home.gameCount} />
          <HotOffers tabs={home.offerTabs} offersByGame={home.offersByGame} />
          <Benefits />
          <HowItWorks />
          <PlayerReviews />
          <Faq />
          <LatestGuides />
          <BoosterCta />
        </main>
      </div>
    </>
  );
}
