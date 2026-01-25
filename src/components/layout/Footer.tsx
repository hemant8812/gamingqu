import Image from "next/image";
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
    <footer className="bg-neutral text-neutral-content mt-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>
      <div className="max-w-7xl mx-auto z-10 relative p-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <aside className="col-span-1">
                {ws?.logoUrl ? (
                <Image src={ws.logoUrl} alt={ws?.siteName ?? "Gamingqu"} width={160} height={40} className="h-10 w-auto mb-2" unoptimized />
                ) : (
                    <span className="text-3xl font-black tracking-tighter mb-2 block">{ws?.siteName ?? "Gamingqu"}</span>
                )}
                <p className="opacity-80 leading-relaxed text-sm">
                {shortDesc || "Your ultimate gaming paradise. Discover the best games and gaming experiences with professional boosting services."}
                </p>
                <div className="flex gap-4 mt-6">
                {smTelegram && <a href={smTelegram} aria-label="Telegram" className="btn btn-circle btn-sm btn-ghost hover:bg-white/10 hover:text-white transition-colors"><FaTelegramPlane size={18} /></a>}
                {smYoutube && <a href={smYoutube} aria-label="YouTube" className="btn btn-circle btn-sm btn-ghost hover:bg-white/10 hover:text-white transition-colors"><FaYoutube size={18} /></a>}
                {smDiscord && <a href={smDiscord} aria-label="Discord" className="btn btn-circle btn-sm btn-ghost hover:bg-white/10 hover:text-white transition-colors"><FaDiscord size={18} /></a>}
                {smFacebook && <a href={smFacebook} aria-label="Facebook" className="btn btn-circle btn-sm btn-ghost hover:bg-white/10 hover:text-white transition-colors"><FaFacebookF size={18} /></a>}
                </div>
            </aside>
            <nav className="col-span-1 flex flex-col gap-2">
                <h6 className="footer-title text-white opacity-100 mb-2">Gamingqu</h6>
                {navs.map((n, i) => (
                    <a key={i} href={n.url || "#"} className="link link-hover opacity-70 hover:opacity-100 transition-opacity">{n.title || n.fallback}</a>
                ))}
            </nav>
            <nav className="col-span-1 flex flex-col gap-2">
                <h6 className="footer-title text-white opacity-100 mb-2">Legal</h6>
                {legals.map((l, i) => (
                    <a key={i} href={l.url || "#"} className="link link-hover opacity-70 hover:opacity-100 transition-opacity">{l.title || l.fallback}</a>
                ))}
            </nav>
            <nav className="col-span-1 flex flex-col gap-2">
                <h6 className="footer-title text-white opacity-100 mb-2">We Accept</h6>
                <div className="flex flex-wrap gap-3">
                {pmPaypal ? <div className="bg-white/5 rounded p-1"><Image src={pmPaypal} alt="PayPal" width={60} height={40} className="h-8 w-auto object-contain" unoptimized /></div> : null}
                {pmMc ? <div className="bg-white/5 rounded p-1"><Image src={pmMc} alt="Mastercard" width={60} height={40} className="h-8 w-auto object-contain" unoptimized /></div> : null}
                {pmVisa ? <div className="bg-white/5 rounded p-1"><Image src={pmVisa} alt="Visa" width={60} height={40} className="h-8 w-auto object-contain" unoptimized /></div> : null}
                {pmApplePay ? <div className="bg-white/5 rounded p-1"><Image src={pmApplePay} alt="Apple Pay" width={60} height={40} className="h-8 w-auto object-contain" unoptimized /></div> : null}
                {pmGpay ? <div className="bg-white/5 rounded p-1"><Image src={pmGpay} alt="Google Pay" width={60} height={40} className="h-8 w-auto object-contain" unoptimized /></div> : null}
                {pmStripe ? <div className="bg-white/5 rounded p-1"><Image src={pmStripe} alt="Stripe" width={60} height={40} className="h-8 w-auto object-contain" unoptimized /></div> : null}
                </div>
            </nav>
        </div>
      </div>
      
      <div className="footer px-10 py-6 border-t border-white/10 bg-neutral text-neutral-content max-w-7xl mx-auto z-10 relative text-sm">
        <aside className="items-center grid-flow-col w-full">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                <div>
                    <p className="opacity-90 font-medium">
                        {copyright || `© ${new Date().getFullYear()} Gamingqu. All rights reserved.`}
                    </p>
                    {(address || reg) && (
                        <p className="mt-1 opacity-60 text-xs max-w-md">
                            {address} {reg && <span className="mx-1">•</span>} {reg && `Reg: ${reg}`}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {mc ? <Image src={mc} alt="Mastercard SecureCode" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
                    {pci ? <Image src={pci} alt="PCI DSS" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
                    {visa ? <Image src={visa} alt="Verified by Visa" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
                </div>
            </div>
        </aside>
      </div>
      {disclaimer && (
        <div className="px-10 py-4 bg-neutral-900 text-neutral-content text-[10px] opacity-50 text-center relative z-10">
            <div className="max-w-7xl mx-auto">
                {disclaimer}
            </div>
        </div>
      )}
    </footer>
  );
}
