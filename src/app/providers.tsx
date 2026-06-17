"use client";

if (typeof window !== "undefined") {
  (function() {
    // 1. Intercept global error events during capture phase to prevent overlays
    window.addEventListener('error', function(event) {
      try {
        var filename = event.filename || '';
        var error = event.error;
        var message = event.message || '';
        if (
          filename.indexOf('tawk.to') !== -1 || 
          filename.indexOf('tawk') !== -1 ||
          message === 'true' ||
          (message as any) === true ||
          (error && (error.message === 'true' || error.message === true || (error.stack && (error.stack.indexOf('tawk') !== -1))))
        ) {
          event.stopImmediatePropagation();
          event.preventDefault();
        }
      } catch(e) {}
    }, true);

    window.addEventListener('unhandledrejection', function(event) {
      try {
        var reason = event.reason;
        if (reason) {
          var stack = reason.stack || '';
          var message = reason.message || '';
          if (
            stack.indexOf('tawk.to') !== -1 || 
            stack.indexOf('tawk') !== -1 ||
            message === 'true' ||
            message === true
          ) {
            event.stopImmediatePropagation();
            event.preventDefault();
          }
        }
      } catch(e) {}
    }, true);

    // 2. Wrap console.error and defineProperty to filter tawk errors
    function wrap(fn: any) {
      if (typeof fn !== 'function') return fn;
      if ((fn as any).__wrapped) return fn;
      var wrapped = function(this: any) {
        try {
          var stack = new Error().stack || '';
          if (stack.indexOf('tawk.to') !== -1 || stack.indexOf('tawk') !== -1) {
            return;
          }
        } catch (e) {}

        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (arg === true || arg === 'true') {
            return;
          }
          if (arg && typeof arg === 'object') {
            try {
              if (arg.message === 'true' || arg.message === true) {
                return;
              }
              if (arg.stack && (arg.stack.indexOf('tawk.to') !== -1 || arg.stack.indexOf('tawk') !== -1)) {
                return;
              }
            } catch (e) {}
          }
          if (typeof arg === 'string' && (arg.indexOf('tawk.to') !== -1 || arg.indexOf('tawk') !== -1)) {
            return;
          }
        }
        return fn.apply(this, arguments);
      };
      (wrapped as any).__wrapped = true;
      return wrapped;
    }

    var currentError = wrap(console.error);
    Object.defineProperty(console, 'error', {
      get: function() { return currentError; },
      set: function(val) {
        currentError = wrap(val);
      },
      configurable: true,
      enumerable: true
    });

    var origDefineProperty = Object.defineProperty;
    Object.defineProperty = function<T>(obj: T, prop: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>): T {
      if (obj === console && prop === 'error') {
        if (descriptor.value) {
          descriptor.value = wrap(descriptor.value);
        } else if (descriptor.get) {
          var origGet = descriptor.get;
          descriptor.get = function() {
            return wrap(origGet());
          };
        }
      }
      return origDefineProperty(obj, prop, descriptor);
    };
  })();
}
import { SessionProvider, useSession, signOut } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, createContext, useContext, useMemo, useState } from "react";

function SuspendedGuard() {
  const { data: session, status } = useSession();
  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) return;
    if (status === "authenticated" && (session?.user as any)?.isSuspended === true) {
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
  const initializedRef = useRef(false);
  useEffect(() => {
    try {
      const s = window.localStorage.getItem("currency_symbol");
      if (s === "€" || s === "$") {
        setTimeout(() => setSymbol(s as CurrencySymbol), 0);
      }
    } catch {}
    initializedRef.current = true;
  }, []);
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
    if (!initializedRef.current) return;
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
