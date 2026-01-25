"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
      } catch {}
      setError("Incorrect email or password");
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#1E293B] rounded-3xl shadow-2xl overflow-hidden border border-white/5">
        {/* Left Side - Image/Branding */}
        <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-primary/20 to-secondary/20 p-12 justify-between">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <Image src="/icons/logo.png" alt="Gamingqu" width={140} height={40} className="object-contain" />
            </Link>
          </div>
          
          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">Level Up Your Gaming Experience</h2>
            <p className="text-gray-300 text-lg">Join thousands of gamers who trust Gamingqu for their boosting needs. Safe, fast, and reliable.</p>
          </div>
          
          <div className="relative z-10 flex gap-2">
             <div className="h-1 w-12 bg-primary rounded-full"></div>
             <div className="h-1 w-4 bg-white/20 rounded-full"></div>
             <div className="h-1 w-4 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#1E293B]">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
              <p className="text-gray-400">Please sign in to access your account</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input input-bordered w-full pl-10 bg-[#0F172A] border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 rounded-xl"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input input-bordered w-full pl-10 bg-[#0F172A] border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 rounded-xl"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-error bg-red-500/10 border-red-500/20 text-red-400 text-sm rounded-xl py-3 px-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="checkbox checkbox-sm checkbox-primary rounded-md border-gray-600"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot" className="text-sm text-primary hover:text-primary-focus font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-none w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.01]"
              >
                {loading ? <span className="loading loading-spinner loading-md"></span> : "Sign In"}
                {!loading && <FiArrowRight className="h-5 w-5 ml-2" />}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1E293B] text-gray-500 uppercase font-semibold tracking-wider">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="btn btn-outline border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 text-white h-12 rounded-xl normal-case font-medium"
              >
                <FcGoogle size={20} className="mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/" })}
                className="btn bg-[#5865F2] hover:bg-[#4752c4] text-white border-none h-12 rounded-xl normal-case font-medium"
              >
                <SiDiscord size={20} className="mr-2" />
                Discord
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary-focus font-bold transition-colors">
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
