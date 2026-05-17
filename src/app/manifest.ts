import type { MetadataRoute } from "next";
import { getWebsiteSettingCore } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getWebsiteSettingCore();
  const name = s?.siteName ?? "Gamingqu";
  const tagline = s?.tagline ?? "Professional Game Boosting Services";
  const icon = s?.faviconUrl ?? s?.logoUrl ?? "/icons/logo.png";

  return {
    name: `${name} - ${tagline}`,
    short_name: name,
    description: tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E17",
    theme_color: "#0A0E17",
    orientation: "portrait-primary",
    icons: [
      { src: icon, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: icon, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: icon, sizes: "any", type: "image/png", purpose: "maskable" },
    ],
  };
}
