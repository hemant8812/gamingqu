"use client";

import React from "react";
import Link from "next/link";
import { ServiceOptions } from "./ServiceOptions";
import { Clock, Timer, ShoppingCart, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/providers";
import { Toaster, toast as sonnerToast } from "sonner";

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
  range?: { min: number; max: number; step?: number; dual?: boolean; items?: Array<{ min: number; max: number; price: number }> };
  inputMeta?: { kind: "text" | "number"; min?: number; max?: number; required?: boolean };
};

export function ServicePanel({
  details,
  serviceSlug,
  basePrice,
}: {
  details: DetailItem[];
  serviceSlug: string;
  basePrice: number;
}) {
  const { symbol: currency, convert } = useCurrency();
  const [fromLevel, setFromLevel] = React.useState<number | null>(null);
  const [toLevel, setToLevel] = React.useState<number | null>(null);
  const [extras, setExtras] = React.useState<Array<{ price: number; kind: "fixed" | "percent" }>>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<Array<{ title: string; values: string[] }>>([]);
  const [invalidTitles, setInvalidTitles] = React.useState<string[]>([]);
  const [showErrors, setShowErrors] = React.useState(false);
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
          const items = d.range?.items;
          if (Array.isArray(items) && fromLevel != null && toLevel != null) {
            const candidates = items.filter((it) => Number.isFinite(it.min) && Number.isFinite(it.max));
            if (candidates.length > 0) {
              let chosen = candidates[0];
              let bestScore = Math.abs(fromLevel - chosen.min) + Math.abs(toLevel - chosen.max);
              for (let i = 1; i < candidates.length; i++) {
                const s = Math.abs(fromLevel - candidates[i].min) + Math.abs(toLevel - candidates[i].max);
                if (s < bestScore) {
                  bestScore = s;
                  chosen = candidates[i];
                }
              }
              const deltaMax = toLevel - chosen.max;
              const deltaMin = chosen.min - fromLevel;
              const price = Math.max(0, Number(chosen.price) + deltaMax * 1 + deltaMin * 1);
              if (Number.isFinite(price) && price > 0) {
                rangeAdd += price;
                continue;
              }
            }
          }
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
  }, [extras, basePrice, diff, details, fromLevel, toLevel]);
  const computedFmt = formatPrice(convert(totalPrice));
  const handleRangeChange = React.useCallback((from: number, to: number) => {
    setFromLevel(from);
    setToLevel(to);
  }, []);
  const handleSelectionsChange = React.useCallback((s: Array<{ price: number; kind: "fixed" | "percent" }>) => {
    setExtras(s);
  }, []);
  const handleSelectionLabelsChange = React.useCallback((items: Array<{ title: string; values: string[] }>) => {
    setSelectedOptions(items);
  }, []);
  const computeMissing = React.useCallback(() => {
    const missing: string[] = [];
    for (const d of details) {
      const req = !!d.inputMeta?.required;
      if (!req) continue;
      if (d.inputType === "range") continue;
      const item = selectedOptions.find((i) => i.title === d.title);
      const hasVal = item && Array.isArray(item.values) && item.values.length > 0 && item.values[0] !== "";
      if (d.inputType === "checkbox" && Array.isArray(d.options) && d.options.length > 0) {
        if (!item || !Array.isArray(item.values) || item.values.length === 0) {
          missing.push(d.title);
        }
      } else if (d.inputType === "select" || d.inputType === "radio" || d.inputType === "input") {
        if (!hasVal) {
          missing.push(d.title);
        } else if (d.inputType === "input" && d.inputMeta?.kind === "number") {
          const v = Number(item!.values[0]);
          const minOk = d.inputMeta.min == null || v >= Number(d.inputMeta.min);
          const maxOk = d.inputMeta.max == null || v <= Number(d.inputMeta.max);
          if (!Number.isFinite(v) || !minOk || !maxOk) {
            missing.push(d.title);
          }
        }
      }
    }
    return missing;
  }, [details, selectedOptions]);
  React.useEffect(() => {
    if (!showErrors) return;
    setInvalidTitles(computeMissing());
  }, [showErrors, computeMissing]);

  const [isBuying, setIsBuying] = React.useState(false);

  return (
    <aside className="relative space-y-0">
      <Toaster position="top-center" richColors theme="dark" offset="80px" />
      <div className="bg-[#0F172A] border border-white/10 rounded-t-2xl rounded-b-none p-6 border-b-0 shadow-none overflow-hidden">
        <div className="space-y-6">
          <ServiceOptions
            details={details}
            onRangeChange={handleRangeChange}
            onSelectionsChange={handleSelectionsChange}
            currentSubtotal={subtotal}
            onSelectionLabelsChange={handleSelectionLabelsChange}
            invalidTitles={invalidTitles}
          />
        </div>
      </div>
      <div className="sticky bottom-6 z-20">
        <div className="bg-[#0F172A] border border-white/10 rounded-b-2xl rounded-t-none p-4 border-t-0 -mt-px shadow-none relative">
          <div className="text-3xl font-black text-white tracking-wide mb-3 flex items-center gap-2">
            <span>Total</span>
            <div className="flex items-center gap-1">
              <span className="text-white text-3xl font-extrabold">{currency}</span>
              <span className="text-white font-extrabold tracking-wider text-4xl">
                {computedFmt.whole}
                {computedFmt.showDecimal && <span className="text-2xl font-bold">,{computedFmt.decimal}</span>}
              </span>
            </div>
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
            onClick={(e) => {
              try {
                if (isBuying) {
                  e.preventDefault();
                  return;
                }
                const missing = computeMissing();
                if (missing.length > 0) {
                  e.preventDefault();
                  setShowErrors(true);
                  setInvalidTitles(missing);
                  sonnerToast.error(`Required fields are missing: ${missing.join(", ")}`);
                  return;
                }
                setIsBuying(true);
                const data = {
                  serviceSlug,
                  basePrice,
                  fromLevel,
                  toLevel,
                  subtotal,
                  totalPrice,
                  selectedOptions,
                  ts: Date.now(),
                };
                window.localStorage.setItem(`checkout:${serviceSlug}`, JSON.stringify(data));
              } catch {
                setIsBuying(false);
              }
            }}
            className={`btn btn-gaming w-full h-12 mt-2 rounded-md inline-flex items-center justify-center text-base md:text-lg group ${isBuying ? "opacity-75 cursor-wait" : ""}`}
          >
            {isBuying ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2 group-active:scale-90 transition-transform" />
                Buy Now
              </>
            )}
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
