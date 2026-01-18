"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Registrasi berhasil, silakan login.");
      setTimeout(() => (window.location.href = "/login"), 800);
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data?.error ?? "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
        <div className="px-8 pt-8">
          <h1 className="text-3xl font-bold text-center mb-6">Daftar akun</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900 border-zinc-800"
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
            {message && <p className="text-sm text-zinc-400">{message}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500">
              {loading ? "Memproses..." : "Buat akun"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
