import { db } from "@/lib/prisma";
import Image from "next/image";
import { FaTelegramPlane, FaYoutube, FaDiscord, FaFacebookF } from "react-icons/fa";

type FooterSetting = {
  disclaimer?: string | null;
  shortDescription?: string | null;
  copyright?: string | null;
  legalAddress?: string | null;
  regNumber?: string | null;
  smTelegramUrl?: string | null;
  smYoutubeUrl?: string | null;
  smDiscordUrl?: string | null;
  smFacebookUrl?: string | null;
  badgeMastercardUrl?: string | null;
  badgeVisaUrl?: string | null;
  badgePciUrl?: string | null;
  navHomeTitle?: string | null;
  navHomeUrl?: string | null;
  navAboutTitle?: string | null;
  navAboutUrl?: string | null;
  navFaqTitle?: string | null;
  navFaqUrl?: string | null;
  navBoosterTitle?: string | null;
  navBoosterUrl?: string | null;
  legal1Title?: string | null;
  legal1Url?: string | null;
  legal2Title?: string | null;
  legal2Url?: string | null;
  legal3Title?: string | null;
  legal3Url?: string | null;
  legal4Title?: string | null;
  legal4Url?: string | null;
  pmVisaUrl?: string | null;
  pmMastercardUrl?: string | null;
  pmGpayUrl?: string | null;
  pmApplePayUrl?: string | null;
  pmPaypalUrl?: string | null;
  pmStripeUrl?: string | null;
  isActive?: boolean | null;
};

export async function Footer() {
  let s: FooterSetting | null = null;
  try {
    s = await db.footerSetting.findUnique({
      where: { id: "singleton" },
      select: {
        disclaimer: true,
        shortDescription: true,
        copyright: true,
        legalAddress: true,
        regNumber: true,
        smTelegramUrl: true,
        smYoutubeUrl: true,
        smDiscordUrl: true,
        smFacebookUrl: true,
        badgeMastercardUrl: true,
        badgeVisaUrl: true,
        badgePciUrl: true,
        navHomeTitle: true,
        navHomeUrl: true,
        navAboutTitle: true,
        navAboutUrl: true,
        navFaqTitle: true,
        navFaqUrl: true,
        navBoosterTitle: true,
        navBoosterUrl: true,
        legal1Title: true,
        legal1Url: true,
        legal2Title: true,
        legal2Url: true,
        legal3Title: true,
        legal3Url: true,
        legal4Title: true,
        legal4Url: true,
        pmVisaUrl: true,
        pmMastercardUrl: true,
        pmGpayUrl: true,
        pmApplePayUrl: true,
        pmPaypalUrl: true,
        pmStripeUrl: true,
        isActive: true,
      },
    });
    if (!s) {
      s = await db.footerSetting.findFirst({
        where: {
          OR: [
            { disclaimer: { not: null } },
            { copyright: { not: null } },
            { legalAddress: { not: null } },
            { regNumber: { not: null } },
            { badgeMastercardUrl: { not: null } },
            { badgeVisaUrl: { not: null } },
            { badgePciUrl: { not: null } },
            { navHomeTitle: { not: null } },
            { navHomeUrl: { not: null } },
            { navAboutTitle: { not: null } },
            { navAboutUrl: { not: null } },
            { navFaqTitle: { not: null } },
            { navFaqUrl: { not: null } },
            { navBoosterTitle: { not: null } },
            { navBoosterUrl: { not: null } },
            { legal1Title: { not: null } },
            { legal1Url: { not: null } },
            { legal2Title: { not: null } },
            { legal2Url: { not: null } },
            { legal3Title: { not: null } },
            { legal3Url: { not: null } },
            { legal4Title: { not: null } },
            { legal4Url: { not: null } },
            { pmVisaUrl: { not: null } },
            { pmMastercardUrl: { not: null } },
            { pmGpayUrl: { not: null } },
            { pmApplePayUrl: { not: null } },
            { pmPaypalUrl: { not: null } },
            { pmStripeUrl: { not: null } },
            { shortDescription: { not: null } },
            { smTelegramUrl: { not: null } },
            { smYoutubeUrl: { not: null } },
            { smDiscordUrl: { not: null } },
            { smFacebookUrl: { not: null } },
          ],
        },
        select: {
          disclaimer: true,
          shortDescription: true,
          copyright: true,
          legalAddress: true,
          regNumber: true,
          smTelegramUrl: true,
          smYoutubeUrl: true,
          smDiscordUrl: true,
          smFacebookUrl: true,
          badgeMastercardUrl: true,
          badgeVisaUrl: true,
          badgePciUrl: true,
          navHomeTitle: true,
          navHomeUrl: true,
          navAboutTitle: true,
          navAboutUrl: true,
          navFaqTitle: true,
          navFaqUrl: true,
          navBoosterTitle: true,
          navBoosterUrl: true,
          legal1Title: true,
          legal1Url: true,
          legal2Title: true,
          legal2Url: true,
          legal3Title: true,
          legal3Url: true,
          legal4Title: true,
          legal4Url: true,
          pmVisaUrl: true,
          pmMastercardUrl: true,
          pmGpayUrl: true,
          pmApplePayUrl: true,
          pmPaypalUrl: true,
          pmStripeUrl: true,
          isActive: true,
        },
        orderBy: { updatedAt: "desc" },
      });
    }
  } catch {
    s = null;
  }
  const ws = await db.websiteSetting.findUnique({
    where: { id: "singleton" },
    select: { siteName: true, logoUrl: true },
  });
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
            <div className="mt-3 grid grid-cols-3 gap-3">
              {pmVisa ? <Image src={pmVisa} alt="Visa" width={64} height={32} className="h-8 w-auto" unoptimized /> : null}
              {pmMc ? <Image src={pmMc} alt="Mastercard" width={64} height={32} className="h-8 w-auto" unoptimized /> : null}
              {pmGpay ? <Image src={pmGpay} alt="Google Pay" width={64} height={32} className="h-8 w-auto" unoptimized /> : null}
              {pmApplePay ? <Image src={pmApplePay} alt="Apple Pay" width={64} height={32} className="h-8 w-auto" unoptimized /> : null}
              {pmPaypal ? <Image src={pmPaypal} alt="PayPal" width={64} height={32} className="h-8 w-auto" unoptimized /> : null}
              {pmStripe ? <Image src={pmStripe} alt="Stripe" width={64} height={32} className="h-8 w-auto" unoptimized /> : null}
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
