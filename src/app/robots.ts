import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/super-admin",
          "/super-admin/*",
          "/api",
          "/api/*",
          "/dashboard",
          "/dashboard/*",
          "/booster",
          "/booster/*",
          "/checkout",
          "/checkout/*",
          "/login",
          "/register",
          "/forgot",
          "/post-login",
          "/auth",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
