"use client";
import * as React from "react";
import { Toaster, toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "info";

export function PageToast({ message, type = "success" }: { message?: string; type?: ToastType }) {
  const lastShownRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (!message) return;
    if (lastShownRef.current === message) return;
    lastShownRef.current = message;
    const fn =
      type === "error" ? sonnerToast.error : type === "info" ? sonnerToast : sonnerToast.success;
    fn(message, {
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
  }, [message, type]);
  return <Toaster position="top-center" richColors theme="dark" />;
}
