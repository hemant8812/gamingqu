// Shared FAQ content for the homepage, /faq and search-engine data.
export type FaqGroup = { topic: string; items: { q: string; a: string }[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    topic: "Services",
    items: [
      { q: "What is ArcaneBoost?", a: "ArcaneBoost is a game boosting service. Experienced players help you level up, gear up, finish raids and dungeons, or climb in PvP, so you can skip the grind." },
      { q: "How does it work?", a: "Pick a service, choose your options and pay. A booster takes your order, usually within minutes, and you can follow progress and chat with them from your dashboard. When it's done you confirm the result." },
      { q: "What's the difference between piloted and self-play?", a: "Piloted means the booster logs into your account and plays for you. Self-play means you stay on your own account and the booster plays alongside you, so you never share login details." },
      { q: "How long does it take?", a: "It depends on the service and options. Each service page shows an estimate, and your booster will tell you their schedule in the order chat." },
      { q: "Do you offer custom services?", a: "Yes. If you don't see what you need, message support and we'll put together a custom offer." },
    ],
  },
  {
    topic: "Payment",
    items: [
      { q: "How can I pay?", a: "We accept PayPal, debit and credit cards, and cryptocurrency through secure, encrypted checkout." },
      { q: "When am I charged?", a: "You pay when you place the order. The full price is shown before checkout, with no hidden fees." },
      { q: "Can I get a refund?", a: "Yes. If we can't start or complete your order, you get your money back. See our Refund Policy for the details." },
    ],
  },
  {
    topic: "Safety",
    items: [
      { q: "Is it safe? Will I get banned?", a: "Boosters follow strict safety rules, play by hand, and connect through a VPN from your region on piloted orders. No method is risk-free, so choose self-play if you want the lowest risk." },
      { q: "Is my account data protected?", a: "Your details are only shared with your assigned booster and support, and the site uses an encrypted connection. Never share passwords in the order chat; support will tell you how to give access safely." },
      { q: "Why should I trust you?", a: "Every booster is vetted, you confirm the work before it counts as done, and support is available 24/7 if anything goes wrong." },
    ],
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
