"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiUser, FiAtSign, FiMail, FiLock, FiAward } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";
import { Users, Star } from "lucide-react";
import { PageToast } from "@/components/shared/PageToast";
import { SITE_DEFAULTS } from "@/lib/constants";

export default function RegisterPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError("Username is required");
      setToastType("error");
      setToastMessage("Registration failed: Username is required");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      setToastType("error");
      setToastMessage("Registration failed: Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          username: username.trim(),
          name: name.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Registration failed");
        setToastType("error");
        setToastMessage(`Registration failed: ${data?.error ?? "An error occurred"}`);
        return;
      }
      setToastType("success");
      setToastMessage("Registration successful, please login");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="particles" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10">

        {/* Left Side - Image/Branding */}
        <div className="hidden lg:flex flex-col relative p-8 justify-between overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-900/80 via-brand-900/60 to-brand-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />

          {/* Top - Logo */}
          <div className="relative z-10 flex justify-end">
            <Link href="/" className="inline-block">
              <Image src="/icons/logo.png" alt={SITE_DEFAULTS.name} width={140} height={40} className="object-contain" />
            </Link>
          </div>

          {/* Middle - Content */}
          <div className="relative z-10 max-w-md ml-auto text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-accent-300 font-medium mb-6">
              <Star className="h-4 w-4" />
              Join the Elite
            </div>
            <h2 className="text-3xl font-black text-white mb-3 leading-tight">
              Start Your <span className="gradient-text">Journey</span> Today
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Create an account to unlock exclusive features, track your orders, and become a part of the elite gaming community.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 justify-end">
              <div className="flex items-center gap-2 text-brand-400 text-sm">
                <Users className="h-5 w-5" />
                <span>50K+ Members</span>
              </div>
              <div className="flex items-center gap-2 text-accent-400 text-sm">
                <FiAward className="h-5 w-5" />
                <span>Top Rated</span>
              </div>
            </div>
          </div>

          {/* Bottom - Progress dots */}
          <div className="relative z-10 flex gap-2 justify-end">
            <div className="h-1 w-4 bg-white/20 rounded-full" />
            <div className="h-1 w-4 bg-white/20 rounded-full" />
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-accent-500 to-brand-500" />
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="p-5 lg:p-6 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-4">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-black text-white mb-2">
                Create <span className="gradient-text">Account</span>
              </h1>
              <p className="text-gray-400">Join us and level up your game</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-3">
              {/* Name & Username Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FiUser className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input w-full pl-10 h-11 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] text-sm"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300 mb-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FiAtSign className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      className="input w-full pl-10 h-11 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] text-sm"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
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
                    placeholder="john@example.com"
                    className="input w-full pl-10 h-11 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Create a password"
                    className="input w-full pl-10 h-11 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] text-sm"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FiLock className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                  </div>
                  <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    className="input w-full pl-10 h-11 bg-ink-900 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] text-sm"
                    required
                    autoComplete="new-password"
                  />
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

              {/* Terms Checkbox */}
              <div className="form-control">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="checkbox checkbox-sm border-2 border-gray-600 checked:border-brand-500 checked:bg-brand-500 rounded-md mt-0.5"
                  />
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                    I agree to the{" "}
                    <Link href="/terms" className="text-brand-400 hover:text-brand-300 hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-brand-400 hover:text-brand-300 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-gaming w-full h-11 text-base font-bold rounded-xl"
              >
                {loading ? <span className="loading loading-spinner loading-md" /> : "Create Account"}
                {!loading && <FiArrowRight className="h-5 w-5 ml-2" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-500 uppercase font-semibold tracking-wider backdrop-blur-sm">Or register with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="btn glass-light border-white/10 hover:border-white/20 hover:bg-white/10 text-white h-10 rounded-xl normal-case font-medium transition-all text-sm"
              >
                <FcGoogle size={20} className="mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/" })}
                className="btn bg-[#5865F2] hover:bg-[#4752c4] text-white border-none h-10 rounded-xl normal-case font-medium transition-all hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] text-sm"
              >
                <SiDiscord size={20} className="mr-2" />
                Discord
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <PageToast message={toastMessage} type={toastType} />
    </div>
  );
}

