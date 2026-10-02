import Image from "next/image";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { FaTelegramPlane, FaYoutube, FaDiscord, FaFacebookF } from "react-icons/fa";
import { getFooterSettings } from "@/lib/settings";
import { getSiteMeta } from "@/lib/seo";
import { db } from "@/lib/prisma";

export async function Footer() {
    const [s, ws, footerGames] = await Promise.all([
        getFooterSettings(),
        getSiteMeta(),
        db.game
            .findMany({
                where: { isActive: true },
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                take: 40,
                select: {
                    slug: true,
                    name: true,
                    services: { where: { isActive: true }, orderBy: [{ isHotOffer: "desc" }, { name: "asc" }], take: 5, select: { slug: true, name: true } },
                },
            })
            .catch(() => []),
    ]);
    // Biggest games get their own column of services; the rest are listed together.
    const featuredGames = footerGames.filter((g) => g.services.length > 0).slice(0, 2);
    const otherGames = footerGames.filter((g) => !featuredGames.includes(g));
    const active = s?.isActive ?? true;
    const disclaimer = (s?.disclaimer ?? "").trim();
    const shortDesc = (s?.shortDescription ?? "").trim();
    const copyright = (s?.copyright ?? "").trim();
    const address = (s?.legalAddress ?? "").trim();
    const reg = (s?.regNumber ?? "").trim();
    const smTelegram = (s?.smTelegramUrl ?? "").trim();
    const smYoutube = (s?.smYoutubeUrl ?? "").trim();
    const smDiscord = (s?.smDiscordUrl ?? "").trim();
    const smFacebook = (s?.smFacebookUrl ?? "").trim();
    const mc = (s?.badgeMastercardUrl ?? "").trim();
    const visa = (s?.badgeVisaUrl ?? "").trim();
    const pci = (s?.badgePciUrl ?? "").trim();
    const pmVisa = (s?.pmVisaUrl ?? "").trim();
    const pmMc = (s?.pmMastercardUrl ?? "").trim();
    const pmGpay = (s?.pmGpayUrl ?? "").trim();
    const pmApplePay = (s?.pmApplePayUrl ?? "").trim();
    const pmPaypal = (s?.pmPaypalUrl ?? "").trim();
    const pmStripe = (s?.pmStripeUrl ?? "").trim();
    const logo = ws.logoUrl;
    const siteName = ws.siteName;

    const navs: Array<{ title: string; url: string }> = [
        { title: s?.navHomeTitle?.trim() || "Home", url: s?.navHomeUrl?.trim() || "/" },
        { title: s?.navAboutTitle?.trim() || "About Us", url: s?.navAboutUrl?.trim() || "/about" },
        { title: s?.navFaqTitle?.trim() || "Blog", url: s?.navFaqUrl?.trim() || "/blog" },
        { title: s?.navBoosterTitle?.trim() || "Become a Booster", url: s?.navBoosterUrl?.trim() || "/work-with-us" },
    ];
    const legals: Array<{ title: string; url: string }> = [
        { title: s?.legal1Title?.trim() || "Terms and Conditions", url: s?.legal1Url?.trim() || "/terms" },
        { title: s?.legal2Title?.trim() || "Privacy Policy", url: s?.legal2Url?.trim() || "/privacy" },
        { title: s?.legal3Title?.trim() || "Refund Policy", url: s?.legal3Url?.trim() || "/refund" },
        { title: s?.legal4Title?.trim() || "Cookie Policy", url: s?.legal4Url?.trim() || "/cookies" },
    ];

    if (!active) return null;

    return (
        <footer className="bg-ink-950 text-gray-300 relative overflow-hidden border-t border-white/[0.06]">
            {/* Gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

            {/* Subtle glow orbs */}
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-brand-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto z-10 relative px-4 sm:px-6 pt-12 pb-10">
                {/* Support strip */}
                <div className="mb-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-900/50 via-ink-800 to-ink-800 p-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-200 ring-1 ring-brand-400/30">
                            <FiMessageCircle className="h-5 w-5" />
                        </span>
                        <div>
                            <div className="font-display text-lg font-bold text-white">Questions before you order?</div>
                            <div className="text-sm text-gray-400">Our support team is online 24/7 and usually replies within minutes.</div>
                        </div>
                    </div>
                    <Link href="/contact" className="btn btn-gaming h-11 rounded-xl px-6">Contact support</Link>
                </div>
                <div className="footer flex flex-col md:flex-row gap-10">
                    <aside className="w-full md:w-[40%]">
                        {logo ? (
                            <Image src={logo} alt={siteName} width={150} height={50} className="h-10 w-auto mb-0" style={{ height: 40, width: "auto", maxWidth: 220 }} unoptimized />
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/brand/arcaneboost-icon.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
                                <span className="font-display text-2xl font-extrabold tracking-tight text-white">{siteName}</span>
                            </span>
                        )}
                        <p className="text-gray-400 mt-4 leading-relaxed max-w-sm text-sm">
                            {shortDesc || "Your ultimate gaming paradise. Discover the best games and gaming experiences with professional boosting services."}
                        </p>
                        <div className="flex gap-3 mt-6">
                            {smTelegram && (
                                <a href={smTelegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 hover:text-accent-400 hover:bg-white/10 transition-all">
                                    <FaTelegramPlane size={18} />
                                </a>
                            )}
                            {smYoutube && (
                                <a href={smYoutube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 hover:text-red-500 hover:bg-white/10 transition-all">
                                    <FaYoutube size={18} />
                                </a>
                            )}
                            {smDiscord && (
                                <a href={smDiscord} target="_blank" rel="noopener noreferrer" aria-label="Discord" className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 hover:text-brand-400 hover:bg-white/10 transition-all">
                                    <FaDiscord size={18} />
                                </a>
                            )}
                            {smFacebook && (
                                <a href={smFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 hover:text-brand-500 hover:bg-white/10 transition-all">
                                    <FaFacebookF size={18} />
                                </a>
                            )}
                        </div>
                    </aside>

                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-10">
                        <nav className="flex flex-col gap-2 min-w-[150px]">
                            <div className="font-display font-semibold text-white text-sm uppercase tracking-[0.14em] mb-2">{siteName}</div>
                            {navs.map((n, i) => (
                                <Link key={i} href={n.url} className="text-gray-400 hover:text-white transition-colors text-sm">
                                    {n.title}
                                </Link>
                            ))}
                        </nav>
                        <nav className="flex flex-col gap-2 min-w-[150px]">
                            <h6 className="font-display font-semibold text-white text-sm uppercase tracking-[0.14em] mb-2">Legal</h6>
                            {legals.map((l, i) => (
                                <Link key={i} href={l.url} className="text-gray-400 hover:text-white transition-colors text-sm">
                                    {l.title}
                                </Link>
                            ))}
                        </nav>
                        <nav className="flex flex-col gap-2 min-w-[200px]">
                            <h6 className="font-display font-semibold text-white text-sm uppercase tracking-[0.14em] mb-2">We Accept</h6>
                            <div className="grid grid-cols-3 gap-3">
                                {pmPaypal ? <div className="bg-white/[0.04] ring-1 ring-white/10 rounded-lg h-10 px-2 overflow-hidden text-[10px] text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center"><Image src={pmPaypal} alt="PayPal" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmMc ? <div className="bg-white/[0.04] ring-1 ring-white/10 rounded-lg h-10 px-2 overflow-hidden text-[10px] text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center"><Image src={pmMc} alt="Mastercard" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmVisa ? <div className="bg-white/[0.04] ring-1 ring-white/10 rounded-lg h-10 px-2 overflow-hidden text-[10px] text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center"><Image src={pmVisa} alt="Visa" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmApplePay ? <div className="bg-white/[0.04] ring-1 ring-white/10 rounded-lg h-10 px-2 overflow-hidden text-[10px] text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center"><Image src={pmApplePay} alt="Apple Pay" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmGpay ? <div className="bg-white/[0.04] ring-1 ring-white/10 rounded-lg h-10 px-2 overflow-hidden text-[10px] text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center"><Image src={pmGpay} alt="Google Pay" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmStripe ? <div className="bg-white/[0.04] ring-1 ring-white/10 rounded-lg h-10 px-2 overflow-hidden text-[10px] text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center"><Image src={pmStripe} alt="Stripe" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Games and services */}
            {footerGames.length > 0 && (
                <div className="max-w-7xl mx-auto z-10 relative px-4 sm:px-6 pb-10">
                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-10 md:grid-cols-4">
                        {featuredGames.map((g) => (
                            <nav key={g.slug} aria-label={g.name} className="flex flex-col gap-2">
                                <Link href={`/${g.slug}`} className="font-display font-semibold text-white text-sm uppercase tracking-[0.14em] mb-2 hover:text-brand-200">{g.name}</Link>
                                {g.services.map((sv) => (
                                    <Link key={sv.slug} href={`/${g.slug}/${sv.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {sv.name}
                                    </Link>
                                ))}
                            </nav>
                        ))}
                        {otherGames.length > 0 && (
                            <nav aria-label="More games" className={featuredGames.length < 2 ? "col-span-2 md:col-span-3" : "col-span-2"}>
                                <div className="font-display font-semibold text-white text-sm uppercase tracking-[0.14em] mb-3">More games</div>
                                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                                    {otherGames.map((g) => (
                                        <li key={g.slug}>
                                            <Link href={`/${g.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm">{g.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Bar */}
            <div className="border-t border-white/5 px-4 sm:px-6 py-6 max-w-7xl mx-auto z-10 relative text-sm">
                <aside className="items-center grid-flow-col w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                        <div>
                            <p className="text-gray-400">
                                {copyright || <>© {siteName} {new Date().getFullYear()}. All rights reserved.</>}
                            </p>
                            {(address || reg) && (
                                <p className="mt-1 text-gray-500 text-xs max-w-md">
                                    {address} {reg && <span className="mx-1">•</span>} {reg && `Reg: ${reg}`}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4 opacity-60 hover:opacity-100 transition-all duration-300">
                            {mc ? <Image src={mc} alt="Mastercard SecureCode" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
                            {visa ? <Image src={visa} alt="Verified by Visa" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
                            {pci ? <Image src={pci} alt="PCI DSS" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Trademark note: shown unless an admin wrote their own disclaimer */}
            {!disclaimer && (
                <div className="border-t border-white/5 px-4 sm:px-6 py-4 max-w-7xl mx-auto relative z-10">
                    <p className="text-xs leading-relaxed text-gray-600">
                        {siteName} is an independent service and is not affiliated with, endorsed or sponsored by any game publisher or developer.
                        Game names, logos and artwork are trademarks of their respective owners and are used here only to describe the games we support.
                    </p>
                </div>
            )}

            {/* Disclaimer */}
            {disclaimer && (
                <div className="border-t border-white/5 px-10 py-4 text-center max-w-7xl mx-auto relative z-10">
                    <p className="text-xs text-gray-600">{disclaimer}</p>
                </div>
            )}
        </footer>
    );
}
