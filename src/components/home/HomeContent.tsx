"use client";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

type GameItem = {
  slug: string;
  title: string;
  subtitle?: string;
  offers?: number;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isHotOffer?: boolean;
};

type HotDeal = {
  slug: string;
  title: string;
  price: string;
  features: string[];
  image: string;
  logo?: string;
};

const hotDeals: HotDeal[] = [
  {
    slug: "wow-gold",
    title: "Gold",
    price: "633€",
    features: ["Complete Safety", "Quick Delivery", "Fair Price"],
    image: "https://picsum.photos/seed/wow-gold/150/150",
  },
  {
    slug: "powerleveling",
    title: "Powerleveling",
    price: "1392€",
    features: ["60-70 Pre-order", "Quick Start", "Any Level Range"],
    image: "https://picsum.photos/seed/powerleveling/150/150",
  },
  {
    slug: "tbc-gearing",
    title: "TBC Pre-Patch Gearing",
    price: "1014€",
    features: ["Full Pre-Patch Gear", "Fast Honor Farming", "Safe Delivery"],
    image: "https://picsum.photos/seed/tbc-gearing/150/150",
  },
  {
    slug: "hourly-driving",
    title: "Hourly Driving",
    price: "728€",
    features: ["Choose Any Activity", "No Need To Grind", "Best Price"],
    image: "https://picsum.photos/seed/hourly-driving/150/150",
  },
  {
    slug: "dungeon-leveling",
    title: "Dungeon Leveling",
    price: "2591€",
    features: ["Fast Leveling", "Multiple Dungeons", "Best Price"],
    image: "https://picsum.photos/seed/dungeon-leveling/150/150",
  },
];

export function HomeContent() {
  const [moreCount, setMoreCount] = useState(0);
  const [games, setGames] = useState<GameItem[]>([]);
  const [heroSlides, setHeroSlides] = useState([
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
  ]);
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

  useEffect(() => {
    const load = async () => {
      try {
        const [gamesRes, bannerRes] = await Promise.all([
          fetch("/api/games", { cache: "no-store" }),
          fetch("/api/benner", { cache: "no-store" }),
        ]);
        const data = await gamesRes.json();
        if (Array.isArray(data?.items)) {
          setGames(data.items);
        }
        if (typeof data?.total === "number") {
          setMoreCount(data.total);
        }
        const bannerData = await bannerRes.json().catch(() => null);
        if (bannerData?.banners && Array.isArray(bannerData.banners) && bannerData.banners.length > 0) {
          const slides = bannerData.banners.slice(0, 10).map((b: { subtitle?: string; title?: string; buttonLink?: string; buttonImageUrl?: string }, idx: number) => ({
            subtitle: b.subtitle || "",
            title: b.title || "",
            href: b.buttonLink || "/",
            cta: "Read more",
            image: (b.buttonImageUrl && typeof b.buttonImageUrl === "string" ? b.buttonImageUrl : `https://picsum.photos/seed/benner-${idx}/960/540`),
          }));
          setHeroSlides(slides);
          setHeroSlide(0);
          setDir(1);
        }
      } catch {}
    };
    load();
  }, []);

  const goToSlide = (n: number) => {
    setHeroSlide(n);
    const last = heroSlides.length - 1;
    if (n === 0) setDir(1);
    else if (n === last) setDir(-1);
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const id = setInterval(() => {
      setHeroSlide((curr) => {
        const last = heroSlides.length - 1;
        if (last <= 0) return 0;
        if (curr === 0) {
          setDir(1);
          return 1;
        }
        if (curr === last) {
          setDir(-1);
          return last - 1;
        }
        return curr + dir;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [dir, heroSlides.length]);

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card col-span-1 lg:col-span-3 bg-base-100 shadow-xl overflow-hidden rounded-box">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-transparent opacity-80 z-0" />
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
                      <div className="text-3xl md:text-5xl font-black text-white tracking-tight">{s.title}</div>
                      <div className="text-white text-sm opacity-90">{s.subtitle}</div>
                      <Link href={s.href} className="btn !bg-[#2563EB] !hover:bg-[#1D4ED8] border-none text-white hover:scale-105 transition-transform">
                        {s.cta}
                      </Link>
                    </div>
                    <div className="relative justify-self-end w-full md:w-[420px] aspect-[16/9] rounded-box overflow-hidden shadow-2xl mr-8 md:mr-18">
                      <Image src={s.image} alt={s.title} fill className="object-cover" unoptimized sizes="420px" />
                      <div className="hero-stripes" />
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
          </div>
          
          <div className="col-span-1 lg:col-span-3 grid md:grid-cols-4 gap-6">
            {games.slice(0, 12).map((g) => (
              <div
                key={g.slug}
                className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-40 md:h-44 image-full"
              >
                <figure>
                    {g.imageUrl ? (
                        <Image src={g.imageUrl} alt={g.title} fill className="object-cover transition-transform duration-500 hover:scale-110" sizes="320px" />
                    ) : (
                        <div className="w-full h-full bg-neutral" />
                    )}
                </figure>
                <div className="card-body p-5 justify-end">
                    <h3 className="card-title text-white text-lg drop-shadow-md">{g.title}</h3>
                </div>
                {g.isHotOffer && (
                  <div className="absolute top-3 right-3 badge badge-error gap-1 font-bold animate-pulse">
                    <Flame className="h-3 w-3" />
                    HOT
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {(moreCount - Math.min(games.length, 12) > 0) && (
            <div className="col-span-1 lg:col-span-3 flex justify-center">
              <Link
                href="/games"
                className="btn btn-wide !bg-[#2563EB] !hover:bg-[#1D4ED8] text-white border-none"
              >
                View All {moreCount - Math.min(games.length, 12)} games
              </Link>
            </div>
          )}
        </section>
        
        <section className="mt-10">
          <div className="card bg-neutral text-neutral-content shadow-xl overflow-hidden">
            <div className="card-body p-0">
                <div className="p-6 flex items-center justify-between bg-neutral-focus">
                    <h2 className="text-xl font-bold">Hot right now</h2>
                    <button className="btn btn-sm btn-ghost btn-circle">
                        <FiRefreshCw className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {hotDeals.slice(0, 5).map((h) => (
                    <div
                    key={h.slug}
                    className="card bg-[#151921] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-[17rem] border border-white/5 flex flex-col overflow-hidden group rounded-xl"
                    >
                    <figure className="relative h-28 shrink-0 overflow-hidden">
                        <Image src={h.image} alt={h.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized sizes="300px" />
                    </figure>
                    <div className="card-body p-4 pt-2 text-left flex flex-col gap-1 h-full relative">
                        <h3 className="font-bold text-white text-base leading-snug truncate group-hover:text-[#2563EB] transition-colors">{h.title}</h3>
                        
                        <ul className="text-[10px] space-y-1.5 text-gray-400 mt-1 mb-1 flex-grow">
                        {h.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                <div className="w-1 h-1 rounded-full bg-success"></div>
                            </div>
                            <span className="truncate font-medium">{f}</span>
                            </li>
                        ))}
                        </ul>
                        
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                            <span className="font-bold text-lg text-white tracking-tight flex items-start">
                                {h.price.replace("€", "").slice(0, -1)}
                                <span className="text-[10px] font-bold mt-0.5 ml-0.5 opacity-90">{h.price.replace("€", "").slice(-1)}</span>
                                <span className="text-sm ml-0.5">€</span>
                            </span>
                            <Link
                            href={`/buy/${h.slug}`}
                            className="btn btn-xs !bg-[#2563EB] !hover:bg-[#1D4ED8] text-white border-none px-4 h-8 min-h-[2rem] rounded-md font-bold shadow-lg shadow-blue-500/20 normal-case"
                            >
                            Buy now
                            </Link>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
