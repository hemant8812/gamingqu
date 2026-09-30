"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  nameInputId?: string;
  name?: string;
  label?: string;
  maxLen?: number;
  initialValue?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AutoSlugField({
  nameInputId = "name",
  name = "slug",
  label = "Slug",
  maxLen = 60,
  initialValue = "",
  className,
}: Props & { className?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    let stop = false;
    let attachedEl: HTMLInputElement | null = null;
    let syncRef: ((this: HTMLInputElement, ev: Event) => void) | null = null;
    const tryAttach = () => {
      if (stop) return;
      const nameEl = document.getElementById(nameInputId) as HTMLInputElement | null;
      if (!nameEl || !inputRef.current) return;
      const sync = () => {
        if (!inputRef.current) return;
        if (!locked) return;
        const s = slugify(nameEl.value);
        const trimmed = s.length > maxLen ? s.slice(0, maxLen).replace(/-+$/, "") : s;
        inputRef.current.value = trimmed;
      };
      // initial fill only if empty to allow defaultValue
      if (!inputRef.current.value) {
        sync();
      }
      // attach listener
      nameEl.addEventListener("input", sync);
      attachedEl = nameEl;
      syncRef = sync;
      stop = true;
    };
    // attempt immediately
    tryAttach();
    // if not found yet, retry until it appears
    const interval = setInterval(() => {
      if (stop) {
        clearInterval(interval);
        return;
      }
      tryAttach();
      if (stop) {
        clearInterval(interval);
      }
    }, 100);
    // safety timeout
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (attachedEl) {
        attachedEl.removeEventListener("input", syncRef as EventListener);
      }
    };
  }, [nameInputId, locked, maxLen]);

  return (
    <div className={className ?? "mt-3"}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder="e.g. rank-boost-pvp"
        className="w-full h-11 px-4 bg-ink-900 border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        ref={inputRef}
        onInput={() => setLocked(false)}
        defaultValue={initialValue}
      />
    </div>
  );
}
