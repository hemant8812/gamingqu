import { BadgeCheck, Gauge, Headset, Lock, ShieldCheck, Wallet } from "lucide-react";

// "Why choose us" grid. Each tile gets a small drawn accent instead of a stock image.
const TILES = [
  { icon: BadgeCheck, title: "Thousands of orders done", text: "Real players finish real orders every day, with progress you can follow.", tone: "from-brand-600/40 to-ink-800" },
  { icon: Wallet, title: "Fair, upfront prices", text: "See the full price before you pay. No surprise fees at checkout.", tone: "from-lime-500/25 to-ink-800" },
  { icon: ShieldCheck, title: "Safe play, VPN on", text: "Boosters connect from your region with a VPN to keep your account safe.", tone: "from-sky-500/25 to-ink-800" },
  { icon: Lock, title: "Protected payments", text: "Pay with PayPal, cards or crypto through trusted, encrypted checkout.", tone: "from-accent-500/30 to-ink-800" },
  { icon: Headset, title: "Support around the clock", text: "Real people answer in live chat 24/7, before and after you order.", tone: "from-emerald-500/25 to-ink-800" },
  { icon: Gauge, title: "Fast starts", text: "Most orders get a booster within minutes of payment.", tone: "from-amber-500/25 to-ink-800" },
];

function Accent({ index }: { index: number }) {
  // Simple layered rings, rotated differently per tile.
  return (
    <svg viewBox="0 0 120 120" className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 opacity-60" aria-hidden="true" style={{ transform: `rotate(${index * 37}deg)` }}>
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="6 8" />
      <circle cx="60" cy="8" r="5" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Why ArcaneBoost</p>
        <h2 id="benefits-title" className="text-2xl font-extrabold text-white md:text-3xl">Why players choose us</h2>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
        {TILES.map((t, i) => (
          <li
            key={t.title}
            className={`relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-br ${t.tone} p-6 text-brand-200 md:col-span-2`}
          >
            <Accent index={i} />
            <t.icon className="h-8 w-8 text-white" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold text-white">{t.title}</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-300">{t.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
