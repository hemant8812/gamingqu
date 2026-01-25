"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        body: JSON.stringify({ email, password, username, name }),
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
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="hidden lg:block relative">
          <div className="relative rounded-[24px] overflow-hidden ring-1 ring-white/10 w-full h-[28rem]">
            <Image
              src="https://picsum.photos/seed/register-hero/1000/700"
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="relative flex flex-col">
          <div className="flex items-center justify-center py-2 gap-2">
            <Image src="/icons/logo.png" alt="Gamingqu" width={120} height={28} />
            <div className="text-sm">
              <span className="text-zinc-400">Already have an account?</span>{" "}
              <Link href="/login" className="rounded-md bg-zinc-800 text-white text-xs px-3 py-1">
                Log in
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-start lg:items-start justify-center">
            <div className="w-full max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Create your account</h1>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
                    <Input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className="bg-zinc-900 border-zinc-800 h-12 rounded-xl placeholder-semibold pl-10"
                      required
                    />
                  </div>
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
      <PageToast message={toastMessage} type={toastType} />
    </div>
  );
}
