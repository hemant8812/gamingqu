"use client";

import React from "react";
import Link from "next/link";
import { ServiceOptions } from "./ServiceOptions";
import { Clock, Timer, ShoppingCart, CheckCircle } from "lucide-react";
import { SiStripe, SiVisa, SiAmericanexpress, SiApplepay, SiGooglepay, SiPaypal, SiBitcoin } from "react-icons/si";
import { formatPrice } from "@/lib/formatPrice";

type DetailItem = {
  id: number;
  title: string;
  fieldName: string;
  inputType: "select" | "radio" | "range" | "checkbox" | "input";
  displayType?: "number" | "text" | "dual" | "single";
  priceType: "fixed" | "percent";
  price: number;
  sortOrder?: number;
  options?: Array<{ label: string; price: number }>;
  range?: { min: number; max: number; step?: number; dual?: boolean };
  inputMeta?: { kind: "text" | "number"; min?: number; max?: number };
};

export function ServicePanel({
  details,
  priceFmt,
  serviceSlug,
  basePrice,
}: {
  details: DetailItem[];
  priceFmt: { whole: string; decimal?: string; showDecimal?: boolean };
  serviceSlug: string;
  basePrice: number;
}) {
  const [fromLevel, setFromLevel] = React.useState<number | null>(null);
  const [toLevel, setToLevel] = React.useState<number | null>(null);
  const [extras, setExtras] = React.useState<Array<{ price: number; kind: "fixed" | "percent" }>>([]);
  const diff = fromLevel != null && toLevel != null ? Math.max(0, toLevel - fromLevel) : 0;
  const isDualActive = diff > 0;
  const isSpecial =
    (fromLevel === 50 && toLevel === 60) ||
    (fromLevel === 50 && toLevel === 70) ||
    (fromLevel === 60 && toLevel === 70);
  const days = isSpecial ? 6 : Math.ceil(diff / 5);
  const { subtotal, totalPrice } = React.useMemo(() => {
    let rangeAdd = 0;
    if (diff > 0) {
      for (const d of details) {
        if (d.inputType === "range" && (d.displayType === "dual" || d.range?.dual)) {
          const p = Number(d.price);
          if (Number.isFinite(p) && p > 0) {
            if (d.priceType === "percent") {
              rangeAdd += basePrice * (p / 100) * diff;
            } else {
              rangeAdd += p * diff;
            }
          }
        }
      }
    }
    let fixedAdd = 0;
    let percentAdd = 0;
    for (const e of extras) {
      if (e.kind === "fixed") fixedAdd += e.price;
    }
    const subtotal = basePrice + rangeAdd + fixedAdd;
    for (const e of extras) {
      if (e.kind === "percent") percentAdd += subtotal * (e.price / 100);
    }
    return { subtotal, totalPrice: subtotal + percentAdd };
  }, [extras, basePrice, diff, details]);
  const computedFmt = formatPrice(totalPrice);

  return (
    <aside className="relative space-y-0">
      <div className="glass-card rounded-t-2xl rounded-b-none p-6 border-b-0 shadow-none">
        <div className="space-y-6">
          <ServiceOptions
            details={details}
            onRangeChange={(from, to) => {
              setFromLevel(from);
              setToLevel(to);
            }}
            onSelectionsChange={(s) => setExtras(s)}
            currentSubtotal={subtotal}
          />
        </div>
      </div>
      <div className="sticky bottom-6">
        <div className="glass-card rounded-b-2xl rounded-t-none p-4 border-t-0 -mt-px shadow-none">
          <div className="text-3xl font-black text-white tracking-tight mb-3">
            <span className="gradient-text">
              {computedFmt.whole}
              {computedFmt.showDecimal && <span className="text-lg">,{computedFmt.decimal}</span>}
            </span>
            <span className="text-white/80 text-xl ml-2">$</span>
          </div>

          <div className="space-y-1 mb-3">
            {isDualActive && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>30 minutes average start time</span>
              </div>
            )}
            {isDualActive && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Timer className="h-4 w-4 text-gray-400" />
                <span>
                  {days} {days === 1 ? "day" : "days"} order completion
                </span>
              </div>
            )}
          </div>

          <Link
            href={`/checkout/${serviceSlug}`}
            className="btn btn-gaming w-full h-12 mt-2 rounded-md inline-flex items-center justify-center text-base md:text-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Buy Now
          </Link>
          <div className="mt-2 w-full flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>100% Money-Back Guarantee</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
