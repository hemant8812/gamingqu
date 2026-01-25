"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiUser, FiAtSign, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";
import { PageToast } from "@/components/shared/PageToast";

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
      setError("Username wajib diisi");
      setToastType("error");
      setToastMessage("Registrasi gagal: Username wajib diisi");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      setToastType("error");
      setToastMessage("Registrasi gagal: Password tidak sama");
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
        setToastMessage(`Registrasi gagal: ${data?.error ?? "Terjadi kesalahan"}`);
        return;
      }
      setToastType("success");
      setToastMessage("Registrasi berhasil, silakan login");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#1E293B] rounded-3xl shadow-2xl overflow-hidden border border-white/5">
        
        {/* Left Side - Image/Branding */}
        <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-secondary/20 to-primary/20 p-12 justify-between order-2">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/gaming-register/1000/1000')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex justify-end">
             <Link href="/" className="inline-block">
               <Image src="/icons/logo.png" alt="Gamingqu" width={140} height={40} className="object-contain" />
             </Link>
          </div>
          
          <div className="relative z-10 max-w-md ml-auto text-right">
            <h2 className="text-4xl font-bold text-white mb-4">Start Your Journey Today</h2>
            <p className="text-gray-300 text-lg">Create an account to unlock exclusive features, track your orders, and become a part of the elite gaming community.</p>
          </div>
          
          <div className="relative z-10 flex gap-2 justify-end">
             <div className="h-1 w-4 bg-white/20 rounded-full"></div>
             <div className="h-1 w-4 bg-white/20 rounded-full"></div>
             <div className="h-1 w-12 bg-secondary rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Register Form (Actually Left in Grid, but logically Right side of interaction) */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#1E293B] order-1">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-gray-400">Join us and level up your game</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input input-bordered w-full pl-10 bg-[#0F172A] border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 rounded-xl"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-300">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiAtSign className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      className="input input-bordered w-full pl-10 bg-[#0F172A] border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 rounded-xl"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="john@example.com"
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
                    placeholder="Create a password"
                    className="input input-bordered w-full pl-10 bg-[#0F172A] border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 rounded-xl"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    className="input input-bordered w-full pl-10 bg-[#0F172A] border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 rounded-xl"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error bg-red-500/10 border-red-500/20 text-red-400 text-sm rounded-xl py-3 px-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        id="consent"
                        name="consent"
                        type="checkbox"
                        required
                        className="checkbox checkbox-sm checkbox-primary rounded-md border-gray-600"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
                 </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
              >
                {loading ? <span className="loading loading-spinner loading-md"></span> : "Create Account"}
                {!loading && <FiArrowRight className="h-5 w-5 ml-2" />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1E293B] text-gray-500 uppercase font-semibold tracking-wider">Or register with</span>
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

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary-focus font-bold transition-colors">
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
