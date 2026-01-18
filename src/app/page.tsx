"use client";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const moreCount = 150;
  const heroSlides = [
    {
      subtitle: "Boost your game — and your wallet",
      title: "What boosts you, makes you",
      href: "/cashback",
      cta: "Read more",
      image: "https://picsum.photos/seed/cashback/960/540",
    },
    {
      subtitle: "Today’s best prices",
      title: "Weekly Offers",
      href: "/offers",
      cta: "Read more",
      image: "https://picsum.photos/seed/offers/960/540",
    },
    {
      subtitle: "Top picks for you",
      title: "Hot Right Now",
      href: "/hot",
      cta: "Read more",
      image: "https://picsum.photos/seed/hot/960/540",
    },
  ];
  const [heroSlide, setHeroSlide] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);
  useEffect(() => {
    const measure = () => setPageWidth(containerRef.current?.clientWidth || 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const goToSlide = (n: number) => {
    setHeroSlide(n);
    const last = heroSlides.length - 1;
    if (n === 0) setDir(1);
    else if (n === last) setDir(-1);
  };
  useEffect(() => {
    const id = setInterval(() => {
      setHeroSlide((curr) => {
        const last = heroSlides.length - 1;
        if (curr === 0) {
          setDir(1);
          return 1;
        }
        if (curr === last) {
          setDir(-1);
          return 1;
        }
        return curr + dir;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [dir, heroSlides.length]);
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-3 relative overflow-hidden rounded-[28px] border-zinc-900 p-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-transparent" />
            <div ref={containerRef} className="relative z-10 overflow-hidden p-8 md:p-10">
              <div
                className="flex flex-nowrap transition-transform duration-700 ease-in-out gap-0"
                style={{ transform: `translateX(-${heroSlide * pageWidth}px)` }}
              >
                {heroSlides.map((s, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 grid grid-cols-1 md:grid-cols-[1fr_420px] items-center gap-10"
                    style={{ minWidth: pageWidth || undefined }}
                  >
                    <div className="space-y-3 max-w-xl">
                      <div className="text-white text-sm">{s.subtitle}</div>
                      <div className="text-3xl md:text-5xl font-black text-white tracking-tight">{s.title}</div>
                      <Link href={s.href} className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500">
                        {s.cta}
                      </Link>
                    </div>
                    <div className="relative justify-self-end w-full md:w-[420px] aspect-[16/9] rounded-[24px] overflow-hidden ring-1 ring-white/10 shadow-lg mr-8 md:mr-18">
                      <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="hero-stripes" />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 hero-play">
                        <Play className="text-white/90 h-6 w-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hero-dots">
                {heroSlides.map((_, i) => (
                  <span
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goToSlide(i)}
                    className={`hero-dot cursor-pointer ${heroSlide === i ? "hero-dot-active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </Card>
          <div className="col-span-1 lg:col-span-3 grid md:grid-cols-4 gap-6">
            {games.map((g) => (
              <Card
                key={g.slug}
                className="relative overflow-hidden border-zinc-900 rounded-[24px] bg-gradient-to-br from-zinc-900/60 to-black/60 p-0 h-40 md:h-44"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/70" />
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-gradient-to-tr from-blue-600/50 to-cyan-500/40 blur-2xl" />
                </div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-start">
                    <h3 className="text-lg font-semibold text-white">{g.title}</h3>
                  </div>
                  <div className="mt-2 text-xs text-white">{g.subtitle}</div>
                </div>
                <span className="absolute z-10 bottom-4 right-4 rounded-md bg-black text-white font-bold text-xs px-3 py-1">
                  {g.offers} offers
                </span>
              </Card>
            ))}
          </div>
          <div className="col-span-1 lg:col-span-3 flex justify-center">
            <Link
              href="/games"
              className="inline-flex rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              View All {moreCount} games
            </Link>
          </div>
        </section>
        <section className="mt-10">
          <Card className="rounded-xl border-zinc-900 bg-gradient-to-r from-blue-600 via-black to-black p-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Hot right now</h2>
              <button className="rounded-md bg-zinc-800 text-white text-xs px-3 py-1">Shuffle</button>
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotDeals.slice(0, 4).map((h) => (
                <div
                  key={h.slug}
                  className="relative rounded-xl overflow-hidden h-[19rem] bg-black border border-zinc-900"
                >
                  <div className="absolute top-0 left-0 right-0 h-[45%]">
                    <img src={h.image} alt={h.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-b from-black/40 via-black/20 to-transparent blur-[2px]" />
                    {h.logo && (
                      <img src={h.logo} alt="logo" className="absolute top-3 left-3 w-6 h-6 rounded-md object-cover" />
                    )}
                  </div>
                  <div className="absolute left-4 right-4 top-[40%]">
                    <div className="text-white font-bold text-lg md:text-xl leading-tight">{h.title}</div>
                    <ul className="mt-1 space-y-0.5">
                      {h.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span className="text-sm text-white">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
                    <div className="text-white font-bold">{h.price}</div>
                    <Link
                      href={`/buy/${h.slug}`}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      Buy now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
      <footer className="mt-10 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-zinc-500">
          © {new Date().getFullYear()} Gamingqu. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const games = [
  { slug: "wow", title: "World of Warcraft", offers: 972, subtitle: "New Raid Deals" },
  { slug: "destiny2", title: "Destiny 2", offers: 1156, subtitle: "Equilibrium Dungeon" },
  { slug: "wotlk", title: "WoW TBC Classic Anniversary", offers: 157, subtitle: "Events & Boosts" },
  { slug: "fc26", title: "FC 26", offers: 19, subtitle: "Cheapest Coins" },
  { slug: "cod", title: "Call of Duty", offers: 1424, subtitle: "BO7 Camos" },
  { slug: "arc", title: "ARC Raiders", offers: 58, subtitle: "Buy Blueprints" },
  { slug: "clash", title: "Clash Royale", offers: 3097, subtitle: "Arena Boosts" },
  { slug: "pandaria", title: "WoW Mists of Pandaria Classic", offers: 298, subtitle: "Leveling & More" },
  { slug: "poe2", title: "Path of Exile 2", offers: 333, subtitle: "Orbs For Sale" },
  { slug: "apex", title: "Apex Legends", offers: 245, subtitle: "Ranked Boosts" },
  { slug: "fortnite", title: "Fortnite", offers: 187, subtitle: "Skins & Wins" },
  { slug: "pubg", title: "PUBG", offers: 132, subtitle: "KD & Wins" },
];

const hotDeals = [
  {
    slug: "wow-gold",
    title: "Gold",
    price: "3.2€",
    features: ["Any amount of Gold", "Fast delivery", "Cheapest Gold"],
    image: "https://picsum.photos/seed/wow-gold/80/80",
  },
  {
    slug: "mythic-dungeons",
    title: "Mythic +2-20 Dungeons Boost",
    price: "46€",
    features: ["684-701 ilvl Gear", "694-707 Weekly Chest", "FREE Timer & Traders"],
    image: "https://picsum.photos/seed/mythic-dungeons/80/80",
  },
  {
    slug: "manaforge-omega",
    title: "Manaforge Omega Mythic Boost",
    price: "40€",
    features: ["Fair price", "Quick start"],
    image: "https://picsum.photos/seed/manaforge-omega/80/80",
  },
  {
    slug: "flawless-trials",
    title: "Flawless Trials of Osiris",
    price: "72€",
    features: ["Trials Weapons", "Win Streak Options", "Up to 100 Extra Wins"],
    image: "https://picsum.photos/seed/flawless-trials/80/80",
  },
  {
    slug: "equilibrium-dungeon",
    title: "Equilibrium Dungeon",
    price: "113€",
    features: ["Tier 5 Weapons", "Unique Dungeon Gear", "Fast & Safe Carries"],
    image: "https://picsum.photos/seed/equilibrium-dungeon/80/80",
  },
];
