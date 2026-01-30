import Image from "next/image";
import Link from "next/link";
import { FaTelegramPlane, FaYoutube, FaDiscord, FaFacebookF } from "react-icons/fa";
import { getFooterSettings, getWebsiteSettingCore } from "@/lib/settings";

export async function Footer() {
    const s = await getFooterSettings();
    const ws = await getWebsiteSettingCore();
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
    const logo = ws?.logoUrl ?? null;
    const siteName = ws?.siteName || "Gamingqu";

    const navs: Array<{ title?: string | null; url?: string | null; fallback: string }> = [
        { title: s?.navHomeTitle, url: s?.navHomeUrl, fallback: "Home" },
        { title: s?.navAboutTitle, url: s?.navAboutUrl, fallback: "About Us" },
        { title: s?.navFaqTitle, url: s?.navFaqUrl, fallback: "FAQ" },
        { title: s?.navBoosterTitle, url: s?.navBoosterUrl, fallback: "Become a Booster" },
    ];
    const legals: Array<{ title?: string | null; url?: string | null; fallback: string }> = [
        { title: s?.legal1Title, url: s?.legal1Url, fallback: "Terms and Conditions" },
        { title: s?.legal2Title, url: s?.legal2Url, fallback: "Privacy Policy" },
        { title: s?.legal3Title, url: s?.legal3Url, fallback: "Refund Policy" },
        { title: s?.legal4Title, url: s?.legal4Url, fallback: "Cookie Policy" },
    ];

    if (!active) return null;

    return (
        <footer className="bg-[#0A0E17] text-gray-300 mt-12 relative overflow-hidden border-t border-white/5">
            {/* Gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

            {/* Subtle glow orbs */}
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto z-10 relative p-10">
                <div className="footer flex flex-col md:flex-row gap-10">
                    <aside className="w-full md:w-[40%]">
                        {logo ? (
                            <Image src={logo} alt={siteName} width={150} height={50} className="h-10 w-auto mb-4" />
                        ) : (
                            <span className="text-3xl font-black tracking-tighter mb-2 block gradient-text">{siteName}</span>
                        )}
                        <p className="text-gray-400 mt-0 leading-relaxed max-w-full text-sm">
                            {shortDesc || "Your ultimate gaming paradise. Discover the best games and gaming experiences with professional boosting services."}
                        </p>
                        <div className="flex gap-3 mt-6">
                            {smTelegram && (
                                <a href={smTelegram} aria-label="Telegram" className="w-10 h-10 flex items-center justify-center rounded-xl glass-light text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all">
                                    <FaTelegramPlane size={18} />
                                </a>
                            )}
                            {smYoutube && (
                                <a href={smYoutube} aria-label="YouTube" className="w-10 h-10 flex items-center justify-center rounded-xl glass-light text-gray-400 hover:text-red-500 hover:bg-white/10 transition-all">
                                    <FaYoutube size={18} />
                                </a>
                            )}
                            {smDiscord && (
                                <a href={smDiscord} aria-label="Discord" className="w-10 h-10 flex items-center justify-center rounded-xl glass-light text-gray-400 hover:text-indigo-400 hover:bg-white/10 transition-all">
                                    <FaDiscord size={18} />
                                </a>
                            )}
                            {smFacebook && (
                                <a href={smFacebook} aria-label="Facebook" className="w-10 h-10 flex items-center justify-center rounded-xl glass-light text-gray-400 hover:text-blue-500 hover:bg-white/10 transition-all">
                                    <FaFacebookF size={18} />
                                </a>
                            )}
                        </div>
                    </aside>

                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-10">
                        <nav className="flex flex-col gap-2 min-w-[150px]">
                            <h6 className="font-bold text-white text-sm uppercase tracking-wider mb-2">{siteName}</h6>
                            {navs.map((n, i) => (
                                <Link key={i} href={n.url || "#"} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    {n.title || n.fallback}
                                </Link>
                            ))}
                        </nav>
                        <nav className="flex flex-col gap-2 min-w-[150px]">
                            <h6 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Legal</h6>
                            {legals.map((l, i) => (
                                <Link key={i} href={l.url || "#"} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    {l.title || l.fallback}
                                </Link>
                            ))}
                        </nav>
                        <nav className="flex flex-col gap-2 min-w-[200px]">
                            <h6 className="font-bold text-white text-sm uppercase tracking-wider mb-2">We Accept</h6>
                            <div className="flex flex-wrap gap-3">
                                {pmPaypal ? <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"><Image src={pmPaypal} alt="PayPal" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmMc ? <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"><Image src={pmMc} alt="Mastercard" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmVisa ? <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"><Image src={pmVisa} alt="Visa" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmApplePay ? <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"><Image src={pmApplePay} alt="Apple Pay" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmGpay ? <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"><Image src={pmGpay} alt="Google Pay" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                                {pmStripe ? <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"><Image src={pmStripe} alt="Stripe" width={60} height={40} className="h-6 w-auto object-contain" unoptimized /></div> : null}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 px-10 py-6 max-w-7xl mx-auto z-10 relative text-sm">
                <aside className="items-center grid-flow-col w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                        <div>
                            <p className="text-white font-semibold">
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

            {/* Disclaimer */}
            {disclaimer && (
                <div className="border-t border-white/5 px-10 py-4 text-center max-w-7xl mx-auto relative z-10">
                    <p className="text-xs text-gray-600">{disclaimer}</p>
                </div>
            )}
        </footer>
    );
}
