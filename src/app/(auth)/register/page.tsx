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
    <div className="min-h-screen bg-base-200 text-base-content pt-16">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="hidden lg:block relative">
          <div className="relative rounded-box overflow-hidden shadow-xl w-full h-[28rem]">
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
          <div className="flex items-center justify-center py-2 gap-2 mb-8">
            <Image src="/icons/logo.png" alt="Gamingqu" width={120} height={28} />
            <div className="text-sm">
              <span className="opacity-70">Already have an account?</span>{" "}
              <Link href="/login" className="link link-primary no-underline font-bold hover:underline">
                Log in
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-start lg:items-start justify-center">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Create your account</h1>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 h-4 w-4 pointer-events-none" />
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="input input-bordered w-full pl-10"
                          required
                          autoComplete="name"
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <div className="relative">
                        <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 h-4 w-4 pointer-events-none" />
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Username"
                          className="input input-bordered w-full pl-10"
                          required
                          autoComplete="username"
                          autoCapitalize="none"
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>
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
                          autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 h-4 w-4 pointer-events-none" />
                      <input
                        id="confirm"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        className="input input-bordered w-full pl-10"
                        required
                          autoComplete="new-password"
                      />
                    </div>
                  </div>
                  {error && <div className="alert alert-error text-sm py-2">{error}</div>}
                  <div className="flex items-center justify-between">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        id="consent"
                        name="consent"
                        type="checkbox"
                        required
                        className="checkbox checkbox-xs checkbox-primary"
                      />
                      <span className="label-text text-xs">I agree to Privacy & Terms</span>
                    </label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? <span className="loading loading-spinner loading-sm"></span> : "Sign up"}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageToast message={toastMessage} type={toastType} />
    </div>
  );
}
