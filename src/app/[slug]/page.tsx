"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArtImage } from "@/components/art/ArtImage";
import Link from "next/link";
import { Zap, Tag, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { stripHtml } from "@/lib/text";
import { useCurrency } from "@/app/providers";
import { TrustBanner } from "@/components/shared/TrustBanner";
import { SITE_DEFAULTS } from "@/lib/constants";

type ServiceItem = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    price: string;
    isHotOffer: boolean;
    features: string[] | null;
};

type CategoryItem = {
    id: string;
    name: string;
    slug: string;
    services: ServiceItem[];
};

type GameData = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    iconUrl?: string | null;
    categories: CategoryItem[];
    services: ServiceItem[];
};

type PageData = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

function ServiceCard({ s, gameSlug }: { s: ServiceItem; gameSlug: string }) {
    const { symbol: currency, convert } = useCurrency();
    const conv = convert(typeof s.price === "string" ? parseFloat(s.price) : (s.price as unknown as number));
    const { whole, decimal, showDecimal } = formatPrice(conv);
    const router = useRouter();
    const href = `/${gameSlug}/${s.slug}`;

    return (
        <div
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
            {/* Image */}
            <figure className="relative h-36 shrink-0 overflow-hidden">
                <ArtImage src={s.imageUrl} alt={s.name} seed={s.slug} className="game-tile-art" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent" />
            </figure>

            {/* Content */}
            <div className="p-4 pt-1 flex flex-col flex-grow relative z-10">
                <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-brand-200 transition-colors">
                    {s.name}
                </h3>

                {/* Features */}
                <ul className="text-xs space-y-1.5 text-gray-300 mt-3 mb-3 flex-grow">
                    {s.features && Array.isArray(s.features) ? s.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-400" />
                            <span className="truncate font-medium">{f}</span>
                        </li>
                    )) : null}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
                    <span className="font-bold text-lg text-white flex items-center">
                        <span className="text-md mr-1 text-white">{currency}</span>
                        <span className="text-white">
                            {whole}
                            {showDecimal && (
                                <span className="text-xs font-bold ml-0.5">
                                    ,{decimal}
                                </span>
                            )}
                        </span>
                    </span>
                    <Link
                        href={href}
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-gaming btn-buynow btn-sm px-4 h-9 rounded-md inline-flex items-center justify-center text-xs font-bold"
                    >
                        <span>Buy Now</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default function GamePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [game, setGame] = useState<GameData | null>(null);
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [brandName, setBrandName] = useState<string>(SITE_DEFAULTS.name);
    const [bannerLogoUrl, setBannerLogoUrl] = useState<string>(SITE_DEFAULTS.logo);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Try to fetch game first
                const resGame = await fetch(`/api/games/${slug}`, { cache: "no-store" });
                if (resGame.ok) {
                    const data = await resGame.json();
                    setGame(data);
                    if (data.categories?.length > 0) {
                        setActiveCategory("all");
                    }
                    setLoading(false);
                    return;
                }

                // If not game, try to fetch page
                const resPage = await fetch(`/api/pages/${slug}`, { cache: "no-store" });
                if (resPage.ok) {
                    const data = await resPage.json();
                    setPage(data);
                    setLoading(false);
                    return;
                }
                
                // If neither found
                setGame(null);
                setPage(null);
            } catch {
                setGame(null);
                setPage(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    const site = data?.website ?? {};
                    const name: string = site?.siteName ?? SITE_DEFAULTS.name;
                    const favicon: string | null = site?.faviconUrl ?? null;
                    const logo: string | null = site?.logoUrl ?? null;
                    setBrandName(name);
                    setBannerLogoUrl(String(favicon || logo || SITE_DEFAULTS.logo));
                }
            } catch {}
        })();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen mesh-gradient flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-brand-500"></div>
            </div>
        );
    }

    if (page) {
        const date = new Date(page.updatedAt || page.createdAt);
        const formattedDate = date.toLocaleDateString("en-US", { year: 'numeric', month: 'long' });

        return (
            <div className="min-h-screen bg-ink-900 text-white pt-[72px] pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="bg-ink-800/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{page.title}</h1>
                            <p className="text-gray-400 text-sm">Last Updated: {formattedDate}</p>
                        </div>
                        <div className="prose prose-invert max-w-none text-left 
                            prose-p:text-gray-400 prose-p:text-sm prose-p:leading-relaxed prose-p:mb-4
                            prose-headings:text-white prose-headings:font-bold prose-headings:text-base prose-headings:uppercase prose-headings:tracking-wider prose-headings:mt-8 prose-headings:mb-4
                            prose-a:text-brand-400 
                            prose-li:text-gray-400 prose-li:text-sm prose-li:marker:text-gray-500
                            prose-strong:text-white prose-strong:font-bold
                            prose-ul:space-y-2 prose-ul:my-4
                            prose-hr:border-white/10 prose-hr:my-8
                            [&>*]:!text-left [&>*]:!mx-0 [&>div]:!mx-0" 
                            dangerouslySetInnerHTML={{ __html: page.content || "" }} 
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (!game) {
        notFound();
    }

    // Collect all services for "All" tab
    const allServices = [
        ...game.services,
        ...game.categories.flatMap((c) => c.services),
    ];

    const displayedServices =
        activeCategory === "all" || !activeCategory
            ? allServices
            : game.categories.find((c) => c.id === activeCategory)?.services || [];

    return (
        <div className="min-h-screen mesh-gradient text-base-content">
            <div className="particles" />

            {/* Hero Section with Game Image */}
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                <ArtImage src={game.imageUrl} alt={game.name} seed={game.slug} priority />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/50 to-transparent" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
                        <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(124,92,255,0.8)] ring-2 ring-white/15 shrink-0">
                                <ArtImage src={game.iconUrl ?? game.imageUrl} alt="" seed={game.slug} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                                    {game.name}
                                </h1>
                                {game.description && (
                                    <p className="text-gray-300 text-base md:text-lg mt-2 max-w-2xl line-clamp-2">
                                        {stripHtml(game.description)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-10 relative z-10">
                {/* Category Tabs */}
                {game.categories.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Tag className="h-5 w-5 text-purple-400" />
                                <h2 className="text-xl font-bold text-white">Services</h2>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={`px-5 py-2.5 rounded-md font-semibold text-sm transition-all duration-300 ${activeCategory === "all"
                                    ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/25"
                                    : "glass-light text-gray-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                All Services ({allServices.length})
                            </button>
                            {game.categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-md font-semibold text-sm transition-all duration-300 ${activeCategory === cat.id
                                        ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/25"
                                        : "glass-light text-gray-300 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {cat.name} ({cat.services.length})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services Section */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Zap className="h-6 w-6 text-brand-400" />
                        <h2 className="text-2xl font-bold text-white">
                            {activeCategory === "all" || !activeCategory
                                ? "All Services"
                                : game.categories.find((c) => c.id === activeCategory)?.name || "Services"}
                        </h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-brand-500/30 to-transparent" />
                </div>

                {displayedServices.length === 0 ? (
                    <div className="py-12 text-center">
                        <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No services available in this category yet.</p>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {displayedServices.map((s) => (
                            <ServiceCard key={s.id} s={s} gameSlug={game.slug} />
                        ))}
                    </section>
                )}
                <div className="mt-10">
                    <TrustBanner brandName={brandName} logoUrl={bannerLogoUrl} />
                </div>
            </main>
        </div>
    );
}
