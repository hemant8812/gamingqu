"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  OAuthSignin: "Konfigurasi OAuth tidak lengkap atau provider tidak tersedia.",
  OAuthCallback: "Callback dari penyedia OAuth gagal diproses.",
  OAuthCreateAccount: "Gagal membuat akun dari data OAuth.",
  EmailCreateAccount: "Gagal membuat akun dari email.",
  Callback: "Terjadi kesalahan pada callback.",
  OAuthAccountNotLinked: "Email sudah terdaftar. Silakan login dengan metode yang sama.",
  SessionRequired: "Sesi diperlukan untuk mengakses halaman ini.",
  Default: "Terjadi kesalahan. Silakan coba lagi.",
};

export default function AuthErrorPage() {
  const params = useSearchParams();
  const code = params.get("error") || "Default";
  const message = messages[code] || messages.Default;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0E17] p-6">
      <div className="max-w-md w-full glass-card rounded-2xl p-6 text-center border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
        <p className="text-gray-300 mb-1">{message}</p>
        <p className="text-gray-500 text-sm mb-6">Kode: {code}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="btn btn-gaming">Kembali ke Login</Link>
          <Link href="/" className="btn glass-light border-white/10">Beranda</Link>
        </div>
      </div>
    </div>
  );
}
