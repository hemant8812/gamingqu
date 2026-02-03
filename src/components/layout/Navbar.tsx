"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiUser, FiChevronDown, FiZap, FiPercent, FiBookOpen, FiThumbsUp, FiShield, FiMail, FiShoppingCart, FiLogOut, FiGrid, FiUsers, FiBarChart2, FiPlay, FiSettings, FiImage, FiTag, FiTool, FiClock } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

function GridRoundedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

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
};

export function Navbar({ siteName = "Gamingqu", logoUrl = null, user = null }: Props) {
  const [currency, setCurrency] = useState<"$" | "€">("$");
  const [showLogo, setShowLogo] = useState<boolean>(!!logoUrl);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRole = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isAdminContext = isAdminRole || (pathname?.startsWith("/admin") || pathname?.startsWith("/super-admin"));
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ id: number; name: string; slug: string; gameSlug: string }>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [popularProducts, setPopularProducts] = useState<Array<{ id: number; name: string; slug: string; gameSlug: string; imageUrl?: string | null; price?: number }>>([]);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(false);

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem instanceof HTMLElement) {
      elem.blur();
    }
  };

  useEffect(() => {
    if (!searchOpen) {
      setSearchSuggestions([]);
      return;
    }
    if (popularProducts.length === 0) {
      let canceled = false;
      setLoadingPopular(true);
      fetch("/api/services/hot")
        .then((r) => r.json())
        .then((data) => {
          if (canceled) return;
          const list = Array.isArray(data?.services)
            ? data.services.map((s: any) => ({
                id: Number(s.id),
                name: String(s.name ?? ""),
                slug: String(s.slug ?? ""),
                gameSlug: String(s.game?.slug ?? ""),
                imageUrl: s.imageUrl ?? null,
                price: typeof s.price === "string" ? parseFloat(s.price) : Number(s.price),
              }))
            : [];
          setPopularProducts(list);
          if (searchQuery.trim().length === 0) {
            setSearchSuggestions(list.map(({ id, name, slug, gameSlug }) => ({ id, name, slug, gameSlug })));
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!canceled) setLoadingPopular(false);
        });
      return () => {
        canceled = true;
      };
    } else {
      if (searchQuery.trim().length === 0) {
        setSearchSuggestions(popularProducts.map(({ id, name, slug, gameSlug }) => ({ id, name, slug, gameSlug })));
      }
    }
  }, [searchOpen, popularProducts, searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    const q = searchQuery.trim();
    if (q.length === 0) {
      setSearchSuggestions(popularProducts.map(({ id, name, slug, gameSlug }) => ({ id, name, slug, gameSlug })));
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoadingSuggestions(true);
      fetch(`/api/services/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data?.services)
            ? data.services.map((s: any) => ({
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E17]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo & Menu */}
          <div className="flex items-center gap-4">
            {showLogo && logoUrl ? (
              <Link href="/" className="text-xl p-0 inline-flex items-center">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                  onError={() => setShowLogo(false)}
                  priority
                />
              </Link>
            ) : (
              <Link href="/" className="text-xl p-0 font-bold inline-flex items-center gradient-text">
                {siteName}
              </Link>
            )}

            <div className="dropdown">
              <button type="button" className="btn btn-ghost btn-sm gap-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl" aria-haspopup="menu" aria-label={isAdminContext ? "Open main menu" : "Select game"}>
                {isAdminContext ? <FiGrid className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
                <span className="font-bold">{isAdminContext ? "Main Menu" : "Select Game"}</span>
                <FiChevronDown className="h-4 w-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-56 mt-4">
                {isAdminContext ? (
                  <>
                    <li><Link href="/admin" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiGrid className="h-4 w-4 text-blue-400" /> Dashboard</Link></li>
                    <li><Link href="/admin/users" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiUsers className="h-4 w-4 text-blue-400" /> Users</Link></li>
                    <li><Link href="/admin/boosters" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiZap className="h-4 w-4 text-blue-400" /> Boosters</Link></li>
                    <li><Link href="/admin/orders" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiShoppingCart className="h-4 w-4 text-blue-400" /> Orders</Link></li>
                    <li><Link href="/admin/analytics" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiBarChart2 className="h-4 w-4 text-blue-400" /> Analytics</Link></li>
                    <li><Link href="/admin/games" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiPlay className="h-4 w-4 text-blue-400" /> Games</Link></li>
                    <li><Link href="/admin/categories" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiTag className="h-4 w-4 text-blue-400" /> Categories</Link></li>
                    <li><Link href="/admin/services" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiTool className="h-4 w-4 text-blue-400" /> Services</Link></li>
                    <li><Link href="/admin/service-data" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiBarChart2 className="h-4 w-4 text-blue-400" /> Data Service</Link></li>
                    <li><Link href="/admin/blog" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiBookOpen className="h-4 w-4 text-blue-400" /> Blog</Link></li>
                    <li><Link href="/admin/benner" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiImage className="h-4 w-4 text-blue-400" /> Banner</Link></li>
                    {user?.role === "SUPERADMIN" && (
                      <li><Link href="/admin/permissions" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiShield className="h-4 w-4 text-blue-400" /> Permissions</Link></li>
                    )}
                    <li><Link href="/admin/settings" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiSettings className="h-4 w-4 text-blue-400" /> Settings</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/games/cod" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl">Call of Duty</Link></li>
                    <li><Link href="/games/valorant" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl">Valorant</Link></li>
                    <li><Link href="/games/genshin" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl">Genshin Impact</Link></li>
                    <li><Link href="/games/tarkov" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl">Escape from Tarkov</Link></li>
                  </>
                )}
              </ul>
            </div>

            {!isAdminContext && (
              <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 font-semibold ml-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                1,254 Online
              </div>
            )}
          </div>

          {/* Right Side: Icons */}
          <div className="flex items-center gap-1">
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
              className={`overflow-visible transition-all duration-300 relative z-40 ${searchOpen ? "w-80 md:w-96 mr-2" : "w-0 mr-0"}`}
            >
              {searchOpen && (
                <>
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    placeholder="Search..."
                    className="w-full h-9 px-3 bg-[#0A0E17] border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0"
                    aria-label="Search input"
                  />
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl z-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                    <div>
                      <div className="px-2 pb-2 text-sm font-semibold text-white">Frequently searched</div>
                      {loadingSuggestions ? (
                        <div className="px-3 py-2 text-gray-400">Loading...</div>
                      ) : searchSuggestions.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto">
                          {searchSuggestions.map((s) => (
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
                      {loadingPopular && popularProducts.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400">Loading...</div>
                      ) : popularProducts.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto flex flex-col gap-3 pr-1">
                          {popularProducts.map((p) => (
                            <Link
                              key={`${p.id}-${p.slug}`}
                              href={`/${p.gameSlug}/${p.slug}`}
                              className="rounded-xl border border-white/10 bg-[#0A0E17] hover:border-white/20 overflow-hidden"
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
                                <div className="absolute top-2 right-2 text-xs font-semibold bg-pink-600 text-white px-2 py-1 rounded-md">
                                  From {currency}{formatPrice(p.price ?? 0).formatted}
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
                </>
              )}
            </form>
            <span
              aria-label="Search"
              role="button"
              tabIndex={0}
              className="relative z-[60] inline-flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white focus:outline-none ring-0 outline-none rounded-none bg-transparent hover:bg-transparent active:bg-transparent select-none"
              style={{
                // Reset semua style bawaan agar tidak ada bentuk/lingkaran
                // @ts-expect-error - properti CSS 'all' tidak ter-definisi di tipe React
                all: "unset",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.5rem",
                height: "2.5rem",
                background: "transparent",
                border: "none",
                outline: "none",
                boxShadow: "none",
                borderRadius: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                setSearchOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  } else {
                    searchInputRef.current?.blur();
                  }
                  return next;
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSearchOpen((prev) => {
                    const next = !prev;
                    if (next) {
                      setTimeout(() => searchInputRef.current?.focus(), 0);
                    } else {
                      searchInputRef.current?.blur();
                    }
                    return next;
                  });
                }
              }}
            >
              <FiSearch className="h-5 w-5" />
            </span>

            <div className="dropdown dropdown-end">
              <button type="button" className="btn btn-ghost gap-1 px-2 text-gray-400 hover:text-white hover:bg-white/10" aria-haspopup="menu" aria-label="Change currency">
                <span className="text-lg font-sans">{currency}</span>
                <FiChevronDown className="h-4 w-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-24 mt-4">
                <li><button onClick={() => setCurrency("$")} className="hover:bg-white/10 rounded-xl">$ US</button></li>
                <li><button onClick={() => setCurrency("€")} className="hover:bg-white/10 rounded-xl">€ EU</button></li>
              </ul>
            </div>

            {user ? (
              <div className="dropdown dropdown-end">
                <button type="button" className="btn btn-ghost btn-circle text-gray-400 hover:text-white hover:bg-white/10" aria-haspopup="menu" aria-label="Account menu">
                  <div className="w-10 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5" />
                  </div>
                </button>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-56 mt-4">
                  <li className="menu-title px-4 py-2 text-xs text-gray-500">{user.email ?? user.name ?? "Account"}</li>
                  {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                    <li><Link href="/admin" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiGrid className="h-4 w-4 text-blue-400" /> Admin Panel</Link></li>
                  )}
                  {user.role === "MEMBER" && (
                    <li><Link href="/dashboard" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiGrid className="h-4 w-4 text-blue-400" /> Dashboard</Link></li>
                  )}
                  <li><Link href="/dashboard/orders" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiShoppingCart className="h-4 w-4 text-cyan-400" /> My orders</Link></li>
                  <li><button onClick={() => signOut({ callbackUrl: "/" })} className="hover:bg-white/10 rounded-xl text-red-400"><FiLogOut className="h-4 w-4" /> Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/login" aria-label="Login" className="btn btn-ghost btn-circle text-gray-400 hover:text-white hover:bg-white/10">
                <FiUser className="h-5 w-5" />
              </Link>
            )}

            <div className="dropdown dropdown-end">
              <button type="button" className="btn btn-ghost btn-circle text-gray-400 hover:text-white hover:bg-white/10" aria-haspopup="menu" aria-label="Open quick menu">
                <GridRoundedIcon className="h-5 w-5" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-56 mt-4">
                <li><Link href="/about" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiZap className="h-4 w-4 text-blue-400" /> About us</Link></li>
                <li><Link href="/cashback" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiPercent className="h-4 w-4 text-emerald-400" /> Cashback</Link></li>
                <li><Link href="/blog" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiBookOpen className="h-4 w-4 text-cyan-400" /> Blog</Link></li>
                <li><Link href="/work-with-us" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiThumbsUp className="h-4 w-4 text-orange-400" /> Work with us</Link></li>
                <div className="divider my-1 border-white/10"></div>
                <li><Link href="/trust-safety" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiShield className="h-4 w-4 text-emerald-400" /> Trust & safety</Link></li>
                <li><Link href="/contact" onClick={closeDropdown} className="hover:bg-white/10 rounded-xl"><FiMail className="h-4 w-4 text-blue-400" /> Contact us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

