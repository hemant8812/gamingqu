"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ServicePicker } from "./ServicePicker";

type Game = { id: number; name: string; services: { id: number; name: string }[] };

// "Services I can do" button that opens the service picker in a pop-up.
export function ServicesDialog({
  games,
  initial,
  action,
  back,
  label = "Services I can do",
  className = "btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]",
}: {
  games: Game[];
  initial: number[];
  action: (formData: FormData) => void | Promise<void>;
  back: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Select services">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form action={action} className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-ink-800 shadow-2xl">
            <input type="hidden" name="back" value={back} />
            <div className="flex items-center justify-between px-6 pb-2 pt-6">
              <h2 className="text-2xl font-extrabold text-white">Select services</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
              <ServicePicker games={games} initial={initial} />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 px-6 py-4">
              <button type="submit" className="btn btn-gaming h-11 rounded-xl">Select</button>
              <button type="button" onClick={() => setOpen(false)} className="btn h-11 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
