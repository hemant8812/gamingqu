'use client';
import Image from "next/image";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export function AvatarUpload({ initialUrl, initialLetter }: { initialUrl: string | null; initialLetter: string }) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const uploadFile = async (file: File) => {
    try {
      setBusy(true);
      const fd = new FormData();
      fd.set("avatar", file);
      await fetch("/api/dashboard/profile/avatar", {
        method: "POST",
        body: fd,
      });
      setBusy(false);
      router.replace("/dashboard/profile?toast=info_updated");
      router.refresh();
    } catch {
      setBusy(false);
      router.replace("/dashboard/profile?toast=error");
      router.refresh();
    }
  };

  return (
    <div className="group relative w-16 h-16 rounded-xl overflow-hidden">
      <input
        ref={inputRef}
        id="avatar"
        name="avatar"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            setError("Max size 5MB");
            e.currentTarget.value = "";
            return;
          }
          setError(null);
          const url = URL.createObjectURL(file);
          setPreview(url);
          uploadFile(file);
        }}
      />
      <div className="w-full h-full bg-white/10 flex items-center justify-center text-white text-xl font-bold relative">
        {preview ? (
          <Image src={preview} alt="Avatar" fill className="object-cover" unoptimized />
        ) : (
          <span>{initialLetter}</span>
        )}
        <button
          type="button"
          aria-label="Edit avatar"
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          onClick={() => !busy && inputRef.current?.click()}
        >
          <Pencil className="h-5 w-5 text-white" />
        </button>
      </div>
      {error && <div className="mt-1 text-[10px] text-red-400">{error}</div>}
    </div>
  );
}
