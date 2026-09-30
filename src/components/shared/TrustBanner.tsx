"use client";
import Image from "next/image";
import { Shield, BadgePercent, Star, Headphones } from "lucide-react";
import { SITE_DEFAULTS } from "@/lib/constants";

export function TrustBanner({
  brandName = SITE_DEFAULTS.name,
  logoUrl = SITE_DEFAULTS.logo,
}: {
  brandName?: string;
  logoUrl?: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-ink-800 overflow-hidden p-6 md:p-8">
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
          Why Players Choose {brandName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Zero-Ban Protocol</div>
              <div className="text-sm text-gray-400">Manual boosting with smart VPN routes. No bots, no cheats.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <BadgePercent className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Fair Price Promise</div>
              <div className="text-sm text-gray-400">Pay for results — not shortcuts. Transparent pricing.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Verified Pros Only</div>
              <div className="text-sm text-gray-400">ID-checked, skill-tested, and top-ranked boosters.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500/20 text-accent-400 flex items-center justify-center shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">24/7 Human Support</div>
              <div className="text-sm text-gray-400">Live chat with agents. Instant updates on your order.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-[-8px] md:right-[-16px] lg:right-[-24px] top-1/2 -translate-y-1/2">
        <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-10">
          <Image
            src={logoUrl}
            alt={`${brandName} logo`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>
    </div>
  );
}
