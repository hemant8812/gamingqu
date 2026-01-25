"use client";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  accept?: string;
  previewHeight?: number;
  initialUrl?: string | null;
  maxSizeMB?: number;
};

export function ImageUploadField({
  id,
  name,
  label,
  accept = "image/*",
  previewHeight = 160,
  initialUrl = null,
  maxSizeMB = 10,
}: Props) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        ref={inputRef}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.size > maxSizeMB * 1024 * 1024) {
              setError(`Ukuran file melebihi batas ${maxSizeMB}MB`);
              setPreview(null);
              e.currentTarget.value = "";
              return;
            }
            const url = URL.createObjectURL(file);
            setPreview(url);
            setError(null);
          } else {
            setPreview(null);
            setError(null);
          }
        }}
      />
      <div
        className="mt-2 relative rounded-xl border border-zinc-800 bg-black overflow-hidden flex items-center justify-center cursor-pointer h-full min-h-[200px]"
        style={previewHeight ? { height: previewHeight } : undefined}
        role="button"
        tabIndex={0}
        aria-label={`Pilih ${label}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {preview ? (
          <Image src={preview} alt="preview" fill className="object-cover" unoptimized />
        ) : (
          <div className="text-xs text-zinc-500">Belum ada gambar dipilih</div>
        )}
      </div>
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      {!error && <div className="mt-1 text-[11px] text-zinc-500">Maks {maxSizeMB}MB, format gambar umum</div>}
    </div>
  );
}
