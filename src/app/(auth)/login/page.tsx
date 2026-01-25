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
    <div className="min-h-screen bg-base-200 text-base-content pt-16">
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
              <div key={i} className="relative rounded-box h-36 overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image src={src} alt="" fill className="object-cover" unoptimized sizes="150px" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col">
          <div className="flex items-center justify-center py-2 gap-2 mb-8">
            <Image src="/icons/logo.png" alt="Gamingqu" width={120} height={28} />
            <div className="text-sm">
              <span className="opacity-70">First time here?</span>{" "}
              <Link href="/register" className="link link-primary no-underline font-bold hover:underline">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-start lg:items-start justify-center">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Welcome back</h1>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="form-control">
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 h-4 w-4 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="input input-bordered w-full pl-10"
                        required
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 h-4 w-4 pointer-events-none" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="input input-bordered w-full pl-10"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  {error && <div className="alert alert-error text-sm py-2">{error}</div>}
                  <div className="flex items-center justify-between">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span className="label-text">Remember me</span>
                    </label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? <span className="loading loading-spinner loading-sm"></span> : "Log in"}
                      {!loading && <FiArrowRight className="h-4 w-4 ml-2" />}
                    </button>
                  </div>
                </form>
                <div className="divider">OR</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="btn btn-outline hover:bg-base-200 hover:text-base-content border-base-300"
                  >
                    <FcGoogle size={18} className="mr-2" />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => signIn("discord", { callbackUrl: "/" })}
                    className="btn bg-[#5865F2] hover:bg-[#4752c4] text-white border-none"
                  >
                    <SiDiscord size={18} className="mr-2" />
                    Discord
                  </button>
                </div>
                <p className="mt-6 text-center text-xs">
                  <Link href="/forgot" className="link link-hover text-base-content/60 hover:text-primary">
                    Forgot password
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageToast message={toastMessage} type="error" />
    </div>
  );
}
