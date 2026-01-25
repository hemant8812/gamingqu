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
      <label htmlFor={name} className="block text-sm font-semibold">{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder="Otomatis dari Nama, bisa diubah"
        className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
        ref={inputRef}
        onInput={() => setLocked(false)}
        defaultValue={initialValue}
      />
      <div className="mt-1 text-xs text-zinc-500">Otomatis dari Nama; bisa disesuaikan manual. Panjang maksimum {maxLen} karakter.</div>
    </div>
  );
}
