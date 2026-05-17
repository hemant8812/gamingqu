import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site";
import { getWebsiteSettingCore } from "@/lib/settings";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebsiteSettingCore();
  const siteName = s?.siteName ?? "Gamingqu";
  const title = "Cookie Policy";
  const description = `How ${siteName} uses cookies and similar technologies.`;
  return {
    title,
    description,
    alternates: { canonical: "/cookies" },
    openGraph: { title, description, url: `${getBaseUrl()}/cookies`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CookiePolicyPage() {
  const s = await getWebsiteSettingCore();
  const base = getBaseUrl();
  const siteName = s?.siteName ?? "Gamingqu";
  const nonce = (await headers()).get("x-nonce") || "";
  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Cookie Policy", item: `${base}/cookies` },
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
      <h1>Cookie Policy</h1>
      <p className="text-sm opacity-70">Last updated: {updated}</p>

      <p>
        This Cookie Policy explains what cookies are, how {siteName} uses them, and how you can control them. By
        continuing to use our website, you consent to the use of cookies as described below.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They are widely used to make
        websites work efficiently and to provide reporting information.
      </p>

      <h2>2. Types of Cookies We Use</h2>
      <ul>
        <li>
          <strong>Strictly necessary cookies:</strong> required for the website to function (authentication, security,
          load balancing).
        </li>
        <li>
          <strong>Functional cookies:</strong> remember preferences such as currency, language, and remembered email.
        </li>
        <li>
          <strong>Analytics cookies:</strong> help us understand how visitors use the site so we can improve it.
        </li>
        <li>
          <strong>Marketing cookies:</strong> used by advertising partners to show relevant ads. Only set with your
          consent where required by law.
        </li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>
        Some cookies are set by third-party services we use, including payment processors, analytics providers, and
        embedded content. These third parties have their own privacy and cookie policies.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        You can accept or refuse cookies through your browser settings. Disabling cookies may impact the functionality
        of the website, including the ability to sign in or place an order.
      </p>

      <h2>5. Changes</h2>
      <p>
        We may update this Cookie Policy from time to time. The updated date at the top of this page reflects the most
        recent changes.
      </p>

      <h2>6. More Information</h2>
      <p>
        For more about how we handle personal data, see our <a href="/privacy">Privacy Policy</a>.
      </p>
    </>
  );
}
