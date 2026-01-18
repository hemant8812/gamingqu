"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Implementasi pendaftaran backend belum tersedia; arahkan ke login
      setTimeout(() => {
        window.location.href = "/login";
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="hidden lg:block relative">
          <div className="rounded-[24px] overflow-hidden ring-1 ring-white/10 w-full h-[28rem]">
            <img
              src="https://picsum.photos/seed/register-hero/1000/700"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="relative flex flex-col">
          <div className="flex items-center justify-center py-6 gap-2">
            <Image src="/icons/logo.png" alt="Gamingqu" width={120} height={28} />
            <div className="text-sm">
              <span className="text-zinc-400">Already have an account?</span>{" "}
              <Link href="/login" className="rounded-md bg-zinc-800 text-white text-xs px-3 py-1">
                Log in
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-start lg:items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Create your account</h1>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Re-Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex items-center justify-between">
                  <Label htmlFor="consent" className="text-xs text-zinc-400">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      required
                      className="h-4 w-4 border border-zinc-800 bg-zinc-900"
                    />
                    <span>I agree to Privacy & Terms</span>
                  </Label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                  >
                    {loading ? "Processing..." : "Sign up"}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
