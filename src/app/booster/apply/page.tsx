"use client";
import { useState } from "react";

export default function BoosterApplyPage() {
  const [motivation, setMotivation] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/booster/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivation }),
    });
    setLoading(false);
    if (res.ok) {
      setStatus("Pengajuan dikirim. Menunggu persetujuan admin.");
      setMotivation("");
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus(data?.error ?? "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center p-6">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-8">
            <h1 className="text-2xl font-bold mb-4">Ajukan menjadi Booster</h1>
            <form onSubmit={submit} className="space-y-4">
            <div className="form-control">
                <label className="label" htmlFor="motivation">
                    <span className="label-text">Motivasi</span>
                </label>
                <input
                id="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Ceritakan pengalaman dan alasan Anda"
                required
                />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Kirim pengajuan"}
            </button>
            {status && <div className="alert alert-info text-sm py-2">{status}</div>}
            </form>
        </div>
      </div>
    </div>
  );
}
