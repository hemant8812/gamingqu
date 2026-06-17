"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  OAuthSignin: "OAuth configuration is incomplete or the provider is unavailable.",
  OAuthCallback: "Callback from the OAuth provider failed to process.",
  OAuthCreateAccount: "Failed to create account from OAuth data.",
  EmailCreateAccount: "Failed to create account from email.",
  Callback: "An error occurred on callback.",
  OAuthAccountNotLinked: "Email is already registered. Please log in using the same method.",
  SessionRequired: "A session is required to access this page.",
  Default: "An error occurred. Please try again.",
};

export default function AuthErrorPage() {
  const params = useSearchParams();
  const code = params.get("error") || "Default";
  const message = messages[code] || messages.Default;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0E17] p-6">
      <div className="max-w-md w-full glass-card rounded-2xl p-6 text-center border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
        <p className="text-gray-300 mb-1">{message}</p>
        <p className="text-gray-500 text-sm mb-6">Code: {code}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="btn btn-gaming">Back to Login</Link>
          <Link href="/" className="btn glass-light border-white/10">Home</Link>
        </div>
      </div>
    </div>
  );
}
