"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-xl border-zinc-800 bg-zinc-950 p-8">
        <h1 className="text-2xl font-bold mb-4">Ajukan menjadi Booster</h1>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivation">Motivasi</Label>
            <Input
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
              placeholder="Ceritakan pengalaman dan alasan Anda"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500">
            {loading ? "Mengirim..." : "Kirim pengajuan"}
          </Button>
          {status && <p className="text-sm text-zinc-400">{status}</p>}
        </form>
      </Card>
    </div>
  );
}
