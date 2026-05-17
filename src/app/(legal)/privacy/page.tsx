import type { Metadata } from "next";
import { getSiteMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const PATH = "/privacy";
const PAGE_NAME = "Privacy Policy";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `How ${siteName} collects, uses, and protects your personal information.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, type: "article" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

export default async function PrivacyPage() {
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
      <h1>Privacy Policy</h1>
      <p className="text-sm opacity-70">Last updated: {updated}</p>

      <p>
        This Privacy Policy describes how {siteName} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects
        information when you use our website and services. By using our services, you agree to the collection and use of
        information in accordance with this policy.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account information:</strong> name, username, email address, and password.</li>
        <li><strong>Order information:</strong> contact details, game character names, and service preferences you provide at checkout.</li>
        <li><strong>Payment information:</strong> processed by trusted third-party processors (PayPal, Stripe, Cryptomus). We do not store full card numbers.</li>
        <li><strong>Technical data:</strong> IP address, browser, device information, and usage analytics collected via cookies and similar technologies.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide, operate, and improve our services.</li>
        <li>To process orders, payments, and deliver the services you purchase.</li>
        <li>To communicate with you about orders, updates, and support requests.</li>
        <li>To prevent fraud, abuse, and ensure platform security.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We do not sell your personal information. We may share data with payment processors, hosting providers,
        analytics services, and law enforcement when required by law. All third parties are bound by confidentiality
        obligations.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use cookies and similar technologies to maintain your session, remember preferences, and analyze traffic.
        See our <a href="/cookies">Cookie Policy</a> for details. You can disable cookies in your browser settings,
        but some features may not work correctly.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain personal data only as long as necessary for the purposes described in this policy or as required by
        law. Order and transaction records may be retained for accounting and legal compliance.
      </p>

      <h2>6. Your Rights</h2>
      <ul>
        <li>Access, correct, or delete your personal information.</li>
        <li>Withdraw consent or object to certain processing.</li>
        <li>Request a copy of the data we hold about you.</li>
        <li>Lodge a complaint with your local data protection authority.</li>
      </ul>

      <h2>7. Security</h2>
      <p>
        We implement industry-standard technical and organizational measures to protect your information against
        unauthorized access, alteration, disclosure, or destruction. No method of transmission over the Internet is
        100% secure.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        Our services are not directed to children under 13 (or the equivalent minimum age in your jurisdiction). We do
        not knowingly collect personal data from children.
      </p>

      <h2>9. International Transfers</h2>
      <p>
        Your information may be processed in countries other than your own. We take appropriate safeguards to ensure
        your data is protected wherever it is processed.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of material changes by posting the
        updated policy on this page with a new &quot;Last updated&quot; date.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, contact us at{" "}
        {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : "our contact page"}.
      </p>
    </>
  );
}
