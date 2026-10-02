"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle, Activity, Play, X, Gamepad2, Clock } from "lucide-react";
import type { BoosterJob } from "@/lib/boosterJobs";

type Action = (formData: FormData) => void | Promise<void>;

function details(payload?: string): string {
  if (!payload) return "";
  try {
    const obj = JSON.parse(payload) as {
      selectedOptions?: Array<{ title?: string; values?: Array<unknown> }>;
      range?: { from?: unknown; to?: unknown };
    };
    const parts: string[] = [];
    if (obj?.range && (obj.range.from !== undefined || obj.range.to !== undefined)) {
      parts.push(`Range: ${String(obj.range.from ?? "")} → ${String(obj.range.to ?? "")}`);
    }
    for (const o of Array.isArray(obj?.selectedOptions) ? obj.selectedOptions : []) {
      const v = Array.isArray(o.values) ? o.values.map(String).join(", ") : "";
      if (v) parts.push(`${String(o.title ?? "Option").trim()}: ${v}`);
    }
    return parts.join("; ");
  } catch {
    return "";
  }
}

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Price({ value }: { value: string }) {
  const m = value.match(/^(\D*)([\d,]+)(?:\.(\d+))?$/);
  if (!m) return <span className="font-display text-2xl font-bold text-white">{value}</span>;
  return (
    <span className="font-display text-3xl font-extrabold text-white tabular-nums">
      {m[1]}
      {m[2]}
      {m[3] && <sup className="ml-0.5 text-sm font-bold text-gray-300">{m[3]}</sup>}
    </span>
  );
}

function OrderRow({ job, children }: { job: BoosterJob; children: React.ReactNode }) {
  const info = details(job.payload);
  return (
    <div className="surface surface-hover grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="mb-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,1.6fr)_auto_auto]">
          <div className="col-span-2 min-w-0 sm:col-span-1">
            <div className="flex items-center gap-2 text-xs text-brand-300">
              <Gamepad2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.game}</span>
            </div>
            <div className="mt-1 truncate text-lg font-bold text-white">{job.title}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gray-500">Order</div>
            <div className="font-mono text-sm font-semibold text-gray-100">{job.id}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gray-500">Placed</div>
            <div className="text-sm font-semibold text-gray-100">{when(job.createdAt)}</div>
          </div>
        </div>
        {info && <p className="line-clamp-2 text-sm text-gray-400">{info}</p>}
      </div>
      <div className="flex items-center justify-between gap-4 md:justify-end">
        <Price value={job.price} />
        {children}
      </div>
    </div>
  );
}

function CodeForm({ action, code, back, children, className }: { action: Action; code: string; back: string; children: React.ReactNode; className: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="back" value={back} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}

export function JobsTabs({
  available,
  active,
  completed,
  hasServices,
  back = "/booster/orders",
  acceptAction,
  startAction,
  completeAction,
}: {
  available: BoosterJob[];
  active: BoosterJob[];
  completed: BoosterJob[];
  hasServices: boolean;
  back?: string;
  acceptAction: Action;
  startAction: Action;
  completeAction: Action;
}) {
  const [tab, setTab] = useState<"available" | "active" | "completed">("available");
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<BoosterJob | null>(null);

  // Filter chips: one per service that has open orders.
  const chips = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const j of available) {
      const key = `${j.game}::${j.title}`;
      const cur = map.get(key);
      map.set(key, { label: `${j.game} - ${j.title}`, count: (cur?.count ?? 0) + 1 });
    }
    return [...map.entries()];
  }, [available]);
  const shown = available.filter((j) => !hidden.has(`${j.game}::${j.title}`));

  const tabs = [
    { key: "available" as const, label: "Available orders", icon: Briefcase, count: available.length },
    { key: "active" as const, label: "In process", icon: Activity, count: active.length },
    { key: "completed" as const, label: "Completed", icon: CheckCircle, count: completed.length },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold ${
              tab === t.key ? "border-brand-400 text-white" : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            <span className="rounded-md bg-white/5 px-1.5 text-xs tabular-nums text-gray-300">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "available" && (
        <div className="space-y-3">
          {!hasServices ? (
            <div className="surface p-10 text-center">
              <Gamepad2 className="mx-auto mb-3 h-10 w-10 text-brand-300" />
              <div className="text-lg font-bold text-white">Choose your services first</div>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-400">
                Pick the games and services you can do. New orders for them will show up here.
              </p>
              <Link href="/booster/services" className="btn btn-gaming mt-5 h-10 rounded-xl px-5">
                Choose services
              </Link>
            </div>
          ) : (
            <>
              <div className="surface flex flex-wrap items-center gap-2 p-3">
                <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">Services</span>
                {chips.length === 0 && <span className="text-sm text-gray-500">No open orders right now</span>}
                {chips.map(([key, c]) => {
                  const off = hidden.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={!off}
                      onClick={() =>
                        setHidden((prev) => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                        off ? "border-white/10 text-gray-500 line-through" : "border-brand-500/40 bg-brand-500/15 text-white"
                      }`}
                    >
                      {c.label} <span className="tabular-nums text-gray-400">({c.count})</span>
                      {!off && <X className="h-3 w-3" />}
                    </button>
                  );
                })}
                <Link href="/booster/services" className="ml-auto text-xs font-semibold text-brand-300 hover:text-white">
                  Services I can do
                </Link>
              </div>
              {shown.length === 0 ? (
                <div className="surface p-10 text-center text-gray-400">
                  There are no available orders in your selected services right now. New paid orders show up here as soon as they come in.
                </div>
              ) : (
                shown.map((job) => (
                  <OrderRow key={job.id} job={job}>
                    <button type="button" onClick={() => setConfirm(job)} className="btn h-11 rounded-xl border-0 bg-lime-glow px-5 font-bold text-ink-900 hover:brightness-110">
                      Get order
                    </button>
                  </OrderRow>
                ))
              )}
            </>
          )}
        </div>
      )}

      {tab === "active" && (
        <div className="space-y-3">
          {active.length === 0 ? (
            <div className="surface p-10 text-center text-gray-400">You have no orders in process. Take one from Available orders.</div>
          ) : (
            active.map((job) => (
              <OrderRow key={job.id} job={job}>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
                      job.status === "IN_PROGRESS" ? "bg-sky-500/15 text-sky-200 ring-sky-400/30" : "bg-amber-500/15 text-amber-200 ring-amber-400/30"
                    }`}
                  >
                    {job.status === "IN_PROGRESS" ? "In progress" : "Accepted"}
                  </span>
                  <div className="flex gap-2">
                    {job.status === "ACCEPTED" && (
                      <CodeForm back={back} action={startAction} code={job.id} className="btn btn-sm h-9 rounded-xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/10">
                        <Play className="h-4 w-4" /> Start
                      </CodeForm>
                    )}
                    <CodeForm back={back} action={completeAction} code={job.id} className="btn btn-gaming btn-sm h-9 rounded-xl">
                      <CheckCircle className="h-4 w-4" /> Mark complete
                    </CodeForm>
                  </div>
                </div>
              </OrderRow>
            ))
          )}
        </div>
      )}

      {tab === "completed" && (
        <div className="space-y-3">
          {completed.length === 0 ? (
            <div className="surface p-10 text-center text-gray-400">No completed jobs yet.</div>
          ) : (
            completed.map((job) => (
              <OrderRow key={job.id} job={job}>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                  <CheckCircle className="h-3.5 w-3.5" /> Completed
                </span>
              </OrderRow>
            ))
          )}
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Take this order">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-ink-800 p-6 shadow-2xl">
            <div className="text-xs text-brand-300">{confirm.game}</div>
            <h2 className="mt-1 text-xl font-bold text-white">{confirm.title}</h2>
            <div className="mt-1 font-mono text-xs text-gray-400">{confirm.id}</div>
            {details(confirm.payload) && <p className="mt-4 rounded-xl bg-ink-900 p-3 text-sm text-gray-300">{details(confirm.payload)}</p>}
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="h-4 w-4" /> You get paid
              </span>
              <Price value={confirm.price} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirm(null)} className="btn h-11 rounded-xl border border-white/10 bg-white/[0.04] text-gray-200">
                Cancel
              </button>
              <CodeForm back={back} action={acceptAction} code={confirm.id} className="btn h-11 w-full rounded-xl border-0 bg-lime-glow font-bold text-ink-900 hover:brightness-110">
                Take this order
              </CodeForm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
