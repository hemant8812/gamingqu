"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight, FiMail, FiLock, FiShield } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { Sparkles, Zap } from "lucide-react";
import { PageToast } from "@/components/shared/PageToast";
import { SITE_DEFAULTS } from "@/lib/constants";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/post-login");
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
      } catch { }
    } else {
      try {
        localStorage.removeItem("rememberEmail");
      } catch { }
    }
    const res = await signIn("credentials", {
      email: email.trim(),
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
      } catch { }
      setError("Incorrect email or password");
      return;
    }
    window.location.href = "/post-login";
  };

  return (
    <div className="h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="particles" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10">
        {/* Left Side - Image/Branding */}
        <div className="hidden lg:flex flex-col relative p-8 justify-between overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-900/60 to-accent-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />

          {/* Top - Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <Image src="/icons/logo.png" alt={SITE_DEFAULTS.name} width={140} height={40} className="object-contain" style={{ height: 40, width: "auto", maxWidth: 220 }} />
            </Link>
          </div>

          {/* Middle - Content */}
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-brand-300 font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Premium Gaming Services
            </div>
            <h2 className="text-3xl font-black text-white mb-3 leading-tight">
              <span className="gradient-text">Level Up</span> Your Gaming Experience
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Join thousands of gamers who trust {SITE_DEFAULTS.name} for their boosting needs. Safe, fast, and reliable.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <FiShield className="h-5 w-5" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-accent-400 text-sm">
                <Zap className="h-5 w-5" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Bottom - Progress dots */}
          <div className="relative z-10 flex gap-2">
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            <div className="h-1 w-4 bg-white/20 rounded-full" />
            <div className="h-1 w-4 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 lg:p-8 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-5">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-black text-white mb-2">
                Welcome <span className="gradient-text">Back!</span>
              </h1>
              <p className="text-gray-400">Please sign in to access your account</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Email Input */}
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FiMail className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input w-full pl-11 h-12 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input w-full pl-11 h-12 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="glass-light rounded-xl py-3 px-4 flex items-center gap-3 border border-red-500/30">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="checkbox checkbox-sm border-2 border-gray-600 checked:border-brand-500 checked:bg-brand-500 rounded-md"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot" className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gaming w-full h-12 text-base font-bold rounded-xl"
              >
                {loading ? <span className="loading loading-spinner loading-md" /> : "Sign In"}
                {!loading && <FiArrowRight className="h-5 w-5 ml-2" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-500 uppercase font-semibold tracking-wider backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/post-login" })}
                className="btn glass-light border-white/10 hover:border-white/20 hover:bg-white/10 text-white h-12 rounded-xl normal-case font-medium transition-all"
              >
                <FcGoogle size={22} className="mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/post-login" })}
                className="btn bg-[#5865F2] hover:bg-[#4752c4] text-white border-none h-12 rounded-xl normal-case font-medium transition-all hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]"
              >
                <SiDiscord size={22} className="mr-2" />
                Discord
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>
      </div>
      <PageToast message={toastMessage} type="error" />
    </div>
  );
}

