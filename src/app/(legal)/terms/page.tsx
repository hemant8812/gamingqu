import type { Metadata } from "next";
import { getSiteMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const PATH = "/terms";
const PAGE_NAME = "Terms of Service";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `Terms and conditions for using ${siteName} services.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, type: "article" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

export default async function TermsPage() {
  const { base, siteName, contactEmail } = await getSiteMeta();
  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: `${base}/` },
          { name: PAGE_NAME, url: `${base}${PATH}` },
        ])}
      />
      <h1>Terms of Service</h1>
      <p className="text-sm opacity-70">Last updated: {updated}</p>

      <p>
        Welcome to {siteName}. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website and
        services. By using our services, you agree to be bound by these Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old, or the age of majority in your jurisdiction, to use our services. By using
        the platform, you confirm that you meet this requirement.
      </p>

      <h2>2. Account</h2>
      <ul>
        <li>You are responsible for maintaining the confidentiality of your credentials.</li>
        <li>You are responsible for all activity that occurs under your account.</li>
        <li>Notify us immediately of any unauthorized access or security incident.</li>
      </ul>

      <h2>3. Services</h2>
      <p>
        {siteName} provides professional game-related services including, but not limited to, leveling, gold farming,
        ranked play, dungeon and raid completions, and account coaching. Specific deliverables, timelines, and prices
        are listed on each service page.
      </p>

      <h2>4. Orders &amp; Payment</h2>
      <ul>
        <li>Orders are confirmed once payment is received.</li>
        <li>Prices are listed in USD unless otherwise specified.</li>
        <li>You authorize us to charge the chosen payment method for the order amount and any applicable fees.</li>
        <li>We reserve the right to refuse or cancel any order at our discretion.</li>
      </ul>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the services for any unlawful or fraudulent purpose.</li>
        <li>Attempt to interfere with the security or integrity of the platform.</li>
        <li>Resell, sublicense, or redistribute services without written permission.</li>
        <li>Provide false, misleading, or stolen account information.</li>
      </ul>

      <h2>6. Refunds</h2>
      <p>
        Refund eligibility is described in our <a href="/refund">Refund Policy</a>. Cashback rules are explained on
        our <a href="/cashback">Cashback page</a>.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All content on this website, including logos, text, images, and software, is owned by {siteName} or its
        licensors and is protected by intellectual-property laws. Game names, trademarks, and assets remain the
        property of their respective owners. {siteName} is not affiliated with or endorsed by any game publisher.
      </p>

      <h2>8. Disclaimer</h2>
      <p>
        Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied,
        regarding uninterrupted availability, error-free performance, or specific outcomes beyond what is expressly
        described in each service.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {siteName} shall not be liable for any indirect, incidental, special,
        or consequential damages arising from your use of the services.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate your access to the services at any time for violation of these Terms, suspected
        fraud, abuse, or as otherwise required by law.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which {siteName} operates, without regard to
        conflict-of-law principles.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may modify these Terms at any time. Updates take effect when posted. Continued use of the services
        constitutes acceptance of the revised Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : "our contact page"}.
      </p>
    </>
  );
}
