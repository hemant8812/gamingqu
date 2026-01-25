"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight, FiMail, FiLock } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { PageToast } from "@/components/shared/PageToast";


export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);
  const [email, setEmail] = useState<string>(() => (typeof window !== "undefined" ? localStorage.getItem("rememberEmail") ?? "" : ""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState<boolean>(() => (typeof window !== "undefined" ? !!localStorage.getItem("rememberEmail") : false));
  const [toastMessage] = useState<string | undefined>(undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (remember) {
      try {
        localStorage.setItem("rememberEmail", email);
      } catch {}
    } else {
      try {
        localStorage.removeItem("rememberEmail");
      } catch {}
    }
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      try {
        const r = await fetch("/api/auth/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (r.ok) {
          const data = await r.json();
          if (data?.exists && data?.isSuspended) {
            setError("Akun Anda telah disuspend. Silakan hubungi admin untuk informasi lebih lanjut.");
            return;
          }
        }
      } catch {}
      setError("Incorrect email or password");
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="hidden lg:block relative">
          <div className="grid grid-cols-3 gap-4">
            {[
              "https://picsum.photos/seed/gaming1/400/240",
              "https://picsum.photos/seed/gaming2/400/240",
              "https://picsum.photos/seed/gaming3/400/240",
              "https://picsum.photos/seed/gaming4/400/240",
              "https://picsum.photos/seed/gaming5/400/240",
              "https://picsum.photos/seed/gaming6/400/240",
              "https://picsum.photos/seed/gaming7/400/240",
              "https://picsum.photos/seed/gaming8/400/240",
              "https://picsum.photos/seed/gaming9/400/240",
            ].map((src, i) => (
              <div key={i} className="relative rounded-[24px] h-36 overflow-hidden ring-1 ring-white/10">
                <Image src={src} alt="" fill className="object-cover" unoptimized sizes="150px" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col">
          <div className="flex items-center justify-center py-2 gap-2">
            <Image src="/icons/logo.png" alt="Gamingqu" width={120} height={28} />
            <div className="text-sm">
              <span className="text-zinc-400">First time here?</span>{" "}
              <Link href="/register" className="rounded-md bg-zinc-800 text-white text-xs px-3 py-1">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-start lg:items-start justify-center">
            <div className="w-full max-w-md">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Welcome back</h1>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold pl-10"
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex items-center justify-between">
                  <Label htmlFor="remember" className="text-sm text-zinc-400">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 border border-zinc-800 bg-zinc-900"
                    />
                    <span>Remember me</span>
                  </Label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                  >
                    {loading ? "Processing..." : "Log in"}
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="rounded-md bg-white text-black px-4 py-2.5 text-sm font-semibold hover:bg-zinc-200 inline-flex items-center justify-center gap-2"
                >
                  <FcGoogle size={18} />
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => signIn("discord", { callbackUrl: "/" })}
                  className="rounded-md bg-[#5865F2] text-white px-4 py-2.5 text-sm font-semibold hover:brightness-110 inline-flex items-center justify-center gap-2"
                >
                  <SiDiscord size={18} className="text-white" />
                  Discord
                </button>
              </div>
              <p className="mt-6 text-center text-xs">
                <Link href="/forgot" className="text-zinc-400 hover:text-white">
                  Forgot password
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <PageToast message={toastMessage} type="error" />
    </div>
  );
}
