"use client";

import { useState, useEffect, Fragment } from "react";
import { Briefcase, CheckCircle, Activity, ArrowLeft } from "lucide-react";

type ActiveJob = { id: string; title: string; game: string; status: "In Progress" | "Pending"; progress: number; price: string };
type AvailableJob = { id: string; title: string; game: string; price: string; createdAt: string; payload?: string };

export function JobsTabs({ available, active }: { available: AvailableJob[]; active: ActiveJob[] }) {
  const [tab, setTab] = useState<"available" | "active" | "completed">("available");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AvailableJob | null>(null);
  useEffect(() => {
    if (!selected) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [selected]);
  const isAvailable = tab === "available";
  const isActive = tab === "active";
  const isCompleted = tab === "completed";
  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil((available?.length ?? 0) / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = isAvailable ? available.slice(start, end) : [];
  return (
    <div className="bg-ink-800 border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
      <div className="px-4 md:px-6">
        <div className="relative border-b border-white/10">
          <div className="flex items-center justify-center gap-6 py-4">
            <button
              type="button"
              onClick={() => setTab("available")}
              className={["px-4 py-2 text-sm font-semibold cursor-pointer border-b-2 inline-flex items-center gap-2", isAvailable ? "text-white border-brand-500" : "text-gray-400 border-transparent hover:text-white"].join(" ")}
            >
              <Briefcase className="h-4 w-4" />
              <span>Available Jobs</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("active")}
              className={["px-4 py-2 text-sm font-semibold cursor-pointer border-b-2 inline-flex items-center gap-2", isActive ? "text-white border-brand-500" : "text-gray-400 border-transparent hover:text-white"].join(" ")}
            >
              <Activity className="h-4 w-4" />
              <span>Active Jobs</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("completed")}
              className={["px-4 py-2 text-sm font-semibold cursor-pointer border-b-2 inline-flex items-center gap-2", isCompleted ? "text-white border-brand-500" : "text-gray-400 border-transparent hover:text-white"].join(" ")}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        {isAvailable ? (
          <div className="space-y-2">
            {available.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mb-4 text-gray-400 flex items-center justify-center">
                  <Briefcase className="h-10 w-10" />
                </div>
                <div className="text-lg font-bold text-gray-200">No available jobs</div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1">
                {pageItems.map((job) => {
                  const created = new Date(job.createdAt);
                  const createdStr = created.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  let payloadPreview: Array<{ k: string; v: string }> = [];
                  let rangeText = "";
                  if (job.payload) {
                    try {
                      const obj = JSON.parse(job.payload) as { selectedOptions?: Array<{ title?: string; values?: Array<string> }>; range?: { from?: unknown; to?: unknown } };
                      if (obj?.range && (obj.range.from !== undefined || obj.range.to !== undefined)) {
                        const from = String(obj.range.from ?? "");
                        const to = String(obj.range.to ?? "");
                        rangeText = `${from} → ${to}`;
                      }
                      const opts = Array.isArray(obj?.selectedOptions) ? obj!.selectedOptions! : [];
                      payloadPreview = opts.slice(0, 3).map((o) => ({
                        k: String(o.title ?? "").trim() || "Option",
                        v: Array.isArray(o.values) ? o.values.map((x) => String(x)).join(", ") : "",
                      }));
                    } catch {
                      // ignore parse errors
                    }
                  }
                  return (
                    <div key={job.id} className="rounded-md border border-brand-500/20 bg-brand-600/10 ring-1 ring-brand-500/20 p-4 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 ring-1 ring-white/10 text-xs text-gray-200">{job.id}</div>
                        <div className="text-[11px] text-gray-400">{createdStr}</div>
                      </div>
                      <div className="flex items-stretch justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                          <div className="text-xs text-gray-300 truncate">{job.game}</div>
                          {(rangeText || payloadPreview.length > 0) && (
                            <div className="mt-2 space-y-1">
                              {rangeText && (
                                <div className="w-full flex items-center justify-between text-[12px]">
                                  <span className="text-gray-400">Range</span>
                                  <span className="text-gray-100 font-semibold">{rangeText}</span>
                                </div>
                              )}
                              {payloadPreview.map((p) => (
                                <div key={`${job.id}-${p.k}`} className="w-full flex items-center justify-between text-[12px]">
                                  <span className="text-gray-400">{p.k}</span>
                                  <span className="text-gray-100 font-semibold">{p.v}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 flex flex-col items-end justify-center">
                          <div className="text-emerald-400 font-bold text-lg md:text-xl">{job.price}</div>
                          <button
                            type="button"
                            className="btn btn-gaming mt-2 inline-flex items-center gap-2"
                            onClick={() => setSelected(job)}
                            aria-label="Accept job"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    </div>
                );
                })}
              </div>
            )}
            {available.length > 0 && totalPages > 1 && (
              <div className="pt-3 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  const activePage = p === page;
                  return (
                    <button
                      type="button"
                      key={`jobs-page-${p}`}
                      onClick={() => setPage(p)}
                      className={["px-3 py-1.5 text-xs rounded-md ring-1 transition", activePage ? "bg-brand-600 text-white ring-brand-500" : "bg-white/5 text-gray-300 ring-white/10 hover:bg-white/10"].join(" ")}
                      aria-current={activePage ? "page" : undefined}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : isActive ? (
          <div className="space-y-3">
            {active.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mb-4 text-gray-400 flex items-center justify-center">
                  <Activity className="h-10 w-10" />
                </div>
                <div className="text-lg font-bold text-gray-200">No active jobs</div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1">
                {active.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-white/10 bg-ink-900 p-4 mb-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                        <div className="text-xs text-gray-500 truncate">{job.game}</div>
                      </div>
                      <div className="text-xs px-2 py-0.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-gray-300">{job.status}</div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${Math.max(0, Math.min(100, job.progress))}%` }} />
                      </div>
                      <div className="mt-1 text-xs text-gray-400">Progress {job.progress}% • {job.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mb-4 text-gray-400 flex items-center justify-center">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="text-lg font-bold text-gray-200">No completed jobs yet</div>
          </div>
        )}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSelected(null)} />
            <div className="relative w-full max-w-xl rounded-2xl bg-ink-800 border border-white/10 ring-1 ring-white/10 shadow-xl">
              <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 ring-1 ring-white/10 text-xs text-gray-200">{selected.id}</div>
                <div className="text-[11px] text-gray-400">
                  {new Date(selected.createdAt).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-base md:text-lg font-semibold text-white truncate">{selected.title}</div>
                    <div className="text-xs text-gray-300 truncate">{selected.game}</div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end justify-center">
                    <div className="text-emerald-400 font-bold text-xl md:text-2xl">{selected.price}</div>
                  </div>
                </div>
                {(() => {
                  try {
                    const obj = selected.payload ? JSON.parse(selected.payload) as { selectedOptions?: Array<{ title?: string; values?: Array<string> }>; range?: { from?: unknown; to?: unknown } } : null;
                    const from = obj?.range?.from;
                    const to = obj?.range?.to;
                    const r = from !== undefined || to !== undefined ? `${String(from ?? "")} → ${String(to ?? "")}` : "";
                    const opts = Array.isArray(obj?.selectedOptions) ? obj!.selectedOptions! : [];
                    const rows: Array<{ k: string; v: string }> = [];
                    if (r) rows.push({ k: "Range", v: r });
                    for (const o of opts) {
                      rows.push({
                        k: String(o.title ?? "Option"),
                        v: Array.isArray(o.values) ? o.values.map((x) => String(x)).join(", ") : "",
                      });
                    }
                    return (
                      <div className="mt-4 rounded-xl bg-ink-900 border border-white/10 p-4 w-full">
                        <div className="grid grid-cols-[1fr_auto] gap-y-2">
                          {rows.map((row, idx) => (
                            <Fragment key={`row-${idx}`}>
                              <div className="text-[12px] text-gray-400">{row.k}</div>
                              <div className="text-[12px] text-gray-100 font-semibold text-right">{row.v}</div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
              <div className="p-4 md:p-6 border-t border-white/10 grid grid-cols-2 gap-3 bg-white/5 backdrop-blur-md rounded-b-2xl">
                <button
                  type="button"
                  className="btn btn-outline inline-flex items-center justify-center gap-2 w-full"
                  onClick={() => setSelected(null)}
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="btn btn-gaming inline-flex items-center justify-center gap-2 w-full"
                  onClick={() => setSelected(null)}
                  aria-label="Accept"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
