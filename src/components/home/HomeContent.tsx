"use client";
import { FiRefreshCw, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Trophy, Star, Shield, Users, Zap, Clock, BadgeCheck, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/providers";
import { HowItWorks } from "./HowItWorks";
import { ArtImage } from "@/components/art/ArtImage";
import { CategoryArt, BoosterArt, type CategoryKind } from "@/components/art/CategoryArt";

type GameItem = {
  slug: string;
  title: string;
  subtitle?: string;
  offers?: number;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isHotOffer?: boolean;
};

type HeroSlide = {
  subtitle: string;
  title: string;
  href: string;
  cta: string;
  image?: string;
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

const CATEGORIES: { kind: CategoryKind; label: string; hint: string }[] = [
  { kind: "boosting", label: "Leveling", hint: "Fast XP & power leveling" },
  { kind: "items", label: "Dungeons & Raids", hint: "Loot runs and carries" },
  { kind: "accounts", label: "PvP & Arena", hint: "Rating and titles" },
  { kind: "currency", label: "Gold & Currency", hint: "Farmed, delivered safe" },
  { kind: "coaching", label: "Coaching", hint: "Learn from pros" },
];

const TRUST = [
  { icon: Trophy, title: "2,000+ orders", text: "Completed and delivered" },
  { icon: Star, title: "4.9 / 5 rating", text: "From verified customers" },
  { icon: Shield, title: "Secure checkout", text: "PayPal, cards and crypto" },
  { icon: Users, title: "Vetted boosters", text: "Top-ranked, hand-picked" },
];

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function SectionHeader({
  icon,
  title,
  eyebrow,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="flex items-center gap-3 text-2xl font-bold text-white md:text-3xl">
          {icon}
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function HomeContent() {
  const router = useRouter();
  const [moreCount, setMoreCount] = useState(0);
  const [games, setGames] = useState<GameItem[]>([]);
  const [gamesLoaded, setGamesLoaded] = useState(false);
  const [hotServices, setHotServices] = useState<HotService[]>([]);
  const [hotLoading, setHotLoading] = useState(false);
  const { symbol: currency, convert } = useCurrency();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [gamesRes, bannerRes, hotRes] = await Promise.all([
          fetch("/api/games", { cache: "no-store" }),
          fetch("/api/benner", { cache: "no-store" }),
          fetch("/api/services/hot", { cache: "no-store" }),
        ]);
        const data = await gamesRes.json().catch(() => null);
        if (Array.isArray(data?.items)) setGames(data.items);
        if (typeof data?.total === "number") setMoreCount(data.total);
        const bannerData = await bannerRes.json().catch(() => null);
        if (Array.isArray(bannerData?.banners) && bannerData.banners.length > 0) {
          const slides = bannerData.banners
            .slice(0, 10)
            .map((b: { subtitle?: string; title?: string; buttonLink?: string; buttonImageUrl?: string }) => ({
              subtitle: b.subtitle || "",
              title: b.title || "",
              href: b.buttonLink || "/",
              cta: "Read more",
              image: typeof b.buttonImageUrl === "string" && b.buttonImageUrl ? b.buttonImageUrl : undefined,
            }));
          setHeroSlides(slides);
          setHeroSlide(0);
        }
        const hotData = await hotRes.json().catch(() => null);
        if (Array.isArray(hotData?.services)) setHotServices(shuffle<HotService>(hotData.services).slice(0, 8));
      } catch {
      } finally {
        setGamesLoaded(true);
      }
    };
    load();
  }, []);

  const refreshHotServices = async () => {
    setHotLoading(true);
    try {
      const res = await fetch("/api/services/hot", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data?.services)) setHotServices(shuffle<HotService>(data.services).slice(0, 8));
    } catch {}
    setHotLoading(false);
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const id = setInterval(() => setHeroSlide((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  const stepSlide = (d: number) =>
    setHeroSlide((c) => (c + d + heroSlides.length) % Math.max(heroSlides.length, 1));

  const scrollToGames = () => document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });

  const hiddenGames = moreCount - Math.min(games.length, 12);

  return (
    <div className="min-h-screen bg-ink-900 text-base-content">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="hero-halo" />
        <div className="hero-rings" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 text-center sm:px-6 md:pb-20 md:pt-20">
          <div className="chip mx-auto mb-6 text-brand-100">
            <span className="h-2 w-2 rounded-full bg-lime-glow shadow-[0_0_10px_#b6f24a]" />
            Boosters online now · Orders start in minutes
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-7xl">
            Skip the grind.
            <br />
            <span className="gradient-text">Play the fun part.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 md:text-lg">
            Hand-picked pro players level, gear and rank up your account while you focus on the
            game you love. Track every step live from your dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={scrollToGames} className="btn btn-gaming h-12 rounded-2xl px-7 text-base">
              Choose your game <FiArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/work-with-us"
              className="btn h-12 rounded-2xl border border-white/15 bg-white/[0.04] px-7 text-base text-white hover:border-brand-400/60 hover:bg-white/[0.08]"
            >
              Become a booster
            </Link>
          </div>

          {/* Category tiles */}
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.kind}
                onClick={scrollToGames}
                className={`group surface surface-hover flex flex-col items-center gap-2 px-3 pb-4 pt-3 text-center backdrop-blur ${
                  i === 4 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <CategoryArt kind={c.kind} className="h-16 w-16 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 md:h-20 md:w-20" />
                <span className="text-sm font-semibold text-white md:text-base">{c.label}</span>
                <span className="hidden text-xs text-gray-400 md:block">{c.hint}</span>
              </button>
            ))}
          </div>

          {/* Rating strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <b className="text-white">4.9</b> customer rating
            </span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-lime-glow" /> Money-back guarantee</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-300" /> 24/7 live support</span>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        {/* ============ TRENDING GAMES ============ */}
        <section id="games" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Pick a game"
            icon={<Flame className="h-7 w-7 text-accent-400" />}
            title="Trending games"
            action={
              hiddenGames > 0 ? (
                <Link href="/games" className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]">
                  View all <FiChevronRight className="h-4 w-4" />
                </Link>
              ) : null
            }
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {!gamesLoaded &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-[1.25rem] bg-white/[0.04] md:h-52" />
              ))}
            {games.slice(0, 12).map((g, i) => (
              <Link
                href={`/${g.slug}`}
                key={g.slug}
                className={`game-tile group block h-40 md:h-52 ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
              >
                <ArtImage src={g.imageUrl} alt={g.title} seed={g.slug} imgClassName="game-tile-art" className="game-tile-art" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-4">
                  <h3 className="max-w-[80%] text-base font-bold leading-tight text-white drop-shadow-lg md:text-xl">{g.title}</h3>
                  {g.isHotOffer && (
                    <span className="chip border-accent-400/40 bg-accent-500/80 text-[10px] text-white">
                      <Flame className="h-3 w-3" /> HOT
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-3 sm:justify-between md:p-4">
                  <span className="chip hidden max-w-[65%] truncate text-gray-100 sm:inline-flex">
                    <Zap className="h-3.5 w-3.5 shrink-0 text-brand-300" />
                    <span className="truncate">Boosting</span>
                  </span>
                  {typeof g.offers === "number" && g.offers > 0 && (
                    <span className="rounded-lg bg-ink-950/80 px-2 py-1 text-xs font-bold text-white ring-1 ring-white/10">
                      {g.offers} {g.offers === 1 ? "service" : "services"}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {gamesLoaded && games.length === 0 && (
            <div className="surface p-8 text-center text-gray-400">New games are being added. Check back soon.</div>
          )}
        </section>

        {/* ============ FEATURED (admin banners) ============ */}
        {heroSlides.length > 0 && (
          <section className="mt-16" aria-roledescription="carousel" aria-label="Featured">
            <div className="relative h-[340px] overflow-hidden rounded-[1.5rem] border border-white/10 md:h-[380px]">
              {heroSlides.map((s, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ${idx === heroSlide ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
                  aria-hidden={idx !== heroSlide}
                >
                  <ArtImage src={s.image} alt={s.title} seed={s.title || `slide-${idx}`} priority={idx === 0} />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/10" />
                  <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-14">
                    <div className="max-w-xl">
                      <div className="eyebrow mb-3">Featured</div>
                      <h2 className="text-2xl font-extrabold leading-tight text-white md:text-4xl">{s.title}</h2>
                      <p className="mt-3 text-base text-gray-300 md:text-lg">{s.subtitle}</p>
                      <Link href={s.href} className="btn btn-gaming mt-6 h-11 rounded-xl px-6">
                        {s.cta} <FiArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
                  <button onClick={() => stepSlide(-1)} className="btn btn-circle btn-sm border-white/10 bg-ink-950/70 text-white hover:bg-brand-600" aria-label="Previous slide">
                    <FiChevronLeft />
                  </button>
                  <div className="flex gap-1.5 px-1">
                    {heroSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${heroSlide === i ? "w-6 bg-brand-400" : "w-1.5 bg-white/40 hover:bg-white"}`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button onClick={() => stepSlide(1)} className="btn btn-circle btn-sm border-white/10 bg-ink-950/70 text-white hover:bg-brand-600" aria-label="Next slide">
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        <section aria-label="WoW TBC Classic SEO Hub" className="sr-only">
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="h-5 w-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white">WoW TBC Classic Boosting Services</h2>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Cari layanan WoW TBC Classic boost yang cepat & aman: leveling, gold farming,
              heroic dungeon, arena 2v2, hingga paket Burning Crusade Classic boosting.
              Layanan kami fokus pada kecepatan, keamanan, dan hasil yang terukur.
            </p>
            <div className="sr-only">
              {[
                "wow tbc classic boost",
                "tbc anniversary leveling boost",
                "wow tbc gold farming service",
                "tbc heroic dungeon boost",
                "wow tbc arena boost 2v2",
                "burning crusade classic boosting",
                "WoW TBC Classic Boosting Services | Fast & Safe Boost",
              ].map((k) => (
                <span
                  key={k}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {k}
                </span>
              ))}
            </div>
            <div className="sr-only">
              <div>
                <div>Contoh artikel yang bisa dibuat</div>
                <ul>
                  <li>Best Gold Farming TBC Classic 2026</li>
                  <li>Fastest Leveling Guide WoW TBC</li>
                  <li>How to Unlock Heroic Dungeons TBC</li>
                  <li>Best Arena Comp TBC Classic</li>
                  <li>How to Farm Badges of Justice</li>
                </ul>
              </div>
              <div>
                <div>Target keyword</div>
                <div>
                  {["tbc leveling guide", "tbc gold farm", "tbc heroic dungeon guide", "tbc arena guide"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOT DEALS ============ */}
        {hotServices.length > 0 && (
          <section className="mt-16">
            <SectionHeader
              eyebrow="Best sellers"
              icon={<Sparkles className="h-7 w-7 text-brand-300" />}
              title="Hot deals right now"
              action={
                <button
                  onClick={refreshHotServices}
                  disabled={hotLoading}
                  className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]"
                  aria-label="Shuffle hot deals"
                >
                  <FiRefreshCw className={`h-4 w-4 ${hotLoading ? "animate-spin" : ""}`} /> Shuffle
                </button>
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hotServices.slice(0, hotServices.length >= 8 ? 8 : hotServices.length >= 4 ? 4 : hotServices.length).map((h) => {
                const href = `/${h.game.slug}/${h.slug}`;
                const { whole, decimal, showDecimal } = formatPrice(convert(Number(h.price)));
                return (
                  <div
                    key={h.id}
                    className="game-tile group flex cursor-pointer flex-col bg-ink-800"
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(href)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(href);
                      }
                    }}
                  >
                    <div className="relative h-36 shrink-0 overflow-hidden">
                      <ArtImage src={h.imageUrl} alt={h.name} seed={h.slug} className="game-tile-art" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent" />
                      <span className="chip absolute left-3 top-3 max-w-[85%] truncate text-[11px] text-gray-100">{h.game.name}</span>
                      {h.isHotOffer && (
                        <span className="chip absolute right-3 top-3 border-accent-400/40 bg-accent-500/80 text-[10px] text-white">
                          <Flame className="h-3 w-3" /> HOT
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4 pt-1">
                      <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-200">{h.name}</h3>
                      <ul className="mt-3 flex-1 space-y-1.5 text-sm text-gray-300">
                        {(Array.isArray(h.features) ? h.features : []).slice(0, 3).map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-400" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-gray-500">From</div>
                          <div className="font-display text-xl font-bold text-white">
                            {currency}
                            {whole}
                            {showDecimal && <span className="text-sm text-gray-300">.{decimal}</span>}
                          </div>
                        </div>
                        <Link
                          href={href}
                          onClick={(e) => e.stopPropagation()}
                          className="btn btn-gaming h-10 min-h-0 rounded-xl px-5 text-sm"
                        >
                          Buy now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============ HOW IT WORKS ============ */}
        <div className="mt-16">
          <HowItWorks />
        </div>

        {/* ============ BECOME A BOOSTER ============ */}
        <section className="relative mt-16 overflow-hidden rounded-[1.75rem] border border-brand-500/25 bg-gradient-to-br from-brand-900/60 via-ink-800 to-ink-900">
          <div className="dot-grid absolute inset-0 opacity-60" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="relative grid items-center gap-6 p-8 md:grid-cols-2 md:p-12">
            <div>
              <div className="eyebrow mb-3">For pro players</div>
              <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                Turn your skill into <span className="gradient-text">income</span>
              </h2>
              <p className="mt-4 max-w-md text-gray-300">
                Pick the jobs you want, play on your own schedule and get paid out weekly. We handle
                customers, payments and support.
              </p>
              <ul className="mt-6 grid gap-2 text-sm text-gray-200 sm:grid-cols-2">
                {["Flexible hours", "Weekly payouts", "Fair rates per job", "Dedicated booster panel"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-lime-glow" /> {t}
                  </li>
                ))}
              </ul>
              <Link href="/work-with-us" className="btn btn-gaming mt-8 h-12 rounded-2xl px-7">
                Apply as booster <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <BoosterArt className="mx-auto h-56 w-full max-w-sm md:h-72" />
          </div>
        </section>

        {/* ============ TRUST ============ */}
        <section className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="surface flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white">{title}</div>
                <div className="text-xs text-gray-400">{text}</div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
