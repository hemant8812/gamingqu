"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

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
      setError("Email atau password salah");
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="hidden lg:block w-1/2 p-10">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-40 bg-gradient-to-br from-purple-700/40 to-blue-600/40"
            />
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
          <div className="px-8 pt-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Image src="/next.svg" alt="logo" width={90} height={20} className="invert" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-6">Welcome back</h1>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800"
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
                  className="bg-zinc-900 border-zinc-800"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex items-center justify-between">
                <Link href="/forgot" className="text-sm text-zinc-400 hover:text-white">
                  Lupa password
                </Link>
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500">
                  {loading ? "Memproses..." : "Log in"}
                </Button>
              </div>
            </form>
            <div className="mt-6 text-center text-sm text-zinc-400">
              Pertama kali di sini?{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-zinc-500">
              Dengan login, Anda menyetujui Terms dan Privacy Policy kami.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
