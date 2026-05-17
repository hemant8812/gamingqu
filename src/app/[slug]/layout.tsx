import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import { sanitizePlain } from "@/lib/sanitize";
import { headers } from "next/headers";
import React from "react";

type Params = Promise<{ slug: string }>;

const RESERVED_SLUGS = new Set([
  "blog",
  "about",
  "contact",
  "cashback",
  "work-with-us",
  "trust-safety",
  "terms",
  "privacy",
  "refund",
  "cookies",
  "admin",
  "super-admin",
  "api",
  "dashboard",
  "booster",
  "checkout",
  "login",
  "register",
  "forgot",
  "post-login",
  "auth",
]);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || RESERVED_SLUGS.has(slug)) return {};
  const base = getBaseUrl();

  // Try Game first
  try {
    const game = await db.game.findFirst({
      where: { slug, isActive: true },
      select: { name: true, description: true, imageUrl: true },
    });
    if (game) {
      const title = game.name;
      const desc = sanitizePlain((game.description ?? "").trim()) || `${game.name} boosting services`;
      return {
        title,
        description: desc,
        alternates: { canonical: `${base}/${slug}` },
        openGraph: {
          title,
          description: desc,
          url: `${base}/${slug}`,
          type: "website",
          images: game.imageUrl ? [{ url: game.imageUrl }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description: desc,
          images: game.imageUrl ? [game.imageUrl] : undefined,
        },
      };
    }
  } catch {}

  // Fallback to CMS Page
  try {
    const page = await db.page.findFirst({
      where: { slug, isActive: true },
      select: { title: true, content: true },
    });
    if (page) {
      const title = page.title;
      const desc = sanitizePlain((page.content ?? "").trim()).slice(0, 160) || page.title;
      return {
        title,
        description: desc,
        alternates: { canonical: `${base}/${slug}` },
        openGraph: { title, description: desc, url: `${base}/${slug}`, type: "article" },
        twitter: { card: "summary_large_image", title, description: desc },
      };
    }
  } catch {}

  return {};
}

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { slug } = await params;
  if (!slug || RESERVED_SLUGS.has(slug)) {
    return <>{children}</>;
  }
  const base = getBaseUrl();
  const nonce = (await headers()).get("x-nonce") || "";

  let game: { name: string; description?: string | null; imageUrl?: string | null } | null = null;
  try {
    game = await db.game.findFirst({
      where: { slug, isActive: true },
      select: { name: true, description: true, imageUrl: true },
    });
  } catch {}

  if (game) {
    const title = game.name;
    const desc = sanitizePlain((game.description ?? "").trim()) || title;
    const videoGameLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: title,
      url: `${base}/${slug}`,
      description: desc,
    };
    if (game.imageUrl) videoGameLd.image = game.imageUrl;
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: title, item: `${base}/${slug}` },
      ],
    };
    return (
      <>
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameLd) }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {children}
      </>
    );
  }

  // Fallback breadcrumb for CMS pages
  let pageTitle: string | null = null;
  try {
    const page = await db.page.findFirst({
      where: { slug, isActive: true },
      select: { title: true },
    });
    pageTitle = page?.title ?? null;
  } catch {}

  if (pageTitle) {
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: pageTitle, item: `${base}/${slug}` },
      ],
    };
    return (
      <>
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {children}
      </>
    );
  }

  return <>{children}</>;
}
