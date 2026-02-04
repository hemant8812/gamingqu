import { db } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";
import { unstable_cache } from "next/cache";

export const FOOTER_SELECT: Prisma.FooterSettingSelect = {
  disclaimer: true,
  shortDescription: true,
  copyright: true,
  legalAddress: true,
  regNumber: true,
  smTelegramUrl: true,
  smYoutubeUrl: true,
  smDiscordUrl: true,
  smFacebookUrl: true,
  badgeMastercardUrl: true,
  badgeVisaUrl: true,
  badgePciUrl: true,
  navHomeTitle: true,
  navHomeUrl: true,
  navAboutTitle: true,
  navAboutUrl: true,
  navFaqTitle: true,
  navFaqUrl: true,
  navBoosterTitle: true,
  navBoosterUrl: true,
  legal1Title: true,
  legal1Url: true,
  legal2Title: true,
  legal2Url: true,
  legal3Title: true,
  legal3Url: true,
  legal4Title: true,
  legal4Url: true,
  pmVisaUrl: true,
  pmMastercardUrl: true,
  pmGpayUrl: true,
  pmApplePayUrl: true,
  pmPaypalUrl: true,
  pmStripeUrl: true,
  isActive: true,
};

export const getFooterSettings = unstable_cache(
  async () => {
    try {
      const unique = await db.footerSetting.findUnique({
        where: { id: "singleton" },
        select: FOOTER_SELECT,
      });
      if (unique) return unique;
      const fallback = await db.footerSetting.findFirst({
        select: FOOTER_SELECT,
        orderBy: { updatedAt: "desc" },
      });
      return fallback ?? null;
    } catch {
      return null;
    }
  },
  ["footer-settings"],
  { tags: ["footer-settings"], revalidate: 3600 }
);

export const getWebsiteSettingCore = unstable_cache(
  async () => {
    try {
      const s = await db.websiteSetting.findUnique({
        where: { id: "singleton" },
        select: {
          siteName: true,
          tagline: true,
          logoUrl: true,
          faviconUrl: true,
          contactEmail: true,
          contactPhone: true,
          eurPerUsd: true,
          webSharePercent: true,
          boosterSharePercent: true,
        },
      });
      if (!s) return null;
      return {
        siteName: s.siteName,
        tagline: s.tagline,
        logoUrl: s.logoUrl,
        faviconUrl: s.faviconUrl,
        contactEmail: s.contactEmail,
        contactPhone: s.contactPhone,
        eurPerUsd:
          typeof s.eurPerUsd === "number"
            ? s.eurPerUsd
            : s.eurPerUsd
            ? Number(s.eurPerUsd)
            : undefined,
        webSharePercent:
          typeof s.webSharePercent === "number"
            ? s.webSharePercent
            : s.webSharePercent
            ? Number(s.webSharePercent)
            : undefined,
        boosterSharePercent:
          typeof s.boosterSharePercent === "number"
            ? s.boosterSharePercent
            : s.boosterSharePercent
            ? Number(s.boosterSharePercent)
            : undefined,
      };
    } catch {
      return null;
    }
  },
  ["website-settings-core"],
  { tags: ["website-settings"], revalidate: 3600 }
);

export const getBanners = unstable_cache(
  async (limit = 10) => {
    try {
      const list = await db.banner.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          subtitle: true,
          buttonLink: true,
          buttonImageUrl: true,
          order: true,
        },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        take: limit,
      });
      return list;
    } catch {
      return [];
    }
  },
  ["banners-list"],
  { tags: ["banners"], revalidate: 3600 }
);
