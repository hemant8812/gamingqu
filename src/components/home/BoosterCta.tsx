import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { BoosterArt } from "@/components/art/CategoryArt";

// Recruiting section for pro players.
export function BoosterCta() {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-brand-500/25 bg-gradient-to-br from-brand-900/60 via-ink-800 to-ink-900">
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="relative grid items-center gap-6 p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="eyebrow mb-3">For pro players</p>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Turn your skill into <span className="gradient-text">income</span>
          </h2>
          <p className="mt-4 max-w-md text-gray-300">
            Pick the orders you want, play on your own schedule and get paid when customers confirm. We handle payments and support.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-gray-200 sm:grid-cols-2">
            {["Flexible hours", "Paid per completed order", "Choose your games", "Your own booster panel"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-lime-glow" /> {t}
              </li>
            ))}
          </ul>
          <Link href="/work-with-us" className="btn btn-gaming mt-8 h-12 rounded-2xl px-7">
            Apply as booster <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <BoosterArt className="mx-auto h-56 w-full max-w-sm md:h-72" />
      </div>
    </section>
  );
}
