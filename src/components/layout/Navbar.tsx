"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiUser, FiChevronDown, FiZap, FiPercent, FiBookOpen, FiThumbsUp, FiShield, FiMail, FiShoppingCart, FiLogOut, FiGrid, FiUsers, FiBarChart2, FiPlay, FiSettings, FiImage, FiTag, FiTool, FiClock, FiCreditCard, FiFileText } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/providers";
import { SITE_DEFAULTS } from "@/lib/constants";

type Props = {
  siteName?: string;
  logoUrl?: string | null;
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    username?: string | null;
    role?: "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN";
  } | null;
  // Admin sections this user may open (from lib/adminAccess).
  adminKeys?: string[];
};

type ApiServiceDTO = {
  id: number | string;
  name?: string;
  slug?: string;
  game?: { slug?: string };
  imageUrl?: string | null;
  price?: number | string;
};
type MenuGame = { slug: string; name: string; iconUrl?: string | null };

const ADMIN_MENU = [
  { key: "dashboard", href: "/admin", label: "Dashboard", icon: FiGrid },
  { key: "orders", href: "/admin/orders", label: "Orders", icon: FiShoppingCart },
  { key: "users", href: "/admin/users", label: "Users", icon: FiUsers },
  { key: "boosters", href: "/admin/boosters", label: "Boosters", icon: FiZap },
  { key: "analytics", href: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
  { key: "games", href: "/admin/games", label: "Games", icon: FiPlay },
  { key: "categories", href: "/admin/categories", label: "Categories", icon: FiTag },
  { key: "services", href: "/admin/services", label: "Services", icon: FiTool },
  { key: "services-data", href: "/admin/service-data", label: "Data Service", icon: FiBarChart2 },
  { key: "payment-method", href: "/admin/payment-method", label: "Payment Method", icon: FiCreditCard },
  { key: "blog", href: "/admin/blog", label: "Blog", icon: FiBookOpen },
  { key: "benner", href: "/admin/benner", label: "Banner", icon: FiImage },
  { key: "legal", href: "/admin/legal", label: "Legal Pages", icon: FiFileText },
  { key: "permissions", href: "/admin/permissions", label: "Permissions", icon: FiShield },
  { key: "settings", href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export function Navbar({ siteName = SITE_DEFAULTS.name, logoUrl = null, user = null, adminKeys = [] }: Props) {
  const { symbol: currency, setSymbol: setCurrency, convert } = useCurrency();
  const [showLogo, setShowLogo] = useState<boolean>(!!logoUrl);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRole = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  // Boosters work from their panel and do not see the shop (games, search, prices).
  const isBooster = user?.role === "BOOSTER";
  const homeHref = isBooster ? "/booster" : "/";
  const isAdminContext = isAdminRole || (pathname?.startsWith("/admin") || pathname?.startsWith("/super-admin"));
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ id: number; name: string; slug: string; gameSlug: string }>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [popularProducts, setPopularProducts] = useState<Array<{ id: number; name: string; slug: string; gameSlug: string; imageUrl?: string | null; price?: number }>>([]);
  const [menuGames, setMenuGames] = useState<MenuGame[]>([]);

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem instanceof HTMLElement) {
      elem.blur();
    }
  };

  const isSuperAdmin = user?.role === "SUPERADMIN";
  const allowedAdmin = new Set(adminKeys);
  const adminMenuItems = ADMIN_MENU.filter((m) => {
    if (m.key === "dashboard") return true;
    if (m.key === "permissions") return isSuperAdmin;
    return isSuperAdmin || allowedAdmin.has(m.key);
  }).map((m) => (
    <li key={m.key}>
      <Link href={m.href} onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200">
        <m.icon className="h-4 w-4 text-brand-400" /> {m.label}
      </Link>
    </li>
  ));

  useEffect(() => {
    if (!searchOpen) {
      return;
    }
    if (popularProducts.length === 0) {
      let canceled = false;
      fetch("/api/services/hot")
        .then((r) => r.json())
        .then((data) => {
          if (canceled) return;
          const list = Array.isArray(data?.services)
            ? data.services.map((s: ApiServiceDTO) => ({
                id: Number(s.id),
                name: String(s.name ?? ""),
                slug: String(s.slug ?? ""),
                gameSlug: String(s.game?.slug ?? ""),
                imageUrl: s.imageUrl ?? null,
                price: typeof s.price === "string" ? parseFloat(s.price) : Number(s.price),
              }))
            : [];
          setPopularProducts(list);
        })
        .catch(() => {})
        .finally(() => {});
      return () => {
        canceled = true;
      };
    }
  }, [searchOpen, popularProducts, searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    const q = searchQuery.trim();
    if (q.length === 0) {
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoadingSuggestions(true);
      fetch(`/api/services/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data?.services)
            ? data.services.map((s: ApiServiceDTO) => ({
                id: Number(s.id),
                name: String(s.name ?? ""),
                slug: String(s.slug ?? ""),
                gameSlug: String(s.game?.slug ?? ""),
              }))
            : [];
          setSearchSuggestions(list);
        })
        .catch(() => {})
        .finally(() => setLoadingSuggestions(false));
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [searchOpen, searchQuery, popularProducts]);

  const suggestionsToShow =
    searchQuery.trim().length === 0
      ? popularProducts.map(({ id, name, slug, gameSlug }) => ({ id, name, slug, gameSlug }))
      : searchSuggestions;

  useEffect(() => {
    let canceled = false;
    fetch("/api/games/simple")
      .then((r) => r.json())
      .then((data) => {
        if (canceled) return;
        const list = Array.isArray(data?.games)
          ? data.games.map((g: { slug?: string; name?: string; iconUrl?: string | null }) => ({
              slug: String(g.slug ?? ""),
              name: String(g.name ?? ""),
              iconUrl: g.iconUrl ?? null,
            }))
          : [];
        setMenuGames(list);
      })
      .catch(() => {});
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ink-950/75 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(124,92,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left Side: Logo & Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showLogo && logoUrl ? (
              <Link href={homeHref} className="text-xl p-0 inline-flex items-center" aria-label="Go to homepage">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={120}
                  height={40}
                  className="h-8 w-auto max-w-[118px] object-contain object-left sm:max-w-[180px]"
                  style={{ height: 32, width: "auto" }}
                  onError={() => setShowLogo(false)}
                  unoptimized
                  priority
                />
              </Link>
            ) : (
              <Link href={homeHref} className="p-0 inline-flex items-center gap-2" aria-label="Go to homepage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/arcaneboost-icon.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-xl shadow-[0_6px_18px_-6px_rgba(124,92,255,0.9)]" />
                <span className="font-display text-xl font-extrabold tracking-tight text-white">{siteName}</span>
              </Link>
            )}

            {!isBooster && <div className="dropdown hidden md:block">
              <button
                type="button"
                className="btn btn-ghost btn-sm h-10 min-h-[2.5rem] px-3 gap-2 text-gray-200 hover:text-white border border-white/10 hover:border-brand-500/40 bg-white/[0.03] hover:bg-brand-500/10 rounded-xl"
                aria-haspopup="menu"
                aria-label={isAdminContext ? "Open main menu" : "Select game"}
                onMouseDown={(e) => {
                  if (document.activeElement === e.currentTarget) {
                    e.currentTarget.blur();
                    e.preventDefault(); // Prevent re-focusing
                  }
                }}
              >
                {isAdminContext ? <FiGrid className="h-5 w-5" /> : <Gamepad2 className="h-5 w-5" />}
                <span className="font-bold hidden sm:inline">{isAdminContext ? "Main Menu" : "Select Game"}</span>
                <FiChevronDown className="h-4 w-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] bg-ink-800/95 backdrop-blur-xl border border-white/10 rounded-2xl w-64 mt-4 max-h-[70vh] flex-nowrap overflow-y-auto">
                {isAdminContext ? (
                  <>{adminMenuItems}</>
                ) : (
                  <>
                    {menuGames.length === 0 ? (
                      <li className="text-gray-400 px-4 py-2">No games</li>
                    ) : (
                      menuGames.map((g) => (
                        <li key={g.slug}>
                          <Link
                            href={`/${g.slug}`}
                            onClick={closeDropdown}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-xl text-gray-200"
                          >
                            <span className="w-7 h-7 rounded-lg overflow-hidden bg-white/10 ring-1 ring-white/10 flex items-center justify-center shrink-0">
                              {g.iconUrl ? (
                                <Image src={g.iconUrl} alt="" width={28} height={28} className="object-cover w-full h-full" unoptimized onError={(e) => { e.currentTarget.style.display = "none"; }} />
                              ) : (
                                <span className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-600" />
                              )}
                            </span>
                            <span className="whitespace-normal break-words">{g.name}</span>
                          </Link>
                        </li>
                      ))
                    )}
                  </>
                )}
              </ul>
            </div>}

            
          </div>

          {/* Center Search Bar (Desktop) */}
          {!isBooster && <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[22rem] lg:w-[34rem]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (q.length > 0) {
                  router.push(`/search?q=${encodeURIComponent(q)}`);
                } else {
                  router.push(`/search`);
                }
                setSearchOpen(false);
              }}
              className="w-full relative z-40"
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => {
                     // small delay to allow clicking suggestions
                     setTimeout(() => setSearchOpen(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchQuery("");
                      searchInputRef.current?.blur();
                    }
                  }}
                  placeholder="Search games and services..."
                  className="w-full h-11 pl-11 pr-4 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:bg-ink-900 focus:ring-4 focus:ring-brand-500/15 transition-all"
                  aria-label="Search input"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-300" />
              </div>

              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-ink-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] z-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                    <div>
                      <div className="px-2 pb-2 text-sm font-semibold text-white">Frequently searched</div>
                      {loadingSuggestions ? (
                        <div className="px-3 py-2 text-gray-400">Loading...</div>
                      ) : suggestionsToShow.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto">
                          {suggestionsToShow.map((s) => (
                            <li key={`${s.id}-${s.slug}`}>
                              <Link
                                href={`/${s.gameSlug}/${s.slug}`}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-sm"
                                onClick={() => setSearchOpen(false)}
                              >
                                <FiClock className="h-4 w-4 text-gray-400" />
                                <span className="text-white">{s.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                          {searchQuery.trim().length > 0 ? "No services found" : "Popular searches"}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="px-2 pb-2 text-sm font-semibold text-white">Popular Products</div>
                      {popularProducts.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400">Loading...</div>
                      ) : popularProducts.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto flex flex-col gap-3 pr-1">
                          {popularProducts.map((p) => (
                            <Link
                              key={`${p.id}-${p.slug}`}
                              href={`/${p.gameSlug}/${p.slug}`}
                              className="rounded-xl border border-white/10 bg-ink-900 hover:border-white/20 overflow-hidden"
                              onClick={() => setSearchOpen(false)}
                            >
                              <div className="relative h-24 w-full">
                                {p.imageUrl ? (
                                  <Image
                                    src={p.imageUrl}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
                                )}
                                <div className="absolute top-2 right-2 text-xs font-semibold bg-brand-600 text-white px-2 py-1 rounded-md">
                                  From {currency}{formatPrice(convert(p.price ?? 0)).formatted}
                                </div>
                              </div>
                              <div className="px-4 py-3">
                                <div className="text-sm font-semibold text-white line-clamp-2">{p.name}</div>
                                <div className="mt-2">
                                  <span className="btn btn-gaming btn-xs">Shop Now</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">No popular products</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>}

          {/* Right Side: Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isBooster && <div className="dropdown md:hidden">
              <button
                type="button"
                className="btn btn-ghost h-10 min-h-[2.5rem] px-3 gap-2 text-gray-300 hover:text-white border border-white/10 hover:border-brand-500/40 bg-white/[0.03] hover:bg-brand-500/10 rounded-xl"
                aria-haspopup="menu"
                aria-label={isAdminContext ? "Open main menu" : "Select game"}
                onMouseDown={(e) => {
                  if (document.activeElement === e.currentTarget) {
                    e.currentTarget.blur();
                    e.preventDefault();
                  }
                }}
              >
                {isAdminContext ? <FiGrid className="h-5 w-5" /> : <Gamepad2 className="h-5 w-5" />}
                <FiChevronDown className="h-4 w-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] bg-ink-800/95 backdrop-blur-xl border border-white/10 rounded-2xl w-56 mt-4">
                {isAdminContext ? (
                  <>{adminMenuItems}</>
                ) : (
                  <>
                    <li><Link href="/about" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200">About us</Link></li>
                    <li><Link href="/cashback" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200">Cashback</Link></li>
                    <li><Link href="/blog" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200">Blog</Link></li>
                  </>
                )}
              </ul>
            </div>}
            {/* Mobile Search Button - COMPLETELY REMOVED */}
            {/* 
            <span
              aria-label="Search"
              role="button"
              tabIndex={0}
              className="relative z-[60] hidden inline-flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white focus:outline-none ring-0 outline-none rounded-none bg-transparent hover:bg-transparent active:bg-transparent select-none cursor-pointer"
              onClick={() => { ... }}
            >
              <FiSearch className="h-5 w-5" />
            </span>
            */}

            {/* Mobile Search Overlay - REMOVED */}
            {/* 
            <form ... className="md:hidden ..."> ... </form> 
            */}

            {!isBooster && <div className="dropdown dropdown-end">
              <button
                type="button"
                className="btn btn-ghost h-10 min-h-[2.5rem] px-3 gap-2 text-gray-300 hover:text-white border border-white/10 hover:border-brand-500/40 bg-white/[0.03] hover:bg-brand-500/10 rounded-xl"
                aria-haspopup="menu"
                aria-label="Change currency"
                onMouseDown={(e) => {
                  if (document.activeElement === e.currentTarget) {
                    e.currentTarget.blur();
                    e.preventDefault();
                  }
                }}
              >
                <span className="text-sm font-sans flex items-center gap-1" suppressHydrationWarning>
                  {currency === "$" ? "USD" : "EUR"} <span className="text-md">{currency}</span>
                </span>
                <FiChevronDown className="h-4 w-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] bg-ink-800/95 backdrop-blur-xl border border-white/10 rounded-2xl w-24 mt-4">
                <li><button onClick={() => { setCurrency("$"); closeDropdown(); }} className="hover:bg-white/10 rounded-xl text-gray-200">$ US</button></li>
                <li><button onClick={() => { setCurrency("€"); closeDropdown(); }} className="hover:bg-white/10 rounded-xl text-gray-200">€ EU</button></li>
              </ul>
            </div>}

            {user ? (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  className="btn btn-ghost btn-circle h-10 w-10 min-h-[2.5rem] text-gray-300 hover:text-white border border-white/10 hover:border-brand-500/40 bg-white/[0.03] hover:bg-brand-500/10 rounded-xl flex items-center justify-center p-0"
                  aria-haspopup="menu"
                  aria-label="Account menu"
                  onMouseDown={(e) => {
                    if (document.activeElement === e.currentTarget) {
                      e.currentTarget.blur();
                      e.preventDefault();
                    }
                  }}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold uppercase text-white">
                    {(user.username ?? user.name ?? user.email ?? "U").slice(0, 1)}
                  </span>
                </button>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] bg-ink-800/95 backdrop-blur-xl border border-white/10 rounded-2xl w-56 mt-4">
                  <li className="menu-title px-4 py-2 text-xs text-gray-500">{user.email ?? user.name ?? "Account"}</li>
                  {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                    <li><Link href="/admin" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiGrid className="h-4 w-4 text-brand-400" /> Admin Panel</Link></li>
                  )}
                  {user.role === "MEMBER" && (
                    <li><Link href="/dashboard" onClick={closeDropdown} className="w-full hover:bg-white/10 rounded-xl text-gray-200"><FiGrid className="h-4 w-4 text-brand-400" /> Dashboard</Link></li>
                  )}
                  {user.role === "BOOSTER" && (
                    <li><Link href="/booster" onClick={closeDropdown} className="w-full hover:bg-white/10 rounded-xl text-gray-200"><FiGrid className="h-4 w-4 text-brand-400" /> Booster Panel</Link></li>
                  )}
                  {user.role === "MEMBER" && (
                    <li><Link href="/dashboard/orders" onClick={closeDropdown} className="w-full hover:bg-white/10 rounded-xl text-gray-200"><FiShoppingCart className="h-4 w-4 text-brand-400" /> My orders</Link></li>
                  )}
                  {user.role === "BOOSTER" && (
                    <li><Link href="/booster/orders" onClick={closeDropdown} className="w-full hover:bg-white/10 rounded-xl text-gray-200"><FiShoppingCart className="h-4 w-4 text-brand-400" /> Orders</Link></li>
                  )}
                  <li><button onClick={() => signOut({ callbackUrl: "/" })} className="w-full hover:bg-red-500/20 rounded-xl text-red-400"><FiLogOut className="h-4 w-4" /> Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/login" aria-label="Sign in" className="btn btn-gaming h-10 min-h-[2.5rem] rounded-xl px-3 sm:px-4 gap-2 text-sm">
                <FiUser className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}

            <div className="dropdown dropdown-end hidden md:block">
              <button
                type="button"
                className="btn btn-ghost btn-circle h-10 w-10 min-h-[2.5rem] text-gray-300 hover:text-white border border-white/10 hover:border-brand-500/40 bg-white/[0.03] hover:bg-brand-500/10 rounded-xl flex items-center justify-center p-0"
                aria-haspopup="menu"
                aria-label="Open quick menu"
                onMouseDown={(e) => {
                  if (document.activeElement === e.currentTarget) {
                    e.currentTarget.blur();
                    e.preventDefault();
                  }
                }}
              >
                <FiGrid className="h-5 w-5" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] bg-ink-800/95 backdrop-blur-xl border border-white/10 rounded-2xl w-56 mt-4">
                <li><Link href="/about" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiZap className="h-4 w-4 text-brand-400" /> About us</Link></li>
                <li><Link href="/cashback" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiPercent className="h-4 w-4 text-emerald-400" /> Cashback</Link></li>
                <li><Link href="/blog" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiBookOpen className="h-4 w-4 text-accent-400" /> Blog</Link></li>
                <li><Link href="/work-with-us" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiThumbsUp className="h-4 w-4 text-orange-400" /> Work with us</Link></li>
                <div className="divider my-1 border-white/10"></div>
                <li><Link href="/trust-safety" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiShield className="h-4 w-4 text-emerald-400" /> Trust & safety</Link></li>
                <li><Link href="/contact" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl text-gray-200"><FiMail className="h-4 w-4 text-brand-400" /> Contact us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
