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
    <footer className="mt-8 bg-black text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 py-9">
        <div className="border-t border-zinc-900 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            {ws?.logoUrl ? (
              <Image src={ws.logoUrl} alt={ws?.siteName ?? "Gamingqu"} width={160} height={40} className="h-10 w-auto" unoptimized />
            ) : null}
            <p className="mt-3 text-sm text-zinc-300">
              {shortDesc || "Your ultimate gaming paradise. Discover the best games and gaming experiences with professional boosting services."}
            </p>
            <div className="mt-4 flex items-center gap-5 text-zinc-400">
              {smTelegram ? (
                <a href={smTelegram} aria-label="Telegram" className="hover:text-white transition-colors"><FaTelegramPlane size={22} className="transition-transform hover:scale-110" /></a>
              ) : (
                <span aria-hidden="true" className="transition-colors hover:text-white"><FaTelegramPlane size={22} className="transition-transform hover:scale-110" /></span>
              )}
              {smYoutube ? (
                <a href={smYoutube} aria-label="YouTube" className="hover:text-white transition-colors"><FaYoutube size={22} className="transition-transform hover:scale-110" /></a>
              ) : (
                <span aria-hidden="true" className="transition-colors hover:text-white"><FaYoutube size={22} className="transition-transform hover:scale-110" /></span>
              )}
              {smDiscord ? (
                <a href={smDiscord} aria-label="Discord" className="hover:text-white transition-colors"><FaDiscord size={22} className="transition-transform hover:scale-110" /></a>
              ) : (
                <span aria-hidden="true" className="transition-colors hover:text-white"><FaDiscord size={22} className="transition-transform hover:scale-110" /></span>
              )}
              {smFacebook ? (
                <a href={smFacebook} aria-label="Facebook" className="hover:text-white transition-colors"><FaFacebookF size={22} className="transition-transform hover:scale-110" /></a>
              ) : (
                <span aria-hidden="true" className="transition-colors hover:text-white"><FaFacebookF size={22} className="transition-transform hover:scale-110" /></span>
              )}
            </div>
          </div>
          <div className="">
            <div className="text-white font-semibold text-sm">Gamingqu</div>
            <ul className="mt-3 space-y-2">
              {navs.map((n, i) => {
                const t = (n.title ?? "").trim() || n.fallback;
                const u = (n.url ?? "").trim();
                const hasLink = u.length > 0;
                return (
                  <li key={i}>
                    {hasLink ? (
                      <a href={u} className="text-sm text-zinc-300 hover:text-white">{t}</a>
                    ) : (
                      <span className="text-sm text-zinc-300">{t}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="">
            <div className="text-white font-semibold text-sm">Legal</div>
            <ul className="mt-3 space-y-2">
              {legals.map((l, i) => {
                const t = (l.title ?? "").trim() || l.fallback;
                const u = (l.url ?? "").trim();
                const hasLink = u.length > 0;
                return (
                  <li key={i}>
                    {hasLink ? (
                      <a href={u} className="text-sm text-zinc-300 hover:text-white">{t}</a>
                    ) : (
                      <span className="text-sm text-zinc-300">{t}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="">
            <div className="text-white font-semibold text-sm">Payment Methods</div>
            <div className="mt-3 grid grid-cols-3 gap-6 items-center">
              {pmPaypal ? <Image src={pmPaypal} alt="PayPal" width={120} height={48} className="h-12 w-auto" unoptimized /> : null}
              {pmMc ? <Image src={pmMc} alt="Mastercard" width={120} height={48} className="h-12 w-auto" unoptimized /> : null}
              {pmVisa ? <Image src={pmVisa} alt="Visa" width={120} height={48} className="h-12 w-auto" unoptimized /> : null}
              {pmApplePay ? <Image src={pmApplePay} alt="Apple Pay" width={120} height={48} className="h-12 w-auto" unoptimized /> : null}
              {pmGpay ? <Image src={pmGpay} alt="Google Pay" width={120} height={48} className="h-12 w-auto" unoptimized /> : null}
              {pmStripe ? <Image src={pmStripe} alt="Stripe" width={120} height={48} className="h-12 w-auto" unoptimized /> : null}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-900" />
        {disclaimer && <p className="mt-6 text-sm leading-relaxed">{disclaimer}</p>}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 items-start gap-8">
          <div className="space-y-2">
            {copyright && <div className="text-xs">{copyright}</div>}
            {(address.length > 0 || reg.length > 0) && (
              <div className="text-xs flex flex-wrap items-center gap-2">
                {address ? <span>{address}</span> : null}
                {reg ? <span>Reg. Number: {reg}</span> : null}
              </div>
            )}
          </div>
          <div className="flex items-center justify-start md:justify-end gap-3">
            {mc ? <Image src={mc} alt="Mastercard SecureCode" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
            {visa ? <Image src={visa} alt="Verified by Visa" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
            {pci ? <Image src={pci} alt="PCI DSS" width={80} height={32} className="h-8 w-auto" unoptimized /> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
