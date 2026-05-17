import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import { sanitizePlain } from "@/lib/sanitize";
import { RESERVED_SLUGS, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import React from "react";

type Params = Promise<{ slug: string }>;

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
      const desc = sanitizePlain((game.description ?? "").trim()) || `${game.name} boosting services`;
      return {
        title: game.name,
        description: desc,
        alternates: { canonical: `/${slug}` },
        openGraph: {
          title: game.name,
          description: desc,
          url: `${base}/${slug}`,
          type: "website",
          images: game.imageUrl ? [{ url: game.imageUrl }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: game.name,
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
      const desc = sanitizePlain((page.content ?? "").trim()).slice(0, 160) || page.title;
      return {
        title: page.title,
        description: desc,
        alternates: { canonical: `/${slug}` },
        openGraph: { title: page.title, description: desc, url: `${base}/${slug}`, type: "article" },
        twitter: { card: "summary_large_image", title: page.title, description: desc },
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

  // Game branch
  let game: { name: string; description?: string | null; imageUrl?: string | null } | null = null;
  try {
    game = await db.game.findFirst({
      where: { slug, isActive: true },
      select: { name: true, description: true, imageUrl: true },
    });
  } catch {}

  if (game) {
    const desc = sanitizePlain((game.description ?? "").trim()) || game.name;
    const videoGameLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: game.name,
      url: `${base}/${slug}`,
      description: desc,
    };
    if (game.imageUrl) videoGameLd.image = game.imageUrl;
    return (
      <>
        <JsonLd
          data={[
            videoGameLd,
            breadcrumbLd([
              { name: "Home", url: `${base}/` },
              { name: game.name, url: `${base}/${slug}` },
            ]),
          ]}
        />
        {children}
      </>
    );
  }

  // CMS Page branch
  let pageTitle: string | null = null;
  try {
    const page = await db.page.findFirst({
      where: { slug, isActive: true },
      select: { title: true },
    });
    pageTitle = page?.title ?? null;
  } catch {}

  if (pageTitle) {
    return (
      <>
        <JsonLd
          data={breadcrumbLd([
            { name: "Home", url: `${base}/` },
            { name: pageTitle, url: `${base}/${slug}` },
          ])}
        />
        {children}
      </>
    );
  }

  return <>{children}</>;
}
