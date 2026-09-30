import type { MetadataRoute } from "next";
import { getSiteMeta } from "@/lib/seo";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { siteName, tagline, favicon } = await getSiteMeta();
  return {
    name: `${siteName} - ${tagline}`,
    short_name: siteName,
    description: tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a13",
    theme_color: "#0b0a13",
    orientation: "portrait-primary",
    icons: [
      { src: favicon, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: favicon, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: favicon, sizes: "any", type: "image/png", purpose: "maskable" },
    ],
  };
}
