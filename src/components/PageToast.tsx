"use client";
import * as React from "react";
import { Toaster, toast as sonnerToast } from "sonner";

export function PageToast({ message }: { message?: string }) {
  const lastShownRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (!message) return;
    if (lastShownRef.current === message) return;
    lastShownRef.current = message;
    sonnerToast.success(message, {
      duration: 3000,
      position: "top-center",
    });
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("toast")) {
        url.searchParams.delete("toast");
        history.replaceState(null, "", url.toString());
      }
    } catch {}
  }, [message]);
  return <Toaster position="top-center" richColors theme="dark" />;
}
