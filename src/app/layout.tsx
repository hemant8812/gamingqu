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
  
  const headEmbeds = embeds.filter((e) => e.placement === "HEAD");
  const bodyEmbeds = embeds.filter((e) => e.placement === "BODY");
  const footerEmbeds = embeds.filter((e) => e.placement === "FOOTER");
  const siteName = s?.siteName ?? "Gamingqu";
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  const logoUrl = s?.logoUrl ?? null;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href={faviconUrl} />
        {headEmbeds.map((e) => (
          <script key={e.id} dangerouslySetInnerHTML={{ __html: `try{document.head.insertAdjacentHTML("beforeend", ${JSON.stringify(e.code)})}catch{}` }} />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {bodyEmbeds.map((e) => (
          <script key={e.id} dangerouslySetInnerHTML={{ __html: `try{document.body.insertAdjacentHTML("afterbegin", ${JSON.stringify(e.code)})}catch{}` }} />
        ))}
        <Providers eurPerUsd={typeof s?.eurPerUsd === "number" ? (s?.eurPerUsd as number) :  (s?.eurPerUsd ? Number(s?.eurPerUsd as unknown as number) : 1)}>
          <Navbar siteName={siteName} logoUrl={logoUrl} user={session?.user ?? null} />
          <main className="pt-16">{children}</main>
        </Providers>
        <Footer />
        {footerEmbeds.map((e) => (
          <script key={e.id} dangerouslySetInnerHTML={{ __html: `try{document.body.insertAdjacentHTML("beforeend", ${JSON.stringify(e.code)})}catch{}` }} />
        ))}
      </body>
    </html>
  );
}
