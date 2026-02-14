import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/site";
import React from "react";
import { headers } from "next/headers";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const base = getBaseUrl();
  try {
    const game = await db.game.findFirst({
      where: { slug, isActive: true },
      select: { name: true, description: true, imageUrl: true, updatedAt: true },
    });
    if (!game) return {};
    const title = game.name;
    const desc = (game.description ?? "").trim() || game.name;
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
      robots: { index: true, follow: true },
    };
  } catch {
    return {};
  }
}

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { slug } = await params;
  const base = getBaseUrl();
  const nonce = (await headers()).get("x-nonce") || "";
  let game: { name: string; description?: string | null; imageUrl?: string | null } | null = null;
  try {
    game = await db.game.findFirst({
      where: { slug, isActive: true },
      select: { name: true, description: true, imageUrl: true },
    });
  } catch {
    game = null;
  }
  const title = game?.name ?? slug;
  const desc = (game?.description ?? "").trim() || title;
  const image = game?.imageUrl ?? undefined;
  const videoGameLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: title,
    url: `${base}/${slug}`,
    description: desc,
  };
  if (image) {
    (videoGameLd as { image?: string | string[] }).image = image;
  }
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
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameLd) }}
      />
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
