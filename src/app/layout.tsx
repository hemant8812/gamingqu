import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await db.websiteSetting.findUnique({ where: { id: "singleton" } }).catch(() => null);
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  return {
    title: s?.siteName ?? "Gamingqu",
    description: s?.tagline ?? "Layanan Boosting Game Profesional",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions).catch(() => null);
  const s = await db.websiteSetting.findUnique({ where: { id: "singleton" } }).catch(() => null);
  let embeds: { id: string; code: string; placement: "HEAD" | "BODY" | "FOOTER" }[] = [];
  try {
    embeds = await db.embedCode.findMany({
      where: { isActive: true },
      select: { id: true, code: true, placement: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {}
  const headEmbeds = embeds.filter((e) => e.placement === "HEAD");
  const bodyEmbeds = embeds.filter((e) => e.placement === "BODY");
  const footerEmbeds = embeds.filter((e) => e.placement === "FOOTER");
  const siteName = s?.siteName ?? "Gamingqu";
  const faviconUrl = s?.faviconUrl ?? "/icons/logo.png";
  const logoUrl = s?.logoUrl ?? null;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} />
        {headEmbeds.map((e) => (
          <script key={e.id} dangerouslySetInnerHTML={{ __html: e.code }} />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {bodyEmbeds.map((e) => (
          <script key={e.id} dangerouslySetInnerHTML={{ __html: e.code }} />
        ))}
        <Providers>
          <Navbar siteName={siteName} logoUrl={logoUrl} user={session?.user ?? null} />
          <main className="pt-16">{children}</main>
        </Providers>
        {footerEmbeds.map((e) => (
          <script key={e.id} dangerouslySetInnerHTML={{ __html: e.code }} />
        ))}
      </body>
    </html>
  );
}
