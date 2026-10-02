"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, ShoppingCart } from "lucide-react";
import { ArtImage } from "@/components/art/ArtImage";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/providers";
import type { HomeOffer } from "@/lib/homeData";

// Best offers with a tab per game.
export function HotOffers({ tabs, offersByGame }: { tabs: { slug: string; name: string }[]; offersByGame: Record<string, HomeOffer[]> }) {
  const [active, setActive] = useState(tabs[0]?.slug ?? "");
  const { symbol: currency, convert } = useCurrency();
  if (tabs.length === 0) return null;
  const offers = offersByGame[active] ?? [];

  return (
    <section aria-labelledby="hot-offers-title">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Hot offers</p>
        <h2 id="hot-offers-title" className="text-2xl font-extrabold text-white md:text-3xl">Pick your boost</h2>
      </div>

      <div role="tablist" aria-label="Games" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 md:justify-center">
        {tabs.map((t) => (
          <button
            key={t.slug}
            role="tab"
            type="button"
            aria-selected={active === t.slug}
            onClick={() => setActive(t.slug)}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              active === t.slug ? "border-brand-500/60 bg-brand-500/20 text-white" : "border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <ul role="tabpanel" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((o) => {
          const href = `/${o.gameSlug}/${o.slug}`;
          const { whole, decimal, showDecimal } = formatPrice(convert(o.price));
          return (
            <li key={o.id} className="game-tile flex flex-col bg-ink-800">
              <Link href={href} className="relative block h-40 overflow-hidden" tabIndex={-1} aria-hidden="true">
                <ArtImage src={o.imageUrl} alt="" seed={o.slug} className="game-tile-art" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
                {o.isHot && (
                  <span className="chip absolute right-3 top-3 border-accent-400/40 bg-accent-500/85 text-[10px] text-white">
                    <Flame className="h-3 w-3" /> HOT
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-4 pt-2">
                <h3 className="line-clamp-2 min-h-[2.75rem] font-bold leading-snug text-white">
                  <Link href={href} className="hover:text-brand-200">{o.name}</Link>
                </h3>
                {o.features.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    {o.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-400" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-4">
                  <div className="mb-3 font-display text-2xl font-extrabold text-white">
                    <span className="mr-1 align-middle text-xs font-semibold uppercase tracking-wider text-gray-400">From</span>
                    {currency}
                    {whole}
                    {showDecimal && <span className="text-sm text-gray-300">.{decimal}</span>}
                  </div>
                  <Link href={href} className="btn btn-gaming h-11 w-full rounded-xl">
                    <ShoppingCart className="h-4 w-4" /> Buy now
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
