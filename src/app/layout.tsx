import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getEmbeds } from "@/lib/embeds";
import { headers } from "next/headers";
import { EmbedInjector } from "@/components/EmbedInjector";
import { getSiteMeta } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

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
  const { base, siteName, tagline, logo, favicon } = await getSiteMeta();

  return {
    metadataBase: new URL(base),
    title: {
      default: `${siteName} - ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description: tagline,
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    authors: [{ name: siteName, url: base }],
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
      url: base,
      siteName,
      title: `${siteName} - ${tagline}`,
      description: tagline,
      images: [{ url: logo, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${tagline}`,
      description: tagline,
      images: [logo],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: favicon },
      ],
      shortcut: ["/favicon.ico"],
      apple: [favicon],
    },
    manifest: "/manifest.webmanifest",
    category: "gaming",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, meta, embeds, hdrs] = await Promise.all([
    getServerSession(authOptions).catch(() => null),
    getSiteMeta(),
    getEmbeds(),
    headers(),
  ]);
  const nonce = hdrs.get("x-nonce") || "";
  const { base, siteName, logo, favicon, logoUrl, contactEmail, contactPhone, eurPerUsd } = meta;

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: siteName,
    url: base,
    inLanguage: "en",
  };

  const orgLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: siteName,
    url: base,
    logo: { "@type": "ImageObject", url: logo },
  };
  if (contactEmail || contactPhone) {
    orgLd.contactPoint = [{
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(contactEmail ? { email: contactEmail } : {}),
      ...(contactPhone ? { telephone: contactPhone } : {}),
      availableLanguage: ["English"],
    }];
  }

  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href={favicon} />
        <meta name="theme-color" content="#0A0E17" />
        <JsonLd data={[websiteLd, orgLd]} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EmbedInjector embeds={embeds} nonce={nonce} />
        <Providers eurPerUsd={eurPerUsd}>
          <Navbar siteName={siteName} logoUrl={logoUrl} user={session?.user ?? null} />
          <main className="pt-16">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
