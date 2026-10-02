import type { Metadata } from "next";
import { Faq } from "@/components/home/Faq";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqJsonLd } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about our boosting services, payment and account safety.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <JsonLd data={faqJsonLd()} />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Faq />
      </div>
    </div>
  );
}
