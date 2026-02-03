"use client";

import React from "react";

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

function OptionSelect({
  id,
  title,
  options,
  onChangeExtras,
}: {
  id: number;
  title: string;
  options: NonNullable<DetailItem["options"]>;
  onChangeExtras?: (extras: Array<{ price: number; kind: "fixed" }>) => void;
}) {
  const [val, setVal] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.label === val);
  React.useEffect(() => {
    const extras = selected && Number.isFinite(selected.price) && selected.price > 0 ? [{ price: selected.price, kind: "fixed" as const }] : [];
    if (onChangeExtras) onChangeExtras(extras);
  }, [selected, onChangeExtras, id]);

  return (
    <div className="space-y-2" ref={ref}>
      <div className="text-white font-semibold">{title}</div>
      <div className="relative">
        <div
          className="flex items-center justify-between w-full px-4 py-3 bg-[#1e293b] text-white rounded-xl cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <span className={val ? "text-white" : "text-gray-400"}>
            {val ? (
              <>
                {val} {selected && Number.isFinite(selected.price) && selected.price > 0 ? `(+$${selected.price})` : ""}
              </>
            ) : "Select"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {open && (
          <div className="absolute z-50 w-full mt-1 bg-[#1e293b] border border-white/10 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            <div
              className="px-4 py-2.5 text-gray-400 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => {
                setVal("");
                setOpen(false);
              }}
            >
              Select
            </div>
            {options.map((o, i) => (
              <div
                key={i}
                className={`px-4 py-2.5 cursor-pointer flex justify-between items-center transition-colors ${
                  val === o.label ? "bg-blue-600 text-white" : "text-white hover:bg-blue-600"
                }`}
                onClick={() => {
                  setVal(o.label);
                  setOpen(false);
                }}
              >
                <span>{o.label}</span>
                {Number.isFinite(o.price) && o.price > 0 && (
                  <span className="text-sm opacity-80">(+${o.price})</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionRadio({
  id,
  title,
  options,
  onChangeExtras,
  priceType,
  currentSubtotal,
}: {
  id: number;
  title: string;
  options: NonNullable<DetailItem["options"]>;
  onChangeExtras?: (extras: Array<{ price: number; kind: "fixed" | "percent" }>) => void;
  priceType: "fixed" | "percent";
  currentSubtotal?: number;
}) {
  const [val, setVal] = React.useState<string>("");
  const isDual = options.length === 2;
  const isList = options.length >= 3;

  React.useEffect(() => {
    if (options.length === 1 && val === "") {
      setVal(options[0].label);
    }
  }, [options, val]);
  React.useEffect(() => {
    const selected = options.find((o) => o.label === val);
    const extras =
      selected && Number.isFinite(selected.price) && selected.price > 0
        ? [{ price: selected.price, kind: priceType === "percent" ? "percent" : "fixed" }]
        : [];
    if (onChangeExtras) onChangeExtras(extras);
  }, [val, options, onChangeExtras, id, priceType]);

  if (isList) {
    return (
      <div className="space-y-2">
        <div className="text-white font-semibold">{title}</div>
        <div className="bg-[#1e293b] rounded-xl overflow-hidden divide-y divide-white/10 border-0">
          {options.map((o, i) => (
            <label 
              key={i} 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                  <input
                    type="radio"
                    className="peer appearance-none w-6 h-6 rounded-full border-0 bg-transparent checked:border-0 ring-2 ring-white/10 checked:ring-blue-600"
                    name={`radio-${title}`}
                    checked={val === o.label}
                    onChange={() => setVal(o.label)}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="font-semibold text-white">{o.label}</span>
              </div>
              {Number.isFinite(o.price) && o.price > 0 && (
                <span className="font-semibold text-gray-300">
                  +$
                  {(priceType === "percent"
                    ? ((currentSubtotal ?? 0) * (o.price / 100))
                    : o.price
                  ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-white font-semibold">{title}</div>
      <div className={`grid gap-3 ${isDual ? "grid-cols-2" : "grid-cols-1"}`}>
        {options.map((o, i) => (
          <label 
            key={i} 
            className={`
              flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-transparent transition-all
              ${val === o.label ? "bg-blue-600/20 border-blue-600" : "bg-[#1e293b] border-transparent hover:bg-white/5"}
            `}
          >
            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
              <input
                type="radio"
                className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-500 checked:border-blue-500 bg-transparent"
                name={`radio-${title}`}
                checked={val === o.label}
                onChange={() => setVal(o.label)}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className={`text-sm font-medium ${val === o.label ? "text-white" : "text-gray-300"}`}>
              {o.label}{" "}
              {Number.isFinite(o.price) && o.price > 0
                ? `(+$${(priceType === "percent"
                    ? ((currentSubtotal ?? 0) * (o.price / 100))
                    : o.price
                  ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                : ""}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function OptionCheckboxGroup({
  id,
  title,
  options,
  onChangeExtras,
}: {
  id: number;
  title: string;
  options: NonNullable<DetailItem["options"]>;
  onChangeExtras?: (extras: Array<{ price: number; kind: "fixed" }>) => void;
}) {
  const [vals, setVals] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    const extras: Array<{ price: number; kind: "fixed" }> = [];
    for (const o of options) {
      if (vals[o.label] && Number.isFinite(o.price) && o.price > 0) {
        extras.push({ price: o.price, kind: "fixed" });
      }
    }
    if (onChangeExtras) onChangeExtras(extras);
  }, [vals, options, onChangeExtras, id]);
  return (
    <div className="space-y-2">
      <div className="text-white font-semibold">{title}</div>
      <div className="bg-[#1e293b] rounded-xl overflow-hidden divide-y divide-white/10 border-0">
        {options.map((o, i) => (
          <label key={i} className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="checkbox checkbox-primary rounded-lg w-6 h-6 border-0 bg-transparent checked:bg-blue-600 checked:border-0 ring-2 ring-white/10"
                checked={!!vals[o.label]}
                onChange={(e) => setVals((m) => ({ ...m, [o.label]: e.target.checked }))}
              />
              <span className="font-semibold text-white">{o.label}</span>
            </div>
            {Number.isFinite(o.price) && o.price > 0 && (
              <span className="font-semibold text-gray-300">+${o.price}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function OptionSingleCheckbox({
  id,
  title,
  price,
  priceType,
  onChangeExtras,
  currentSubtotal,
}: {
  id: number;
  title: string;
  price: number;
  priceType: "fixed" | "percent";
  onChangeExtras?: (extras: Array<{ price: number; kind: "fixed" | "percent" }>) => void;
  currentSubtotal?: number;
}) {
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {
    const extras = checked && Number.isFinite(price) && price > 0 ? [{ price, kind: priceType === "percent" ? "percent" : "fixed" }] : [];
    if (onChangeExtras) onChangeExtras(extras);
  }, [checked, price, priceType, onChangeExtras, id]);
  return (
    <div className="space-y-2">
      <div className="bg-[#1e293b] rounded-xl overflow-hidden border-0">
        <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary rounded-lg w-6 h-6 border-0 bg-transparent checked:bg-blue-600 checked:border-0 ring-2 ring-white/10"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="font-semibold text-white">{title}</span>
          </div>
          {Number.isFinite(price) && price > 0 && (
            <span className="font-semibold text-gray-300">
              +$
              {(priceType === "percent"
                ? ((currentSubtotal ?? 0) * (price / 100))
                : price
              ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </label>
      </div>
    </div>
  );
}

function OptionInput({ title, meta }: { title: string; meta?: DetailItem["inputMeta"] }) {
  const kind = meta?.kind === "number" ? "number" : "text";
  const [val, setVal] = React.useState(kind === "number" ? String(meta?.min ?? "") : "");
  return (
    <div className="space-y-2">
      <div className="text-white font-semibold">{title}</div>
      <input
        type={kind}
        className="input input-bordered w-full"
        value={val}
        min={kind === "number" && meta?.min != null ? Number(meta.min) : undefined}
        max={kind === "number" && meta?.max != null ? Number(meta.max) : undefined}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}

function RangeDual({ range, onRangeChange }: { range: NonNullable<DetailItem["range"]>; onRangeChange?: (from: number, to: number) => void }) {
  const min = Number.isFinite(range.min) ? range.min : 0;
  const max = Number.isFinite(range.max) ? range.max : 100;
  // Repurpose 'step' as the initial 'from' value based on user requirement
  // Actual step increment is fixed to 1
  const initialFrom = (Number.isFinite(range.step) && range.step! >= min && range.step! <= max) 
    ? range.step! 
    : min;
  const step = 1;
  
  const [from, setFrom] = React.useState(initialFrom);
  const [to, setTo] = React.useState(max);
  
  // Independent input state to allow empty string/typing
  const [fromInput, setFromInput] = React.useState(initialFrom.toString());
  const [toInput, setToInput] = React.useState(max.toString());

  const ref = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<"from" | "to" | null>(null);

  const ticks: number[] = React.useMemo(() => {
    const arr: number[] = [];
    const inc = 10;
    let v = min;
    while (v <= max) {
      arr.push(v);
      v += inc;
    }
    if (arr[arr.length - 1] !== max) arr.push(max);
    return arr;
  }, [min, max]);

  const valueToPercent = (val: number) => ((val - min) / (max - min)) * 100;

  // Use window-based events for smooth dragging even if cursor leaves the slider
  React.useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragRef.current || !ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      
      // Clamp ratio
      if (ratio < 0) ratio = 0;
      if (ratio > 1) ratio = 1;
      
      const raw = min + ratio * (max - min);
      const snapped = Math.round((raw - min) / step) * step + min;

      if (dragRef.current === "from") {
        const newVal = Math.min(snapped, to);
        setFrom(newVal);
        setFromInput(newVal.toString());
      } else {
        const newVal = Math.max(snapped, from);
        setTo(newVal);
        setToInput(newVal.toString());
      }
    };

    const handleUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [min, max, step, from, to]);

  const onPointerDown = (which: "from" | "to") => (e: React.PointerEvent) => {
    dragRef.current = which;
    // Prevent default to avoid text selection while dragging
    e.preventDefault();
  };

  const leftPct = valueToPercent(from);
  const rightPct = valueToPercent(to);

  const handleInputChange = (type: "from" | "to") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    
    if (type === "from") {
      setFromInput(valStr);
      if (valStr === "") return;
      
      const val = Number(valStr);
      if (!Number.isFinite(val)) return;

      // Clamp immediately to prevent invalid state, but allow typing
      let effectiveVal = val;
      if (effectiveVal > to) effectiveVal = to;
      // We don't clamp min while typing to allow e.g. deleting digits
      
      setFrom(effectiveVal);
    } else {
      setToInput(valStr);
      if (valStr === "") return;

      const val = Number(valStr);
      if (!Number.isFinite(val)) return;

      let effectiveVal = val;
      if (effectiveVal > max) effectiveVal = max;
      if (effectiveVal < from) effectiveVal = from;
      
      setTo(effectiveVal);
    }
  };

  const handleBlur = (type: "from" | "to") => () => {
    if (type === "from") {
      let val = Number(fromInput);
      if (!Number.isFinite(val) || fromInput === "") val = min;
      
      if (val < min) val = min;
      if (val > to) val = to;
      
      setFrom(val);
      setFromInput(val.toString());
    } else {
      let val = Number(toInput);
      if (!Number.isFinite(val) || toInput === "") val = max;
      
      if (val > max) val = max;
      if (val < from) val = from;
      
      setTo(val);
      setToInput(val.toString());
    }
  };

  React.useEffect(() => {
    if (onRangeChange) {
      onRangeChange(from, to);
    }
  }, [from, to, onRangeChange]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-[11px] text-gray-400">From Level</div>
          <input 
            type="number" 
            className="text-xl font-bold text-white bg-transparent w-full outline-none p-0 border-0 focus:ring-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={fromInput}
            onChange={handleInputChange("from")}
            onBlur={handleBlur("from")}
            min={min}
            max={to}
          />
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-[11px] text-gray-400">To Level</div>
          <input 
            type="number" 
            className="text-xl font-bold text-white bg-transparent w-full outline-none p-0 border-0 focus:ring-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={toInput}
            onChange={handleInputChange("to")}
            onBlur={handleBlur("to")}
            min={from}
            max={max}
          />
        </div>
      </div>
      
      <div
        ref={ref}
        className="relative h-6 flex items-center select-none touch-none"
      >
        {/* Base Track (White/Gray) */}
        <div className="absolute w-full h-1.5 rounded-full bg-white/20" />
        
        {/* Active Track (Blue) */}
        <div 
          className="absolute h-1.5 rounded-full bg-blue-600"
          style={{ 
            left: `${leftPct}%`, 
            width: `${rightPct - leftPct}%` 
          }}
        />

        {/* Knob From */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={from}
          tabIndex={0}
          onPointerDown={onPointerDown("from")}
          className="absolute w-5 h-5 rounded-full bg-violet-600 border-2 border-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ 
            left: `${leftPct}%`, 
            transform: 'translateX(-50%)' 
          }}
        />

        {/* Knob To */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={to}
          tabIndex={0}
          onPointerDown={onPointerDown("to")}
          className="absolute w-5 h-5 rounded-full bg-violet-600 border-2 border-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ 
            left: `${rightPct}%`, 
            transform: 'translateX(-50%)' 
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 px-1 -mt-1">
        {ticks.map((t) => (
          <span key={t} className="tabular-nums">{t}</span>
        ))}
      </div>
    </div>
  );
}

function RangeSingle({ range, title }: { range: NonNullable<DetailItem["range"]>; title: string }) {
  const min = Number.isFinite(range.min) ? range.min : 0;
  const max = Number.isFinite(range.max) ? range.max : 100;
  // Repurpose 'step' as initial value
  const initialVal = (Number.isFinite(range.step) && range.step! >= min && range.step! <= max) 
    ? range.step! 
    : min;
  const step = 1;

  const [val, setVal] = React.useState(initialVal);
  const ticks: number[] = React.useMemo(() => {
    const arr: number[] = [];
    const inc = 10;
    let v = min;
    while (v <= max) {
      arr.push(v);
      v += inc;
    }
    if (arr[arr.length - 1] !== max) arr.push(max);
    return arr;
  }, [min, max]);
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white/5 p-3 w-fit">
        <div className="text-[11px] text-gray-400">{title}</div>
        <div className="text-xl font-bold text-white">{val}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="range range-primary w-full"
      />
      <div className="flex justify-between text-[11px] text-gray-400 px-1">
        {ticks.map((t) => (
          <span key={t} className="tabular-nums">{t}</span>
        ))}
      </div>
    </div>
  );
}

export function ServiceOptions({
  details,
  onRangeChange,
  onSelectionsChange,
  currentSubtotal,
}: {
  details: DetailItem[];
  onRangeChange?: (from: number, to: number) => void;
  onSelectionsChange?: (extras: Array<{ price: number; kind: "fixed" | "percent" }>) => void;
  currentSubtotal?: number;
}) {
  if (!Array.isArray(details) || details.length === 0) return null;
  const ordered = [...details].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const extrasByItemRef = React.useRef<Map<number, Array<{ price: number; kind: "fixed" | "percent" }>>>(new Map());
  const setExtrasForItem = (id: number, extras: Array<{ price: number; kind: "fixed" | "percent" }>) => {
    extrasByItemRef.current.set(id, extras);
    const merged: Array<{ price: number; kind: "fixed" | "percent" }> = [];
    for (const v of extrasByItemRef.current.values()) {
      for (const e of v) merged.push(e);
    }
    if (onSelectionsChange) onSelectionsChange(merged);
  };
  return (
    <div className="space-y-3">
      <style jsx>{`
        input.dual-thumb {
          position: absolute;
          width: 100%;
          height: 24px;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }
        input.dual-thumb.range {
          background: transparent !important;
        }
        input.dual-thumb::-webkit-slider-runnable-track {
          background: transparent !important;
          height: 0 !important;
          border: 0 !important;
          box-shadow: none !important;
        }
        input.dual-thumb::-moz-range-track {
          background: transparent !important;
          height: 0 !important;
          border: 0 !important;
        }
        input.dual-thumb::-ms-track {
          background: transparent !important;
          border-color: transparent !important;
          color: transparent !important;
          height: 0 !important;
          box-shadow: none !important;
        }
        input.dual-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #7c3aed;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.4);
          cursor: pointer;
        }
        input.dual-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #7c3aed;
          border: 2px solid #fff;
          cursor: pointer;
        }
      `}</style>
      {ordered.map((d) => {
        if (d.inputType === "range" && d.range) {
          const dual = d.displayType === "dual" || !!d.range.dual;
          return (
            <div key={d.id} className="space-y-1">
              <div className="text-white font-semibold">{d.title}</div>
              {dual ? (
                <RangeDual 
                  range={d.range} 
                  onRangeChange={d.title.toLowerCase().includes("level") ? onRangeChange : undefined} 
                />
              ) : (
                <RangeSingle range={d.range} title={d.title} />
              )}
            </div>
          );
        }
        if ((d.inputType === "select" || d.inputType === "radio" || d.inputType === "checkbox") && Array.isArray(d.options) && d.options.length > 0) {
          return (
            <div key={d.id} className="space-y-1">
              {d.inputType === "select" && <OptionSelect id={d.id} title={d.title} options={d.options} onChangeExtras={(extras) => setExtrasForItem(d.id, extras)} />}
              {d.inputType === "radio" && <OptionRadio id={d.id} title={d.title} options={d.options} priceType={d.priceType} currentSubtotal={currentSubtotal} onChangeExtras={(extras) => setExtrasForItem(d.id, extras)} />}
              {d.inputType === "checkbox" && <OptionCheckboxGroup id={d.id} title={d.title} options={d.options} onChangeExtras={(extras) => setExtrasForItem(d.id, extras)} />}
            </div>
          );
        }
        if (d.inputType === "checkbox" && (!Array.isArray(d.options) || d.options.length === 0)) {
          return (
            <div key={d.id} className="space-y-1">
              <OptionSingleCheckbox id={d.id} title={d.title} price={d.price} priceType={d.priceType} currentSubtotal={currentSubtotal} onChangeExtras={(extras) => setExtrasForItem(d.id, extras)} />
            </div>
          );
        }
        if (d.inputType === "input") {
          return (
            <div key={d.id} className="space-y-1">
              <OptionInput title={d.title} meta={d.inputMeta} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
