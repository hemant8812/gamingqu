"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_GROUPS } from "@/lib/faq";

// FAQ with topic tabs and an accordion, plus a "still have questions" box.
export function Faq() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const group = FAQ_GROUPS[tab];

  return (
    <section aria-labelledby="faq-title" className="grid gap-6 md:grid-cols-[0.8fr_1.6fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow mb-2">FAQ</p>
          <h2 id="faq-title" className="text-2xl font-extrabold text-white md:text-3xl">Frequently asked questions</h2>
        </div>
        <div className="surface mt-auto p-5">
          <h3 className="flex items-center gap-2 font-bold text-white"><HelpCircle className="h-5 w-5 text-brand-300" /> Still have questions?</h3>
          <p className="mt-2 text-sm text-gray-400">Our support team answers 24/7, usually within minutes.</p>
          <Link href="/contact" className="btn btn-gaming mt-4 h-10 w-full rounded-xl">Ask us</Link>
        </div>
      </div>
      <div>
        <div role="tablist" aria-label="FAQ topics" className="mb-4 flex gap-6 border-b border-white/10">
          {FAQ_GROUPS.map((g, i) => (
            <button key={g.topic} role="tab" type="button" aria-selected={tab === i}
              onClick={() => { setTab(i); setOpen(0); }}
              className={`-mb-px border-b-2 pb-2 text-sm font-semibold uppercase tracking-wider ${tab === i ? "border-brand-400 text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
              {g.topic}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {group.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`rounded-xl border ${isOpen ? "border-brand-500/50 bg-brand-500/[0.07]" : "border-white/10 bg-ink-800"}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-white">
                  {f.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-brand-300 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-4 pb-4 text-sm leading-relaxed text-gray-300">{f.a}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
