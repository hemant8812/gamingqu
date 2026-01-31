"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowLeft, Zap, Tag, Sparkles, ShoppingBag } from "lucide-react";

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

function ServiceCard({ s }: { s: ServiceItem }) {
    const priceNum = parseFloat(s.price);
    const priceFormatted = priceNum.toFixed(2); // "60.00" or "60.12"
    const [priceWhole, priceDecimal] = priceFormatted.split("."); // ["60", "00"] or ["60", "12"]
    const showDecimal = priceDecimal !== "00"; // Only show decimal if not .00

    return (
        <div className="card-gaming rounded-2xl overflow-hidden group flex flex-col border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]">
            {/* Image */}
            <figure className="relative h-32 shrink-0 overflow-hidden">
                {s.imageUrl ? (
                    <Image
                        src={s.imageUrl}
                        alt={s.name}
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
                    {s.name}
                </h3>

                {/* Features */}
                <ul className="text-[10px] space-y-1 text-gray-400 mt-2 mb-2 flex-grow">
                    {s.features && Array.isArray(s.features) ? s.features.slice(0, 3).map((f, idx) => (
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
                        <span className="gradient-text">
                            {priceWhole}
                            {showDecimal && (
                                <span className="text-xs font-bold ml-0.5">
                                    ,{priceDecimal}
                                </span>
                            )}
                        </span>
                        <span className="text-md ml-1 text-gray-400">€</span>
                    </span>
                    <Link
                        href={`/buy/${s.slug}`}
                        className="btn btn-gaming btn-sm px-4 h-9 rounded-xl text-xs font-bold"
                    >
                        Buy now
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
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await fetch(`/api/games/${slug}`, { cache: "no-store" });
                if (!res.ok) {
                    setGame(null);
                } else {
                    const data = await res.json();
                    setGame(data);
                    // Set first category as active by default, or "all" if no categories
                    if (data.categories?.length > 0) {
                        setActiveCategory("all");
                    }
                }
            } catch {
                setGame(null);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen mesh-gradient flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-blue-500"></div>
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
                {game.imageUrl && (
                    <Image
                        src={game.imageUrl}
                        alt={game.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17]/50 to-transparent" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
                        <div className="flex items-center gap-6">
                            {game.iconUrl && (
                                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0">
                                    <Image
                                        src={game.iconUrl}
                                        alt={game.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 80px, 112px"
                                        quality={100}
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                                    {game.name}
                                </h1>
                                {game.description && (
                                    <p
                                        className="text-gray-300 text-base md:text-lg mt-2 max-w-2xl line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: game.description }}
                                    />
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
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
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
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
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
                        <Zap className="h-6 w-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">
                            {activeCategory === "all" || !activeCategory
                                ? "All Services"
                                : game.categories.find((c) => c.id === activeCategory)?.name || "Services"}
                        </h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
                </div>

                {displayedServices.length === 0 ? (
                    <div className="py-12 text-center">
                        <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No services available in this category yet.</p>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {displayedServices.map((s) => (
                            <ServiceCard key={s.id} s={s} />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
