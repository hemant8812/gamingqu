import type { Metadata } from "next";
import { getSiteMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const PATH = "/refund";
const PAGE_NAME = "Refund Policy";

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName } = await getSiteMeta();
  const description = `${siteName} refund policy and how to request a refund.`;
  return {
    title: PAGE_NAME,
    description,
    alternates: { canonical: PATH },
    openGraph: { title: PAGE_NAME, description, url: `${base}${PATH}`, type: "article" },
    twitter: { card: "summary_large_image", title: PAGE_NAME, description },
  };
}

export default async function RefundPage() {
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
      <h1>Refund Policy</h1>
      <p className="text-sm opacity-70">Last updated: {updated}</p>

      <p>
        We at {siteName} aim to deliver a great experience for every order. This Refund Policy explains when refunds
        are available, how to request one, and how they are processed.
      </p>

      <h2>1. Eligibility for Refund</h2>
      <ul>
        <li>The order has not been started by an assigned booster.</li>
        <li>We are unable to deliver the service due to reasons on our side.</li>
        <li>An obvious technical error caused a duplicate or incorrect charge.</li>
      </ul>

      <h2>2. Non-Refundable Cases</h2>
      <ul>
        <li>The service has been completed in full.</li>
        <li>The service is in progress and partial work has been delivered (a partial refund may apply).</li>
        <li>Delays caused by issues outside our control (game maintenance, account restrictions caused by the customer).</li>
        <li>Customer-supplied account credentials were inaccurate or revoked during fulfillment.</li>
        <li>Promotional credits, cashback, or referral rewards.</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <ol>
        <li>Contact our support team within 7 days of the order date.</li>
        <li>Include your order number and a clear description of the issue.</li>
        <li>Our team will review the request and respond within 3 business days.</li>
      </ol>

      <h2>4. Processing Time</h2>
      <p>
        Approved refunds are processed back to the original payment method within 5 to 14 business days, depending on
        your bank or payment provider.
      </p>

      <h2>5. Partial Refunds</h2>
      <p>
        If a service is partially delivered, the refund is calculated based on the unfulfilled portion. Booster effort
        and platform fees are deducted as applicable.
      </p>

      <h2>6. Chargebacks</h2>
      <p>
        We encourage you to contact us first to resolve any issue. Chargebacks initiated without prior contact may
        result in account suspension and a permanent ban from the platform.
      </p>

      <h2>7. Contact</h2>
      <p>
        For refund requests, reach us at{" "}
        {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : "our contact page"} or via the support
        channels listed on the website.
      </p>
    </>
  );
}
