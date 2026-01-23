"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiSearch, FiHeart, FiUser, FiChevronDown, FiChevronUp, FiZap, FiPercent, FiBookOpen, FiThumbsUp, FiShield, FiMail, FiShoppingCart, FiLogOut, FiGrid, FiUsers, FiBarChart2, FiPlay, FiSettings, FiImage } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

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
  const [currency, setCurrency] = useState<"$" | "€">("€");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [showLogo, setShowLogo] = useState<boolean>(!!logoUrl);
  const pathname = usePathname();
  const isAdminRole = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isAdminContext = isAdminRole || (pathname?.startsWith("/admin") || pathname?.startsWith("/super-admin"));
  const iconBtn =
    "size-10 rounded-md inline-flex items-center justify-center text-white hover:bg-zinc-900 transition-colors border-0 ring-0 outline-none focus:outline-none focus:ring-0 focus:border-0";
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showLogo && logoUrl ? (
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logoUrl}
                alt={siteName}
                width={256}
                height={64}
                quality={100}
                sizes="120px"
                className="h-8 w-auto object-contain"
                style={{ imageRendering: "crisp-edges" }}
                onError={() => setShowLogo(false)}
                priority
              />
            </Link>
          ) : (
            <Link href="/" className="font-black tracking-tight text-white text-2xl">
              {siteName}
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="inline-flex items-center gap-2 text-white text-sm font-semibold cursor-pointer select-none">
                {isAdminContext && <FiGrid className="h-4 w-4 text-white" />}
                {isAdminContext ? "Main Menu" : "Choose your game"}
                <FiChevronDown className="ml-2 h-4 w-4" />
              </span>
            </DropdownMenuTrigger>
            {isAdminContext ? (
              <DropdownMenuContent side="bottom" align="start" sideOffset={18} className="relative rounded-md bg-blue-600 text-white border-0 p-2 shadow-xl min-w-[14rem]">
                <div className="absolute -top-2 left-0 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-blue-600" />
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin" className="flex items-center gap-2 font-semibold"><FiGrid className="h-4 w-4 text-white group-hover:text-black" /> Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/users" className="flex items-center gap-2 font-semibold"><FiUsers className="h-4 w-4 text-white group-hover:text-black" /> Users</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/boosters" className="flex items-center gap-2 font-semibold"><FiZap className="h-4 w-4 text-white group-hover:text-black" /> Boosters</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/orders" className="flex items-center gap-2 font-semibold"><FiShoppingCart className="h-4 w-4 text-white group-hover:text-black" /> Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/analytics" className="flex items-center gap-2 font-semibold"><FiBarChart2 className="h-4 w-4 text-white group-hover:text-black" /> Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/games" className="flex items-center gap-2 font-semibold"><FiPlay className="h-4 w-4 text-white group-hover:text-black" /> Games</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/benner" className="flex items-center gap-2 font-semibold"><FiImage className="h-4 w-4 text-white group-hover:text-black" /> Benner</Link>
                </DropdownMenuItem>
                {(user?.role === "SUPERADMIN") && (
                  <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                    <Link href="/admin/permissions" className="flex items-center gap-2 font-semibold"><FiShield className="h-4 w-4 text-white group-hover:text-black" /> Permissions</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="group rounded-sm px-3 py-2 hover:bg-blue-500/30 focus:bg-blue-500/30 text-white">
                  <Link href="/admin/settings" className="flex items-center gap-2 font-semibold"><FiSettings className="h-4 w-4 text-white group-hover:text-black" /> Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent className="bg-zinc-950 border-zinc-900 text-white">
                <DropdownMenuItem asChild>
                  <Link href="/games/cod">Call of Duty</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games/valorant">Valorant</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games/genshin">Genshin Impact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games/tarkov">Escape from Tarkov</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
          {!isAdminContext && (
            <div className="hidden md:flex items-center gap-2 text-xs text-white">
              <span className="inline-flex items-center gap-1">
                <span className="relative inline-flex">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
                </span>
                1,254 Online
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <Link href="/search" className={iconBtn}><FiSearch className="h-5 w-5" /></Link>
          <Link href="/wishlist" className={iconBtn}><FiHeart className="h-5 w-5" /></Link>
          <DropdownMenu open={currencyOpen} onOpenChange={setCurrencyOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`${iconBtn} size-10 w-20 data-[state=open]:bg-zinc-900`}
              >
                <span className="font-medium text-xl">{currency}</span>
                {currencyOpen ? (
                  <FiChevronUp className="ml-2 h-5 w-5" />
                ) : (
                  <FiChevronDown className="ml-2 h-5 w-5" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="relative bg-zinc-900 text-white border-0 p-2 rounded-md shadow-xl w-20"
            >
              <div className="absolute -top-2 right-2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-zinc-900" />
              <DropdownMenuItem className="rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white hover:text-white focus:text-white">
                <button
                  className="w-full flex items-center gap-3 text-left"
                  onClick={() => {
                    setCurrency("$");
                  }}
                >
                  <span className="text-white">$</span>
                  <span className="font-semibold">US</span>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white hover:text-white focus:text-white">
                <button
                  className="w-full flex items-center gap-3 text-left"
                  onClick={() => {
                    setCurrency("€");
                  }}
                >
                  <span className="text-white">€</span>
                  <span className="font-semibold">EU</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={iconBtn}>
                  <FiUser className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="relative rounded-md bg-blue-600 text-white border-0 p-2 shadow-xl w-56"
              >
                <div className="absolute -top-2 right-2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-blue-600" />
                <div className="px-3 py-2 text-sm font-semibold">
                  {user.email ?? user.name ?? "Account"}
                </div>
                <div className="my-1 h-px w-full bg-white/20" />
                {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                  <DropdownMenuItem asChild className="rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white hover:text-white focus:text-white">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
                      <FiGrid className="h-4 w-4 text-white" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white hover:text-white focus:text-white">
                  <Link href="/orders" className="flex items-center gap-2 font-semibold text-white">
                    <FiShoppingCart className="h-4 w-4 text-white" /> My orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white hover:text-white focus:text-white">
                  <button
                    className="w-full flex items-center gap-2 font-semibold text-left"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <FiLogOut className="h-4 w-4 text-white" /> Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className={iconBtn}><FiUser className="h-5 w-5" /></Link>
          )}
          <DropdownMenu open={gridOpen} onOpenChange={setGridOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`${iconBtn} data-[state=open]:bg-zinc-900`}
              >
                <GridRoundedIcon className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="relative rounded-md bg-blue-600 text-white border-0 p-2 shadow-xl w-56"
            >
              <div className="absolute -top-2 right-2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-blue-600" />
                <DropdownMenuItem asChild className="group rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white">
                  <Link href="/about" className="flex items-center gap-2 font-semibold text-white group-hover:text-black">
                    <FiZap className="h-4 w-4 text-white group-hover:text-black" /> About us
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white">
                  <Link href="/cashback" className="flex items-center gap-2 font-semibold text-white group-hover:text-black">
                    <FiPercent className="h-4 w-4 text-white group-hover:text-black" /> Cashback
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white">
                  <Link href="/blog" className="flex items-center gap-2 font-semibold text-white group-hover:text-black">
                    <FiBookOpen className="h-4 w-4 text-white group-hover:text-black" /> Blog
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white">
                  <Link href="/work-with-us" className="flex items-center gap-2 font-semibold text-white group-hover:text-black">
                    <FiThumbsUp className="h-4 w-4 text-white group-hover:text-black" /> Work with us
                </Link>
              </DropdownMenuItem>
              <div className="my-1 h-px w-full bg-white/20" />
                <DropdownMenuItem asChild className="group rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white">
                  <Link href="/trust-safety" className="flex items-center gap-2 font-semibold text-white group-hover:text-black">
                    <FiShield className="h-4 w-4 text-white group-hover:text-black" /> Trust & safety
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem asChild className="group rounded-md px-3 py-2 hover:bg-zinc-500/20 focus:bg-zinc-500/20 text-white">
                  <Link href="/contact" className="flex items-center gap-2 font-semibold text-white group-hover:text-black">
                    <FiMail className="h-4 w-4 text-white group-hover:text-black" /> Contact us
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

