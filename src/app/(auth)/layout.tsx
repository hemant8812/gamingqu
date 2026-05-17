import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0E17",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
