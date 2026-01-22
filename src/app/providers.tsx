"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";

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

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <SuspendedGuard />
      {children}
    </SessionProvider>
  );
}
