import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getWebsiteSettingCore } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site";
import { getEmbeds } from "@/lib/embeds";
import { headers } from "next/headers";
import { EmbedInjector } from "@/components/EmbedInjector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0E17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebsiteSettingCore();
  const baseUrl = getBaseUrl();
  const siteName = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Professional Game Boosting Services";
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  const ogImage = s?.logoUrl ?? faviconUrl;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteName} - ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description: tagline,
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    authors: [{ name: siteName, url: baseUrl }],
    creator: siteName,
    publisher: siteName,
    formatDetection: { email: false, address: false, telephone: false },
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName,
      title: `${siteName} - ${tagline}`,
      description: tagline,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${tagline}`,
      description: tagline,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: faviconUrl },
      ],
      shortcut: ["/favicon.ico"],
      apple: [faviconUrl],
    },
    manifest: "/manifest.webmanifest",
    category: "gaming",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, s, embeds, hdrs] = await Promise.all([
    getServerSession(authOptions).catch(() => null),
    getWebsiteSettingCore(),
    getEmbeds(),
    headers(),
  ]);
  const nonce = hdrs.get("x-nonce") || "";
  const baseUrl = getBaseUrl();

  const siteName = s?.siteName ?? "Gamingqu";
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  const logoUrl = s?.logoUrl ?? null;

  const websiteLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: siteName,
    url: baseUrl,
    inLanguage: "en",
  };

  const orgLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: siteName,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl ?? faviconUrl,
    },
  };

  const contactPoints: Record<string, unknown>[] = [];
  if (s?.contactEmail || s?.contactPhone) {
    contactPoints.push({
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(s?.contactEmail ? { email: s.contactEmail } : {}),
      ...(s?.contactPhone ? { telephone: s.contactPhone } : {}),
      availableLanguage: ["English"],
    });
  }
  if (contactPoints.length > 0) {
    orgLd.contactPoint = contactPoints;
  }

  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href={faviconUrl} />
        <link rel="canonical" href={baseUrl} />
        <meta name="theme-color" content="#0A0E17" />
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EmbedInjector embeds={embeds} nonce={nonce} />
        <Providers
          eurPerUsd={
            typeof s?.eurPerUsd === "number"
              ? s.eurPerUsd
              : s?.eurPerUsd
                ? Number(s.eurPerUsd as unknown as number)
                : 1
          }
        >
          <Navbar siteName={siteName} logoUrl={logoUrl} user={session?.user ?? null} />
          <main className="pt-16">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
