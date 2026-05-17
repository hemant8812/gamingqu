import { getBaseUrl } from "./site";
import { getWebsiteSettingCore } from "./settings";
import { SITE_DEFAULTS } from "./constants";

export { SITE_DEFAULTS };

/** Slugs reserved by static routes — must NOT be matched by `/[slug]`. */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
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
  "search",
  "_not-found",
]);

/**
 * Resolve site-level metadata once. Use this in page-level `generateMetadata`
 * and JSON-LD builders so fallbacks are consistent everywhere.
 *
 * - `logo`: always a usable URL (with fallback) — for OG / manifest / JSON-LD.
 * - `logoUrl`: raw value from settings (nullable) — for UI like Navbar/Footer
 *   where "no logo" should hide the image.
 */
export async function getSiteMeta() {
  const s = await getWebsiteSettingCore();
  const base = getBaseUrl();
  const siteName = s?.siteName?.trim() || SITE_DEFAULTS.name;
  const tagline = s?.tagline?.trim() || SITE_DEFAULTS.tagline;
  const rawLogo = s?.logoUrl?.trim() || null;
  const rawFavicon = s?.faviconUrl?.trim() || null;
  const logo = rawLogo || rawFavicon || SITE_DEFAULTS.logo;
  const favicon = rawFavicon || SITE_DEFAULTS.logo;
  const eurPerUsd =
    typeof s?.eurPerUsd === "number"
      ? s.eurPerUsd
      : s?.eurPerUsd
        ? Number(s.eurPerUsd as unknown as number)
        : 1;
  return {
    base,
    siteName,
    tagline,
    logo,
    favicon,
    logoUrl: rawLogo,
    faviconUrl: rawFavicon,
    contactEmail: s?.contactEmail?.trim() || "",
    contactPhone: s?.contactPhone?.trim() || "",
    eurPerUsd,
  };
}

export type BreadcrumbItem = { name: string; url: string };

/** Build a Schema.org BreadcrumbList JSON-LD object. */
export function breadcrumbLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Build a Schema.org WebPage JSON-LD object. */
export function webPageLd(input: {
  name: string;
  url: string;
  description: string;
  base: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    url: input.url,
    description: input.description,
    isPartOf: { "@id": `${input.base}/#website` },
    inLanguage: "en",
  };
}
