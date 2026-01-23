import { db } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

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

export async function getFooterSettings() {
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
}

export async function getWebsiteSettingCore() {
  try {
    return await db.websiteSetting.findUnique({
      where: { id: "singleton" },
      select: {
        siteName: true,
        tagline: true,
        logoUrl: true,
        faviconUrl: true,
        contactEmail: true,
        contactPhone: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getBanners(limit = 10) {
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
}
