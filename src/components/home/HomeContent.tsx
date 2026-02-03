"use client";
import Image from "next/image";
import { FiRefreshCw, FiArrowRight, FiZap } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Trophy } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

type GameItem = {
  slug: string;
  title: string;
  subtitle?: string;
  offers?: number;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isHotOffer?: boolean;
};

type HotService = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  features: string[] | null;
  isHotOffer: boolean;
  game: { slug: string; name: string };
};

export function HomeContent() {
  const router = useRouter();
  const [moreCount, setMoreCount] = useState(0);
  const [games, setGames] = useState<GameItem[]>([]);
  const [hotServices, setHotServices] = useState<HotService[]>([]);
  const [hotLoading, setHotLoading] = useState(false);
  const [heroSlides, setHeroSlides] = useState([
    {
      subtitle: "Boost your game — and your wallet",
      title: "What boosts you, makes you",
      href: "/cashback",
      cta: "Read more",
      image: "https://picsum.photos/seed/cashback/960/540",
    },
    {
      subtitle: "Today's best prices",
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
        const [gamesRes, bannerRes, hotRes] = await Promise.all([
          fetch("/api/games", { cache: "no-store" }),
          fetch("/api/benner", { cache: "no-store" }),
          fetch("/api/services/hot", { cache: "no-store" }),
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
        const hotData = await hotRes.json().catch(() => null);
        if (hotData?.services && Array.isArray(hotData.services)) {
          setHotServices(hotData.services);
        }
      } catch { }
    };
    load();
  }, []);

  const refreshHotServices = async () => {
    setHotLoading(true);
    try {
      const res = await fetch("/api/services/hot", { cache: "no-store" });
      const data = await res.json();
      if (data?.services && Array.isArray(data.services)) {
        setHotServices(data.services);
      }
    } catch { }
    setHotLoading(false);
  };

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
    <div className="min-h-screen mesh-gradient text-base-content">
      {/* Floating particles */}
      <div className="particles" />

      <main className="mx-auto max-w-7xl px-6 py-10 relative z-10">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="col-span-1 lg:col-span-3 glass-card rounded-3xl overflow-hidden relative">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-cyan-500/30 animated-mesh z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent z-[1]" />

            <div ref={containerRef} className="relative z-10 overflow-hidden p-8 md:p-12">
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
                    <div className="space-y-5 max-w-xl">
                      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        {s.title}
                      </h1>
                      <p className="text-lg text-gray-400">
                        {s.subtitle}
                      </p>
                      <Link
                        href={s.href}
                        className="btn btn-gaming h-10 px-5 text-sm rounded-xl inline-flex items-center gap-2 group"
                      >
                        {s.cta}
                        <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                    <div className="relative justify-self-end w-full md:w-[420px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mr-8 md:mr-18 glow-border">
                      <Image src={s.image} alt={s.title} fill className="object-cover" unoptimized sizes="420px" />
                      <div className="hero-stripes" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/60 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Hero dots */}
              <div className="hero-dots">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goToSlide(i)}
                    className="hero-dot-btn"
                    title={`Slide ${i + 1}`}
                  >
                    <span className={`hero-dot ${heroSlide === i ? "hero-dot-active" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Popular Games</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
        </div>

        {/* Game Cards Grid */}
        <section className="grid md:grid-cols-4 gap-5 mb-10">
          {games.slice(0, 12).map((g) => (
            <Link
              href={`/${g.slug}`}
              key={g.slug}
              className="card-gaming rounded-2xl overflow-hidden h-44 relative group cursor-pointer"
            >
              {/* Background Image */}
              {g.imageUrl ? (
                <Image
                  src={g.imageUrl}
                  alt={g.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="320px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-cyan-900/50" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/40 to-transparent z-[1]" />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end z-[3]">
                <h3 className="font-bold text-white text-lg drop-shadow-lg group-hover:text-blue-300 transition-colors">
                  {g.title}
                </h3>
              </div>

              {/* Hot Badge */}
              {g.isHotOffer && (
                <div className="absolute top-3 right-3 z-[4] bg-red-500 px-3 py-1 rounded-full flex items-center gap-1 font-bold text-white text-xs shadow-lg">
                  <Flame className="h-3 w-3" />
                  HOT
                </div>
              )}
            </Link>
          ))}
        </section>

        {/* View All Button */}
        {(moreCount - Math.min(games.length, 12) > 0) && (
          <div className="flex justify-center mb-16">
            <Link
              href="/games"
              className="btn btn-gaming btn-wide h-14 text-lg rounded-2xl"
            >
              <FiZap className="h-5 w-5 mr-2" />
              View All {moreCount - Math.min(games.length, 12)} Games
            </Link>
          </div>
        )}

        {/* Hot Deals Section */}
        <section className="mt-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Hot Right Now</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/30 to-transparent ml-4" />
            </div>
            <button
              onClick={refreshHotServices}
              disabled={hotLoading}
              className="btn btn-ghost btn-circle glass-light hover:glow-primary transition-all"
              aria-label="Refresh hot services"
              title="Refresh hot services"
            >
              <FiRefreshCw className={`h-5 w-5 ${hotLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Hot Services Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {hotServices.map((h) => (
              <div
                key={h.id}
                className="card-gaming rounded-2xl overflow-hidden group flex flex-col border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] cursor-pointer"
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/${h.game.slug}/${h.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/${h.game.slug}/${h.slug}`);
                  }
                }}
              >
                {/* Image */}
                <figure className="relative h-32 shrink-0 overflow-hidden">
                  {h.imageUrl ? (
                    <Image
                      src={h.imageUrl}
                      alt={h.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="300px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent" />
                </figure>

                {/* Content */}
                <div className="p-3 flex flex-col flex-grow relative z-10">
                  <h3 className="font-bold text-white text-sm leading-snug truncate group-hover:text-blue-300 transition-colors">
                    {h.name}
                  </h3>

                  {/* Features */}
                  <ul className="text-[10px] space-y-1 text-gray-400 mt-2 mb-2 flex-grow">
                    {h.features && Array.isArray(h.features) ? h.features.slice(0, 3).map((f: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="truncate font-medium">{f}</span>
                      </li>
                    )) : null}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="font-bold text-lg text-white flex items-center">
                      {(() => {
                        const { whole, decimal, showDecimal } = formatPrice(h.price);
                        return (
                          <span className="gradient-text">
                            {whole}
                            {showDecimal && (
                              <span className="text-xs font-bold ml-0.5">
                                ,{decimal}
                              </span>
                            )}
                          </span>
                        );
                      })()}
                      <span className="text-md ml-1 text-gray-400">€</span>
                    </span>
                    <Link
                      href={`/${h.game.slug}/${h.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-gaming btn-sm px-4 h-9 rounded-xl text-xs font-bold"
                    >
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

