"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, createContext, useContext, useMemo, useState } from "react";

function SuspendedGuard() {
  const { data: session, status } = useSession();
  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) return;
    if (status === "authenticated" && (session?.user as Record<string, unknown>)?.isSuspended === true) {
      triggered.current = true;
      signOut({ callbackUrl: "/" });
    }
  }, [status, session]);
  return null;
}

type CurrencySymbol = "$" | "€";
type CurrencyContextValue = {
  symbol: CurrencySymbol;
  setSymbol: (s: CurrencySymbol) => void;
  eurPerUsd: number;
  convert: (amount: number) => number;
};
const CurrencyContext = createContext<CurrencyContextValue | null>(null);
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return { symbol: "$", setSymbol: () => {}, eurPerUsd: 1, convert: (n) => n };
  }
  return ctx;
}

export function Providers({ children, eurPerUsd = 1 }: PropsWithChildren<{ eurPerUsd?: number }>) {
  const [symbol, setSymbol] = useState<CurrencySymbol>("$");
  const rate = Number.isFinite(eurPerUsd) && eurPerUsd > 0 ? eurPerUsd : 1;
  const value = useMemo<CurrencyContextValue>(() => ({
    symbol,
    setSymbol,
    eurPerUsd: rate,
    convert: (amount: number) => {
      const base = typeof amount === "string" ? parseFloat(amount) : amount;
      if (!Number.isFinite(base)) return 0;
      return symbol === "€" ? base * rate : base;
    },
  }), [symbol, rate]);
  useEffect(() => {
    try {
      const s = window.localStorage.getItem("currency_symbol");
      if (s === "€" || s === "$") setSymbol(s as CurrencySymbol);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem("currency_symbol", symbol);
    } catch {}
  }, [symbol]);
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <SuspendedGuard />
      <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
    </SessionProvider>
  );
}
