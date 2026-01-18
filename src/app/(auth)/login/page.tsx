"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password");
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
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
              <div key={i} className="rounded-[24px] h-36 overflow-hidden ring-1 ring-white/10">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col">
          <div className="flex items-center justify-center py-6 gap-4">
            <Image src="/next.svg" alt="logo" width={100} height={22} className="invert" />
            <div className="text-sm">
              <span className="text-zinc-400">First time here?</span>{" "}
              <Link href="/register" className="rounded-md bg-zinc-800 text-white text-xs px-3 py-1">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-start lg:items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Welcome back</h1>
              <form onSubmit={onSubmit} className="space-y-4">
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex items-center justify-between">
                  <Link href="/forgot" className="text-sm text-zinc-400 hover:text-white">
                    Forgot password
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                  >
                    {loading ? "Processing..." : "Log in"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
              <p className="mt-8 text-center text-xs text-zinc-500">
                By logging in, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
