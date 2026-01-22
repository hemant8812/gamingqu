import { db } from "@/lib/prisma";

export async function Footer() {
  const footerClient = (db as unknown as Record<string, unknown>)["footerSetting"] as
    | { findUnique: (args: unknown) => Promise<any> }
    | undefined;
  const s = footerClient
    ? await footerClient
        .findUnique({
          where: { id: "singleton" },
          select: {
            disclaimer: true,
            copyright: true,
            legalAddress: true,
            regNumber: true,
            badgeMastercardUrl: true,
            badgeVisaUrl: true,
            badgePciUrl: true,
            isActive: true,
          },
        })
        .catch(() => null)
    : null;
  const active = s?.isActive ?? true;
  const disclaimer = (s?.disclaimer ?? "").trim();
  const copyright = (s?.copyright ?? "").trim();
  const address = (s?.legalAddress ?? "").trim();
  const reg = (s?.regNumber ?? "").trim();
  const mc = (s?.badgeMastercardUrl ?? "").trim();
  const visa = (s?.badgeVisaUrl ?? "").trim();
  const pci = (s?.badgePciUrl ?? "").trim();
  if (!active) return null;
  return (
    <footer className="mt-8 border-t border-zinc-900 bg-black text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 py-9">
        {disclaimer && <p className="text-sm leading-relaxed">{disclaimer}</p>}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 items-start gap-6">
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
            {mc ? <img src={mc} alt="Mastercard SecureCode" className="h-8 w-auto" /> : null}
            {visa ? <img src={visa} alt="Verified by Visa" className="h-8 w-auto" /> : null}
            {pci ? <img src={pci} alt="PCI DSS" className="h-8 w-auto" /> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
