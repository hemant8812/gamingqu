"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiHeart, FiUser, FiChevronDown, FiZap, FiPercent, FiBookOpen, FiThumbsUp, FiShield, FiMail, FiShoppingCart, FiLogOut, FiGrid, FiUsers, FiBarChart2, FiPlay, FiSettings, FiImage, FiTag, FiTool } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Gamepad2 } from "lucide-react";

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
  const isAdminRole = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isAdminContext = isAdminRole || (pathname?.startsWith("/admin") || pathname?.startsWith("/super-admin"));

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem instanceof HTMLElement) {
      elem.blur();
    }
  };

  return (
    <div className="bg-base-100 fixed top-0 left-0 right-0 z-50 shadow-md">
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
              <Link href="/" className="text-xl p-0 font-bold inline-flex items-center">
                {siteName}
              </Link>
            )}

            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                {isAdminContext ? <FiGrid className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
                <span className="font-bold">{isAdminContext ? "Main Menu" : "Select Game"}</span>
                <FiChevronDown className="h-4 w-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                {isAdminContext ? (
                  <>
                    <li><Link href="/admin" onClick={closeDropdown}><FiGrid className="h-4 w-4" /> Dashboard</Link></li>
                    <li><Link href="/admin/users" onClick={closeDropdown}><FiUsers className="h-4 w-4" /> Users</Link></li>
                    <li><Link href="/admin/boosters" onClick={closeDropdown}><FiZap className="h-4 w-4" /> Boosters</Link></li>
                    <li><Link href="/admin/orders" onClick={closeDropdown}><FiShoppingCart className="h-4 w-4" /> Orders</Link></li>
                    <li><Link href="/admin/analytics" onClick={closeDropdown}><FiBarChart2 className="h-4 w-4" /> Analytics</Link></li>
                    <li><Link href="/admin/games" onClick={closeDropdown}><FiPlay className="h-4 w-4" /> Games</Link></li>
                    <li><Link href="/admin/categories" onClick={closeDropdown}><FiTag className="h-4 w-4" /> Categories</Link></li>
                    <li><Link href="/admin/services" onClick={closeDropdown}><FiTool className="h-4 w-4" /> Services</Link></li>
                    <li><Link href="/admin/blog" onClick={closeDropdown}><FiBookOpen className="h-4 w-4" /> Blog</Link></li>
                    <li><Link href="/admin/benner" onClick={closeDropdown}><FiImage className="h-4 w-4" /> Banner</Link></li>
                    {user?.role === "SUPERADMIN" && (
                      <li><Link href="/admin/permissions" onClick={closeDropdown}><FiShield className="h-4 w-4" /> Permissions</Link></li>
                    )}
                    <li><Link href="/admin/settings" onClick={closeDropdown}><FiSettings className="h-4 w-4" /> Settings</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/games/cod" onClick={closeDropdown}>Call of Duty</Link></li>
                    <li><Link href="/games/valorant" onClick={closeDropdown}>Valorant</Link></li>
                    <li><Link href="/games/genshin" onClick={closeDropdown}>Genshin Impact</Link></li>
                    <li><Link href="/games/tarkov" onClick={closeDropdown}>Escape from Tarkov</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            {!isAdminContext && (
                <div className="hidden md:flex items-center gap-2 text-xs text-success font-semibold ml-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    1,254 Online
                </div>
            )}
          </div>

          {/* Right Side: Icons */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="btn btn-ghost btn-circle">
              <FiSearch className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" className="btn btn-ghost btn-circle">
              <FiHeart className="h-5 w-5" />
            </Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost gap-1 px-2">
                <span className="text-lg font-sans">{currency}</span>
                <FiChevronDown className="h-4 w-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-20 mt-4">
                <li><button onClick={() => setCurrency("$")}>$ US</button></li>
                <li><button onClick={() => setCurrency("€")}>€ EU</button></li>
              </ul>
            </div>

            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full flex items-center justify-center bg-transparent hover:bg-base-300 transition-colors">
                    <FiUser className="h-5 w-5" />
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                  <li className="menu-title px-4 py-2 text-xs opacity-50">{user.email ?? user.name ?? "Account"}</li>
                  {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                    <li><Link href="/admin"><FiGrid className="h-4 w-4" /> Dashboard</Link></li>
                  )}
                  <li><Link href="/orders"><FiShoppingCart className="h-4 w-4" /> My orders</Link></li>
                  <li><button onClick={() => signOut({ callbackUrl: "/" })}><FiLogOut className="h-4 w-4" /> Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/login" className="btn btn-ghost btn-circle">
                <FiUser className="h-5 w-5" />
              </Link>
            )}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <GridRoundedIcon className="h-5 w-5" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li><Link href="/about"><FiZap className="h-4 w-4" /> About us</Link></li>
                <li><Link href="/cashback"><FiPercent className="h-4 w-4" /> Cashback</Link></li>
                <li><Link href="/blog"><FiBookOpen className="h-4 w-4" /> Blog</Link></li>
                <li><Link href="/work-with-us"><FiThumbsUp className="h-4 w-4" /> Work with us</Link></li>
                <div className="divider my-0"></div>
                <li><Link href="/trust-safety"><FiShield className="h-4 w-4" /> Trust & safety</Link></li>
                <li><Link href="/contact"><FiMail className="h-4 w-4" /> Contact us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
