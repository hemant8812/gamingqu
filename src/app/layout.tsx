import type { Metadata } from "next";
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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebsiteSettingCore();
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  const baseUrl = getBaseUrl();
  const siteName = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Layanan Boosting Game Profesional";

  return {
    title: siteName,
    description: tagline,
    metadataBase: new URL(baseUrl),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: siteName,
      description: tagline,
      url: baseUrl,
      siteName: siteName,
      type: "website",
      images: [{ url: s?.logoUrl ?? faviconUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: tagline,
      images: [s?.logoUrl ?? faviconUrl],
    },
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }, { url: faviconUrl }],
      shortcut: ["/favicon.ico"],
      apple: [faviconUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions).catch(() => null);
  const s = await getWebsiteSettingCore();
  const embeds = await getEmbeds();
  const nonce = (await headers()).get("x-nonce") || "";
  const baseUrl = getBaseUrl();
  
  const siteName = s?.siteName ?? "Gamingqu";
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  const logoUrl = s?.logoUrl ?? null;
  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href={faviconUrl} />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: baseUrl,
              name: siteName,
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: baseUrl,
              name: siteName,
              logo: logoUrl ?? faviconUrl,
              contactPoint: [
                s?.contactEmail || s?.contactPhone
                  ? {
                      "@type": "ContactPoint",
                      contactType: "customer support",
                      email: s?.contactEmail ?? undefined,
                      telephone: s?.contactPhone ?? undefined,
                    }
                  : undefined,
              ].filter(Boolean),
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EmbedInjector embeds={embeds} nonce={nonce} />
        <Providers eurPerUsd={typeof s?.eurPerUsd === "number" ? (s?.eurPerUsd as number) :  (s?.eurPerUsd ? Number(s?.eurPerUsd as unknown as number) : 1)}>
          <Navbar siteName={siteName} logoUrl={logoUrl} user={session?.user ?? null} />
          <main className="pt-16">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
