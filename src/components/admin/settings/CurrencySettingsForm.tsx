 "use client";
 import { useRouter } from "next/navigation";
 import { useState } from "react";
import { Save as SaveIcon, Coins } from "lucide-react";
 
export function CurrencySettingsForm({
  initialRate,
  initialWebShare,
  initialBoosterShare,
}: {
  initialRate?: number;
  initialWebShare?: number;
  initialBoosterShare?: number;
}) {
   const router = useRouter();
   const [busy, setBusy] = useState(false);
   const [rate, setRate] = useState<string>(
     Number.isFinite(initialRate ?? NaN) && (initialRate as number) > 0
       ? (initialRate as number).toString()
       : ""
   );
  const [webShare, setWebShare] = useState<string>(
    Number.isFinite(initialWebShare ?? NaN) && (initialWebShare as number) >= 0
      ? (initialWebShare as number).toString()
      : ""
  );
  const [boosterShare, setBoosterShare] = useState<string>(
    Number.isFinite(initialBoosterShare ?? NaN) && (initialBoosterShare as number) >= 0
      ? (initialBoosterShare as number).toString()
      : ""
  );
 
   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     if (busy) return;
     setBusy(true);
     try {
       const fd = new FormData(e.currentTarget);
       const res = await fetch("/api/admin/settings", { method: "POST", body: fd });
       if (!res.ok) {
         router.push("/admin/settings?toast=error&tab=currency");
         return;
       }
       router.push("/admin/settings?toast=saved&tab=currency");
     } catch {
       router.push("/admin/settings?toast=error&tab=currency");
     } finally {
       setBusy(false);
     }
   };
 
   const inputClassName =
     "w-full h-11 px-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all";
 
  const clampPercent = (n: number) => Math.max(0, Math.min(100, n));
  const formatPercent = (n: number) => {
    const s = n.toFixed(2);
    return s.replace(/\.00$/, "");
  };

   return (
     <form onSubmit={onSubmit} method="post" className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <label htmlFor="eurPerUsd" className="block text-sm font-medium text-gray-300 mb-2">
             1 USD equals (EUR)
           </label>
           <input
             id="eurPerUsd"
             name="eurPerUsd"
             type="number"
             step="0.0001"
             min="0.0001"
             placeholder="e.g. 0.92"
             className={inputClassName}
             value={rate}
             onChange={(e) => setRate(e.target.value)}
             required
           />
          <div className="text-xs text-gray-400 mt-2">Base currency is USD. This is the EUR rate relative to USD (1 USD equals X EUR).</div>
         </div>
        <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-4">
           <div className="flex items-center gap-3">
             <Coins className="w-5 h-5 text-emerald-400" />
             <div className="text-sm font-semibold text-white">Currency Settings</div>
           </div>
           <div className="text-xs text-gray-400 mt-2">
             Prices are stored in USD. Choosing EUR shows converted values across the site.
           </div>
         </div>
       </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="webSharePercent" className="block text-sm font-medium text-gray-300 mb-2">
            Web Share (%)
          </label>
          <input
            id="webSharePercent"
            name="webSharePercent"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="e.g. 50"
            className={inputClassName}
            value={webShare}
            onChange={(e) => {
              const raw = e.target.value;
              setWebShare(raw);
              const n = parseFloat(raw);
              if (Number.isFinite(n)) {
                const clamped = clampPercent(n);
                const complement = clampPercent(100 - clamped);
                setBoosterShare(formatPercent(complement));
              } else {
                setBoosterShare("");
              }
            }}
            onBlur={(e) => {
              const n = parseFloat(e.target.value);
              if (Number.isFinite(n)) {
                const clamped = clampPercent(n);
                setWebShare(formatPercent(clamped));
                setBoosterShare(formatPercent(clampPercent(100 - clamped)));
              }
            }}
          />
          <div className="text-xs text-gray-400 mt-2">Platform share: percentage of revenue kept by the website.</div>
        </div>
        <div>
          <label htmlFor="boosterSharePercent" className="block text-sm font-medium text-gray-300 mb-2">
            Booster Share (%)
          </label>
          <input
            id="boosterSharePercent"
            name="boosterSharePercent"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="e.g. 50"
            className={inputClassName}
            value={boosterShare}
            onChange={(e) => {
              const raw = e.target.value;
              setBoosterShare(raw);
              const n = parseFloat(raw);
              if (Number.isFinite(n)) {
                const clamped = clampPercent(n);
                const complement = clampPercent(100 - clamped);
                setWebShare(formatPercent(complement));
              } else {
                setWebShare("");
              }
            }}
            onBlur={(e) => {
              const n = parseFloat(e.target.value);
              if (Number.isFinite(n)) {
                const clamped = clampPercent(n);
                setBoosterShare(formatPercent(clamped));
                setWebShare(formatPercent(clampPercent(100 - clamped)));
              }
            }}
          />
          <div className="text-xs text-gray-400 mt-2">Booster share: percentage of revenue paid to the booster.</div>
        </div>
      </div>
       <div className="flex justify-end">
         <button type="submit" className="btn btn-gaming gap-2" disabled={busy}>
           <SaveIcon className="w-4 h-4" />
           <span>Save</span>
         </button>
       </div>
     </form>
   );
 }
